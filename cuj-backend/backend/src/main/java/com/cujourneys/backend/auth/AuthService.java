package com.cujourneys.backend.auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.cujourneys.backend.model.User;
import com.cujourneys.backend.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String name, String email, String rawPassword) {
        String normalized = email.toLowerCase().trim();
        if (userRepo.existsByEmailIgnoreCase(normalized)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "EMAIL_TAKEN");
        }
        User u = new User();
        u.setName(name);
        u.setEmail(normalized);
        u.setPassword(passwordEncoder.encode(rawPassword)); // BCrypt
        u.setRole("USER");
        return userRepo.save(u);
    }

    public User validateLogin(String email, String rawPassword) {
        return userRepo.findByEmailIgnoreCase(email.toLowerCase().trim())
            .filter(u -> passwordEncoder.matches(rawPassword, u.getPassword()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS"));
    }
}
