package com.ecommerce.cacao.contoller;

import com.ecommerce.cacao.dto.AuthResponse;
import com.ecommerce.cacao.dto.LoginRequest;
import com.ecommerce.cacao.dto.RegisterRequest;
import com.ecommerce.cacao.entity.User;
import com.ecommerce.cacao.repository.UserRepository;
import com.ecommerce.cacao.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(
            AuthService authService,
            UserRepository userRepository
    ) {
        this.authService =
                authService;

        this.userRepository =
                userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        return ResponseEntity.ok(
                authService.register(request)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    /*
     * Returns the currently authenticated user.
     *
     * This endpoint is protected by SecurityConfig because
     * /api/auth/** is currently public. Therefore we explicitly
     * verify that Spring Security actually authenticated the user.
     */
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(
            Authentication authentication
    ) {

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName() == null) {

            return ResponseEntity
                    .status(401)
                    .build();
        }

        User user =
                userRepository
                        .findByEmail(
                                authentication.getName()
                        )
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "User not found"
                                )
                        );

        /*
         * We do not generate a new JWT here.
         *
         * The existing JWT has already been validated by
         * JwtAuthenticationFilter.
         */
        return ResponseEntity.ok(
                new AuthResponse(
                        null,
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().name()
                )
        );
    }
}

