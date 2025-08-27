package com.cujourneys.backend.repository;

import java.util.Collection;
import java.util.Set;

import org.springframework.data.domain.Page;          // ✅ correct Page
import org.springframework.data.domain.Pageable;   // ✅ correct Pageable
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.cujourneys.backend.model.IndustryCategory;
import com.cujourneys.backend.model.Journey;

@Repository
public interface JourneyRepository extends JpaRepository<Journey, Long>, JpaSpecificationExecutor<Journey> {
    Page<Journey> findDistinctByIndustriesIn(Collection<IndustryCategory> industries, Pageable pageable);
}
