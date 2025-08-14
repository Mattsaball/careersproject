package com.cujourneys.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cujourneys.backend.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Case-insensitive lookups (recommended)
    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}
