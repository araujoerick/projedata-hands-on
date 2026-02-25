package com.projedata.resource;

import com.projedata.dto.RawMaterialRequest;
import com.projedata.dto.RawMaterialResponse;
import com.projedata.service.RawMaterialService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/api/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Raw Materials")
public class RawMaterialResource {

    @Inject
    RawMaterialService service;

    @GET
    public List<RawMaterialResponse> list() {
        return service.list();
    }

    @GET
    @Path("/{id}")
    public RawMaterialResponse findById(@PathParam("id") Long id) {
        return service.findById(id);
    }

    @POST
    public Response create(@Valid RawMaterialRequest request) {
        RawMaterialResponse response = service.create(request);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @PUT
    @Path("/{id}")
    public RawMaterialResponse update(@PathParam("id") Long id, @Valid RawMaterialRequest request) {
        return service.update(id, request);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        service.delete(id);
        return Response.noContent().build();
    }
}
