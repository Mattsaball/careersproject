package com.cujourneys.backend.jwt;

import com.cujourneys.backend.service.CustomUserDetailsService;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JWTAuthFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        final String path   = request.getRequestURI();    // safer than getServletPath behind proxies
        final String method = request.getMethod();

        System.out.println("[JWT] → " + method + " " + path);

        // 1) Skip error dispatches and public endpoints that should never trigger auth
        if (request.getDispatcherType() == DispatcherType.ERROR
                || path.startsWith("/api/auth/")
                || path.startsWith("/h2-console")) {

            System.out.println("[JWT]   Skipping (error/auth/h2): " + method + " " + path);
            chain.doFilter(request, response);
            return;
        }

        // 2) If already authenticated (another filter set it), just continue
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            System.out.println("[JWT]   Already authenticated in context. Continuing chain.");
            chain.doFilter(request, response);
            return;
        }

        // 3) No Authorization header → allow as anonymous (permitAll routes will pass)
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("[JWT]   No/invalid Authorization header. Continuing unauthenticated.");
            chain.doFilter(request, response);
            return;
        }

        // 4) Extract and validate token
        final String token = authHeader.substring(7);
        String username;

        try {
            username = jwtService.extractUsername(token);
            System.out.println("[JWT]   Token subject: " + username);
        } catch (Exception e) {
            System.out.println("[JWT]   extractUsername FAILED: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            chain.doFilter(request, response);
            return;
        }

        if (username != null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                boolean valid = jwtService.isTokenValid(token, userDetails);
                System.out.println("[JWT]   isTokenValid = " + valid);

                if (valid) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("[JWT]   SecurityContext set for " + username);
                } else {
                    System.out.println("[JWT]   Token invalid for user " + username + ". Continuing unauthenticated.");
                }
            } catch (Exception e) {
                System.out.println("[JWT]   loadUser / validate FAILED: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            }
        } else {
            System.out.println("[JWT]   Username was null after extract. Continuing.");
        }

        // 5) Continue once
        chain.doFilter(request, response);
    }
}
