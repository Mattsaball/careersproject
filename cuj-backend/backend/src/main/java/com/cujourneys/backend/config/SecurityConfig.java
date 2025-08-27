// src/main/java/com/cujourneys/backend/config/SecurityConfig.java
package com.cujourneys.backend.config;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfigurationSource;

import com.cujourneys.backend.jwt.JWTAuthFilter; // <- ensure this is the correct class & package

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    // These must be constructor-injected beans (final)
    private final CorsConfigurationSource corsConfigurationSource;
    private final JWTAuthFilter jwtAuthFilter; // <- final so @RequiredArgsConstructor injects it

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public GETs
                .requestMatchers(HttpMethod.GET, "/api/industries").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/journeys", "/api/journeys/**").permitAll()

                // Auth + actuator open
                .requestMatchers("/api/auth/**", "/actuator/**").permitAll()

                // CORS preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Everything else protected
                .anyRequest().authenticated()
            )
            .exceptionHandling(e -> e
                .authenticationEntryPoint((req, res, ex) ->
                    res.sendError(HttpServletResponse.SC_UNAUTHORIZED))
            );

        // Register the JWT filter BEFORE UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
