// src/main/java/com/cujourneys/backend/model/Journey.java
package com.cujourneys.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "journey")
@Getter
@Setter
@NoArgsConstructor
public class Journey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String advice;

    private Boolean anonymous;

    private String clubs;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    private String linkedin;
    private String missed;
    private String name;
    private String resources;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // ----------------------------
    // NEW: industries (enum set)
    // ----------------------------
    @ElementCollection(targetClass = IndustryCategory.class, fetch = FetchType.EAGER)
    @CollectionTable(
        name = "journey_industries",
        joinColumns = @JoinColumn(name = "journey_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "industry")
    private Set<IndustryCategory> industries = new HashSet<>();
}
