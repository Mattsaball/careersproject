package com.cujourneys.backend.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.cujourneys.backend.model.User;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class JWTService {

  // Prefer to set via application.properties: jwt.secret=<base64-encoded 256-bit key>
  @Value("${jwt.secret:}")
  private String SECRET;  // may be empty if not set; we'll guard below

  private static final long EXPIRATION_MS = 86_400_000L; // 1 day

  private Key getSignKey() {
    String secret = (SECRET == null || SECRET.isBlank())
        ? "Pp5Y0k8o3dQ2zW7r9uT6vB4n1mC5xE7a9sD3fG1hJ4kL8pO2qR6tU0wY2" // dev-only fallback
        : SECRET;

    byte[] keyBytes;
    try {
      // Try base64 first (recommended)
      keyBytes = Decoders.BASE64.decode(secret);
    } catch (IllegalArgumentException e) {
      // Fallback: treat as raw text
      keyBytes = secret.getBytes(StandardCharsets.UTF_8);
    }

    if (keyBytes.length < 32) {
      throw new IllegalStateException(
          "JWT secret key is too short (< 256 bits). Provide a base64-encoded 32+ byte secret in 'jwt.secret'.");
    }
    return Keys.hmacShaKeyFor(keyBytes);
  }

  // Overload for your entity
  public String generateToken(User user) {
    return generateToken(user.getEmail(), user.getId());
  }

  // Overload for Spring Security principals (optional)
  public String generateToken(UserDetails user) {
    return generateToken(user.getUsername(), null);
  }

  private String generateToken(String subject, Long userId) {
    var builder = Jwts.builder()
        .setSubject(subject)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS));
    if (userId != null) builder.claim("userId", userId);

    return builder
        .signWith(getSignKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  public String extractEmail(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(getSignKey())
        .build()
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
  }

  public boolean isTokenValid(String token, UserDetails userDetails) {
    String email = extractEmail(token);
    return email.equals(userDetails.getUsername()) && !isExpired(token);
  }

  private boolean isExpired(String token) {
    Date exp = Jwts.parserBuilder()
        .setSigningKey(getSignKey())
        .build()
        .parseClaimsJws(token)
        .getBody()
        .getExpiration();
    return exp.before(new Date());
  }
}
