package com.projedata.resource;

import com.projedata.dto.BomItemRequest;
import com.projedata.dto.BomItemResponse;
import com.projedata.dto.ProductDetailResponse;
import com.projedata.dto.ProductRequest;
import com.projedata.dto.ProductResponse;
import com.projedata.service.ProductService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/api/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Products")
public class ProductResource {

    @Inject
    ProductService service;

    @GET
    public List<ProductResponse> list() {
        return service.list();
    }

    @GET
    @Path("/{id}")
    public ProductDetailResponse findById(@PathParam("id") Long id) {
        return service.findById(id);
    }

    @POST
    public Response create(@Valid ProductRequest request) {
        ProductResponse response = service.create(request);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @PUT
    @Path("/{id}")
    public ProductResponse update(@PathParam("id") Long id, @Valid ProductRequest request) {
        return service.update(id, request);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        service.delete(id);
        return Response.noContent().build();
    }

    // BOM sub-endpoints

    @GET
    @Path("/{id}/raw-materials")
    @Tag(name = "BOM")
    public List<BomItemResponse> listBom(@PathParam("id") Long id) {
        return service.listBom(id);
    }

    @POST
    @Path("/{id}/raw-materials")
    @Tag(name = "BOM")
    public Response addBomItem(@PathParam("id") Long id, @Valid BomItemRequest request) {
        BomItemResponse response = service.addBomItem(id, request);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @PUT
    @Path("/{id}/raw-materials/{rmId}")
    @Tag(name = "BOM")
    public BomItemResponse updateBomItem(@PathParam("id") Long id,
                                         @PathParam("rmId") Long rmId,
                                         @Valid BomItemRequest request) {
        return service.updateBomItem(id, rmId, request);
    }

    @DELETE
    @Path("/{id}/raw-materials/{rmId}")
    @Tag(name = "BOM")
    public Response deleteBomItem(@PathParam("id") Long id, @PathParam("rmId") Long rmId) {
        service.deleteBomItem(id, rmId);
        return Response.noContent().build();
    }
}
