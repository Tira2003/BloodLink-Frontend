package com.bloodlink.user.controller;

import com.bloodlink.user.dto.*;
import com.bloodlink.user.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"})
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for email: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Refresh token request received");
        AuthResponse response = authService.refreshAccessToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(Authentication authentication) {
        if (authentication != null) {
            String userId = (String) authentication.getPrincipal();
            authService.logout(userId);
            log.info("User logged out: {}", userId);
        }
        return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthMeResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = (String) authentication.getPrincipal();
        AuthMeResponse response = AuthMeResponse.builder()
                .email(email)
                .authenticated(true)
                .build();

        return ResponseEntity.ok(response);
    }
}
