package com.cujourneys.backend.controller;

import com.cujourneys.backend.model.Journey;    
import com.cujourneys.backend.repository.JourneyRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journeys")
@CrossOrigin(origins = "http://localhost:5173")
public class JourneyController {

    private final JourneyRepository journeyRepository;

    public JourneyController(JourneyRepository journeyRepository) {
        this.journeyRepository = journeyRepository;
    }

    @GetMapping
    public List<Journey> getAllJourneys() {
        return journeyRepository.findAll();
    }

    @PostMapping
    public Journey createJourney(@RequestBody Journey journey) {
        System.out.println("Received Journey: " + journey);
        return journeyRepository.save(journey);
    }
    
}
