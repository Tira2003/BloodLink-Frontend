package com.bloodlink.user.security;

import lombok.Getter;
import org.springframework.security.web.authentication.WebAuthenticationDetails;

@Getter
public class JwtAuthenticationDetails {
    private final String userId;
    private final String role;

    public JwtAuthenticationDetails(String userId, String role) {
        this.userId = userId;
        this.role = role;
    }
}
