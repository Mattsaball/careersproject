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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    public String getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(String graduationYear) {
        this.graduationYear = graduationYear;
    }

    public boolean isAnonymous() {
        return anonymous;
    }

    public void setAnonymous(boolean anonymous) {
        this.anonymous = anonymous;
    }

    public String getClubs() {
        return clubs;
    }

    public void setClubs(String clubs) {
        this.clubs = clubs;
    }

    public String getResources() {
        return resources;
    }

    public void setResources(String resources) {
        this.resources = resources;
    }

    public String getMissed() {
        return missed;
    }

    public void setMissed(String missed) {
        this.missed = missed;
    }

    public String getAdvice() {
        return advice;
    }

    public void setAdvice(String advice) {
        this.advice = advice;
    }

    public List<String> getSummers() {
        return summers;
    }

    public void setSummers(List<String> summers) {
        this.summers = summers;
    }
}
