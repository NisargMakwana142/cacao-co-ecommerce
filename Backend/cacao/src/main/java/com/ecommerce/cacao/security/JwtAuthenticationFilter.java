package com.ecommerce.cacao.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService
    ) {
        this.jwtService =
                jwtService;

        this.userDetailsService =
                userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        /*
         * Temporary diagnostic logging.
         *
         * This lets us confirm that the browser is actually
         * sending the JWT to Spring Boot.
         */
        System.out.println(
                "JWT FILTER - "
                        + request.getMethod()
                        + " "
                        + request.getRequestURI()
        );

        System.out.println(
                "JWT FILTER - Authorization header present: "
                        + (authHeader != null)
        );

        if (authHeader == null
                || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        String jwt =
                authHeader
                        .substring(7)
                        .trim();

        if (jwt.isEmpty()) {

            System.out.println(
                    "JWT FILTER - Empty JWT"
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        try {

            String email =
                    jwtService.extractUsername(jwt);

            System.out.println(
                    "JWT FILTER - Extracted username: "
                            + email
            );

            if (email != null
                    && SecurityContextHolder
                    .getContext()
                    .getAuthentication() == null) {

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(
                                        email
                                );

                boolean valid =
                        jwtService.isTokenValid(
                                jwt,
                                userDetails
                        );

                System.out.println(
                        "JWT FILTER - Token valid: "
                                + valid
                );

                System.out.println(
                        "JWT FILTER - User authorities: "
                                + userDetails.getAuthorities()
                );

                if (valid) {

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );

                    System.out.println(
                            "JWT FILTER - Authentication successful for: "
                                    + email
                    );
                }
            }

        } catch (Exception exception) {

            System.out.println(
                    "JWT FILTER - JWT VALIDATION FAILED"
            );

            System.out.println(
                    "JWT FILTER - Exception: "
                            + exception.getClass().getName()
            );

            System.out.println(
                    "JWT FILTER - Message: "
                            + exception.getMessage()
            );

            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}