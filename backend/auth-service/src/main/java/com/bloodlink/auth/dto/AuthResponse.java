package com.bloodlink.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private UUID userId;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String accessToken;
    private String refreshToken;
    private String message;
}
