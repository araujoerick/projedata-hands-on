package com.projedata.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
class RawMaterialResourceTest {

    @BeforeEach
    void cleanup() {
        // Use API to delete all — avoids transaction isolation issues with direct Panache calls
        var ids = given()
                .when().get("/api/raw-materials")
                .then().statusCode(200)
                .extract().jsonPath().getList("id", Integer.class);
        for (Integer id : ids) {
            given().when().delete("/api/raw-materials/" + id).then().statusCode(204);
        }
    }

    @Test
    void list_returnsEmptyArray() {
        given()
            .when().get("/api/raw-materials")
            .then()
            .statusCode(200)
            .body("$", hasSize(0));
    }

    @Test
    void list_returnsExistingItems() {
        given()
            .contentType(ContentType.JSON)
            .body("""
                {"name": "Prancha de Pinus", "stockQuantity": 120.0}
                """)
            .when().post("/api/raw-materials")
            .then().statusCode(201);

        given()
            .when().get("/api/raw-materials")
            .then()
            .statusCode(200)
            .body("$", hasSize(1))
            .body("[0].name", equalTo("Prancha de Pinus"))
            .body("[0].stockQuantity", equalTo(120.0F));
    }

    @Test
    void create_persistsAndReturns201() {
        given()
            .contentType(ContentType.JSON)
            .body("""
                {"name": "Cola para Madeira", "stockQuantity": 15.5}
                """)
            .when().post("/api/raw-materials")
            .then()
            .statusCode(201)
            .body("name", equalTo("Cola para Madeira"))
            .body("stockQuantity", equalTo(15.5F))
            .body("id", notNullValue());
    }

    @Test
    void create_returns400WhenNameBlank() {
        given()
            .contentType(ContentType.JSON)
            .body("""
                {"name": "", "stockQuantity": 10}
                """)
            .when().post("/api/raw-materials")
            .then()
            .statusCode(400);
    }

    @Test
    void create_returns400WhenStockNegative() {
        given()
            .contentType(ContentType.JSON)
            .body("""
                {"name": "Material", "stockQuantity": -1}
                """)
            .when().post("/api/raw-materials")
            .then()
            .statusCode(400);
    }

    @Test
    void update_changesValues() {
        int id = given()
            .contentType(ContentType.JSON)
            .body("""
                {"name": "Original", "stockQuantity": 10.0}
                """)
            .when().post("/api/raw-materials")
            .then().statusCode(201)
            .extract().jsonPath().getInt("id");

        given()
            .contentType(ContentType.JSON)
            .body("""
                {"name": "Atualizado", "stockQuantity": 25.0}
                """)
            .when().put("/api/raw-materials/" + id)
            .then()
            .statusCode(200)
            .body("name", equalTo("Atualizado"))
            .body("stockQuantity", equalTo(25.0F));
    }

    @Test
    void update_returns404ForUnknownId() {
        given()
            .contentType(ContentType.JSON)
            .body("""
                {"name": "X", "stockQuantity": 1}
                """)
            .when().put("/api/raw-materials/99999")
            .then()
            .statusCode(404);
    }

    @Test
    void delete_removesItem() {
        int id = given()
            .contentType(ContentType.JSON)
            .body("""
                {"name": "Para Excluir", "stockQuantity": 5.0}
                """)
            .when().post("/api/raw-materials")
            .then().statusCode(201)
            .extract().jsonPath().getInt("id");

        given()
            .when().delete("/api/raw-materials/" + id)
            .then()
            .statusCode(204);

        given()
            .when().get("/api/raw-materials/" + id)
            .then()
            .statusCode(404);
    }

    @Test
    void findById_returns404ForUnknownId() {
        given()
            .when().get("/api/raw-materials/99999")
            .then()
            .statusCode(404);
    }
}
