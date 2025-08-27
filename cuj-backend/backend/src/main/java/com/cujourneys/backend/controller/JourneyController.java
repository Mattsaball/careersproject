// src/main/java/com/cujourneys/backend/controller/JourneyController.java
package com.cujourneys.backend.controller;

import com.cujourneys.backend.dto.JourneyRequest;
import com.cujourneys.backend.dto.JourneyResponse;
import com.cujourneys.backend.model.IndustryCategory;
import com.cujourneys.backend.service.JourneyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/journeys")
@CrossOrigin(origins = "http://localhost:5173")
public class JourneyController {

    private final JourneyService journeyService;

    public JourneyController(JourneyService journeyService) {
        this.journeyService = journeyService;
    }

    /**
     * List journeys with filters (multi-industry), search, pagination, and sorting.
     * Example:
     *   GET /api/journeys?industries=TECH&industries=FINANCE&q=intern&page=0&size=20&sort=createdAt,desc
     */
    @GetMapping
    public Page<JourneyResponse> list(
            @RequestParam(required = false) List<String> industries,
            @RequestParam(required = false) Integer graduationYear,
            @RequestParam(required = false) Boolean anonymous,
            @RequestParam(required = false, name = "q") String query,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        return journeyService.search(industries, graduationYear, anonymous, query, pageable);
    }

    /**
     * Create a journey (supports multiple industries by name).
     */
    @PostMapping
    public JourneyResponse create(@RequestBody JourneyRequest req) {
        return journeyService.create(req);
    }

    /**
     * Update a journey.
     */
    @PutMapping("/{id}")
    public JourneyResponse update(@PathVariable Long id, @RequestBody JourneyRequest req) {
        return journeyService.update(id, req);
    }

    /**
     * List available industry categories for the filter UI.
     */
    @GetMapping("/industries")
    public List<String> industries() {
        return Arrays.stream(IndustryCategory.values())
                .map(Enum::name)
                .toList();
    }
}
