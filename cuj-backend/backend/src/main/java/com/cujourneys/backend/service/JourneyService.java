// src/main/java/com/cujourneys/backend/service/JourneyService.java
package com.cujourneys.backend.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.cujourneys.backend.dto.JourneyRequest;
import com.cujourneys.backend.dto.JourneyResponse;
import com.cujourneys.backend.model.IndustryCategory;
import com.cujourneys.backend.model.Journey;
import com.cujourneys.backend.repository.JourneyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JourneyService {

  private final JourneyRepository journeyRepo;

  /**
   * Search journeys with optional industry filter (pageable).
   * Note: year/anonymous/q can be added later via Specifications over enum fields.
   */
  public Page<JourneyResponse> search(
      List<String> industries, Integer year, Boolean anonymous, String q, Pageable pageable) {

    // industries → enum set (safe parse; ignore bad tokens)
    Set<IndustryCategory> cats = parseIndustries(industries);

    Page<Journey> page;
    if (cats == null || cats.isEmpty()) {
      page = journeyRepo.findAll(pageable);
    } else {
      page = journeyRepo.findDistinctByIndustriesIn(cats, pageable);
    }

    // TODO (optional): add year/anonymous/q via Specifications if needed.
    return page.map(JourneyResponse::from);
  }

  public JourneyResponse create(JourneyRequest req) {
    Journey j = new Journey();
    copy(j, req);
    return JourneyResponse.from(journeyRepo.save(j));
  }

  public JourneyResponse update(Long id, JourneyRequest req) {
    Journey j = journeyRepo.findById(id).orElseThrow();
    copy(j, req);
    return JourneyResponse.from(journeyRepo.save(j));
  }

  private void copy(Journey j, JourneyRequest req) {
    j.setName(req.getName());
    j.setAnonymous(req.getAnonymous());
    j.setLinkedin(req.getLinkedin());
    j.setGraduationYear(req.getGraduationYear());
    j.setClubs(req.getClubs());
    j.setResources(req.getResources());
    j.setAdvice(req.getAdvice());
    j.setMissed(req.getMissed());

    // industries: map incoming strings → enum set
    j.getIndustries().clear();
    Set<IndustryCategory> cats = parseIndustries(req.getIndustries());
    if (cats != null) {
      j.getIndustries().addAll(cats);
    }
  }

  private static Set<IndustryCategory> parseIndustries(List<String> names) {
    if (names == null) return null;
    return names.stream()
        .filter(s -> s != null && !s.isBlank())
        .map(s -> s.trim().toUpperCase().replace('-', '_'))
        .flatMap(s -> {
          try { return java.util.stream.Stream.of(IndustryCategory.valueOf(s)); }
          catch (IllegalArgumentException e) { return java.util.stream.Stream.empty(); }
        })
        .collect(Collectors.toSet());
  }
}
