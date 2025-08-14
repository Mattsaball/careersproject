package com.cujourneys.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Journey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String linkedin;

    @Column(name = "graduation_year")
    private String graduationYear;

    private boolean anonymous;
    private String clubs;
    private String resources;
    private String missed;
    private String advice;

    @ElementCollection
    private List<String> summers;

    // Getters and Setters
    // (you can generate these with Lombok later if desired)
}
