package com.projedata.resource;

import com.projedata.dto.ProductionSuggestionResponse;
import com.projedata.service.ProductionPlanningService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

@Path("/api/production-planning")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Production Planning")
public class ProductionPlanningResource {

    @Inject
    ProductionPlanningService service;

    @GET
    @Path("/suggestions")
    public ProductionSuggestionResponse suggestions() {
        return service.suggest();
    }
}
