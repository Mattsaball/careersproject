// src/main/java/com/cujourneys/backend/dto/JourneyResponse.java
package com.cujourneys.backend.dto;

import java.time.Instant;
import java.util.List;

import com.cujourneys.backend.model.Journey;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JourneyResponse {
  private Long id;
  private String name;
  private boolean anonymous;
  private String linkedin;
  private Integer graduationYear;
  private String clubs;
  private String resources;
  private String advice;
  private String missed;
  private Instant createdAt;
  private List<String> industries;

  public static JourneyResponse from(Journey j) {
    return JourneyResponse.builder()
        .id(j.getId())
        .name(j.getName())
        .anonymous(Boolean.TRUE.equals(j.getAnonymous()))
        .linkedin(j.getLinkedin())
        .graduationYear(j.getGraduationYear())
        .clubs(j.getClubs())
        .resources(j.getResources())
        .advice(j.getAdvice())
        .missed(j.getMissed())
        .createdAt(j.getCreatedAt())
        // Map enum values to strings like "TECH", "FINANCE"
        .industries(j.getIndustries()
            .stream()
            .map(Enum::name)
            .toList())
        .build();
  }
}
