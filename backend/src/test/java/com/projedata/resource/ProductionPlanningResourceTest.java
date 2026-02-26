package com.projedata.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
class ProductionPlanningResourceTest {

    @BeforeEach
    void cleanup() {
        // Delete products first (cascade removes BOM), then raw materials
        var productIds = given()
                .when().get("/api/products")
                .then().statusCode(200)
                .extract().jsonPath().getList("id", Integer.class);
        for (Integer id : productIds) {
            given().when().delete("/api/products/" + id).then().statusCode(204);
        }

        var rmIds = given()
                .when().get("/api/raw-materials")
                .then().statusCode(200)
                .extract().jsonPath().getList("id", Integer.class);
        for (Integer id : rmIds) {
            given().when().delete("/api/raw-materials/" + id).then().statusCode(204);
        }
    }

    @Test
    void suggestions_returnsEmptyWhenNoData() {
        given()
            .when().get("/api/production-planning/suggestions")
            .then()
            .statusCode(200)
            .body("suggestions", hasSize(0))
            .body("grandTotalValue", equalTo(0));
    }

    @Test
    void suggestions_returnsCorrectPlanningResult() {
        // Create raw material
        int rmId = given()
            .contentType(ContentType.JSON)
            .body("""
                {"name": "Prancha", "stockQuantity": 6.0}
                """)
            .when().post("/api/raw-materials")
            .then().statusCode(201)
            .extract().jsonPath().getInt("id");

        // Create product
        int productId = given()
            .contentType(ContentType.JSON)
            .body("""
                {"name": "Mesa", "value": 350.00}
                """)
            .when().post("/api/products")
            .then().statusCode(201)
            .extract().jsonPath().getInt("id");

        // Add BOM item: requires 3 units → floor(6/3) = 2
        given()
            .contentType(ContentType.JSON)
            .body(String.format("""
                {"rawMaterialId": %d, "requiredQuantity": 3.0}
                """, rmId))
            .when().post("/api/products/" + productId + "/raw-materials")
            .then().statusCode(201);

        given()
            .when().get("/api/production-planning/suggestions")
            .then()
            .statusCode(200)
            .body("suggestions", hasSize(1))
            .body("suggestions[0].productName", equalTo("Mesa"))
            .body("suggestions[0].producibleQuantity", equalTo(2))
            .body("grandTotalValue", equalTo(700.0F));
    }
}
