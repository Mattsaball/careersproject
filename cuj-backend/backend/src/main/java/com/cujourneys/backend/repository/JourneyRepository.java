package com.cujourneys.backend.repository;

import com.cujourneys.backend.model.Journey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JourneyRepository extends JpaRepository<Journey, Long> {
}
