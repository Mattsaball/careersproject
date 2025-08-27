package com.cujourneys.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cujourneys.backend.model.Industry;

public interface IndustryRepository extends JpaRepository<Industry, Long> {
    Optional<Industry> findByNameIgnoreCase(String name);
  }
  