package com.ecommerce.cacao.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expiration;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expiration
    ) {

        if (secret == null
                || secret.length() < 32) {

            throw new IllegalArgumentException(
                    "JWT secret must contain at least 32 characters"
            );
        }

        this.secretKey =
                Keys.hmacShaKeyFor(
                        secret.getBytes(
                                StandardCharsets.UTF_8
                        )
                );

        this.expiration =
                expiration;
    }

    public String generateToken(
            UserDetails userDetails
    ) {

        Map<String, Object> claims =
                new HashMap<>();

        return Jwts.builder()
                .claims(claims)
                .subject(
                        userDetails.getUsername()
                )
                .issuedAt(
                        new Date()
                )
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + expiration
                        )
                )
                .signWith(
                        secretKey
                )
                .compact();
    }

    public String extractUsername(
            String token
    ) {

        return extractAllClaims(token)
                .getSubject();
    }

    public boolean isTokenValid(
            String token,
            UserDetails userDetails
    ) {

        try {

            String username =
                    extractUsername(token);

            return username != null
                    && username.equals(
                    userDetails.getUsername()
            )
                    && !isTokenExpired(token);

        } catch (Exception exception) {

            System.out.println(
                    "JWT SERVICE - Token validation error: "
                            + exception.getClass()
                            .getName()
            );

            System.out.println(
                    "JWT SERVICE - "
                            + exception.getMessage()
            );

            return false;
        }
    }

    private boolean isTokenExpired(
            String token
    ) {

        Date expirationDate =
                extractAllClaims(token)
                        .getExpiration();

        return expirationDate == null
                || expirationDate.before(
                new Date()
        );
    }

    private Claims extractAllClaims(
            String token
    ) {

        return Jwts.parser()
                .verifyWith(
                        secretKey
                )
                .build()
                .parseSignedClaims(
                        token
                )
                .getPayload();
    }
}