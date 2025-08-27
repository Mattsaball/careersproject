package com.cujourneys.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cujourneys.backend.model.Industry;
import com.cujourneys.backend.repository.IndustryRepository;

import lombok.RequiredArgsConstructor;

@RestController @RequestMapping("/api/industries") @RequiredArgsConstructor
public class IndustryController {
  private final IndustryRepository repo;

  @GetMapping
  public List<String> listNames() {
    return repo.findAll().stream().map(Industry::getName).sorted(String::compareToIgnoreCase).toList();
  }
}
