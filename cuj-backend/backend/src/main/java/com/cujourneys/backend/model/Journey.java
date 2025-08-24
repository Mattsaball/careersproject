// src/main/java/com/cujourneys/backend/model/Journey.java
package com.cujourneys.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Journey")
@Getter @Setter @NoArgsConstructor
public class Journey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String advice;

    // Use wrapper types so nulls are allowed
    private Boolean anonymous;

    private String clubs;

    @Column(name = "graduation_year")   // DB column is snake_case
    private Integer graduationYear;      // JSON will be camelCase

    private String linkedin;
    private String missed;
    private String name;
    private String resources;
}
