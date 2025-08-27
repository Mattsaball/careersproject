package com.cujourneys.backend.auth;

import com.cujourneys.backend.auth.dto.AuthResponse;
import com.cujourneys.backend.auth.dto.LoginRequest;
import com.cujourneys.backend.auth.dto.RegisterRequest;
import com.cujourneys.backend.auth.dto.UserResponse;
import com.cujourneys.backend.jwt.CustomUserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        log.info("Register attempt for {}", req.getEmail());
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal CustomUserPrincipal principal) {
        return ResponseEntity.ok(UserResponse.from(principal.getUser()));
    }
}
