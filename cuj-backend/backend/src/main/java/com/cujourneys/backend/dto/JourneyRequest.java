// src/main/java/com/cujourneys/backend/dto/JourneyRequest.java
package com.cujourneys.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
// dto
public class JourneyRequest {
    private String year; // "Class of 2025"
    private List<String> majorFilters;   // NEW
    private List<String> careerFilter;   // optional structured industries
  
    private String majorMinor;           // display
    private String postGradPlans;
    private String previousExperiences;
    private String freshmanSophomoreAdvice;
    private String skills;
    private String hacks;
    private String networking;
    private String additionalAdvice;
    // getters/setters
  }
  