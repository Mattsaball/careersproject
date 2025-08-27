package com.cujourneys.backend.jwt;

import com.cujourneys.backend.service.CustomUserDetailsService;
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
import jakarta.servlet.DispatcherType;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JWTAuthFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain chain) throws ServletException, IOException {

    final String path = request.getServletPath();

    // 1) Skip error dispatches and public endpoints
    if (request.getDispatcherType() == DispatcherType.ERROR
        || path.startsWith("/api/auth/")
        || path.startsWith("/h2-console")) {
        chain.doFilter(request, response); // <-- here
        return;                            // <-- and return immediately
    }

    // 2) No Authorization header -> let the chain continue unauthenticated
    final String authHeader = request.getHeader("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        chain.doFilter(request, response); // <-- here
        return;                            // <-- and return
    }

    // 3) With token: try to authenticate; regardless, always continue the chain once at the end
    final String token = authHeader.substring(7);

    String username;
    try {
        username = jwtService.extractUsername(token);
    } catch (Exception e) {
        // Bad token -> proceed as anonymous
        chain.doFilter(request, response); // <-- here
        return;                            // <-- and return
    }

    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        if (jwtService.isTokenValid(token, userDetails)) {
            UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
    }

    // 4) Exactly one fall-through call when we didn't hit any early-return path
    chain.doFilter(request, response);
}
}
