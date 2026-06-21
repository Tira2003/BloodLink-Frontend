package com.bloodlink.user.service;

import com.bloodlink.user.dto.*;
import com.bloodlink.user.entity.User;
import com.bloodlink.user.entity.UserRole;
import com.bloodlink.user.entity.UserStatus;
import com.bloodlink.user.exception.ResourceNotFoundException;
import com.bloodlink.user.exception.UnauthorizedException;
import com.bloodlink.user.repository.UserRepository;
import com.bloodlink.user.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.jwtExpirationMs:86400000}")
    private int jwtExpirationMs;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(UserRole.valueOf(request.getRole()));
        user.setStatus(UserStatus.PENDING_VERIFICATION);

        user = userRepository.save(user);
        log.info("User registered successfully: {}", user.getEmail());

        // Generate tokens
        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail(), user.getId().toString(), user.getRole().toString());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail(), user.getId().toString());

        UserDTO userDTO = UserDTO.fromEntity(user);

        return AuthResponse.of(accessToken, refreshToken, userDTO, (long) jwtExpirationMs / 1000);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new UnauthorizedException("Account is suspended");
        }

        log.info("User logged in successfully: {}", user.getEmail());

        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail(), user.getId().toString(), user.getRole().toString());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail(), user.getId().toString());

        UserDTO userDTO = UserDTO.fromEntity(user);

        return AuthResponse.of(accessToken, refreshToken, userDTO, (long) jwtExpirationMs / 1000);
    }

    public AuthResponse refreshAccessToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        String email = jwtTokenProvider.getEmailFromToken(refreshToken);
        String userId = jwtTokenProvider.getUserIdFromToken(refreshToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new UnauthorizedException("Account is suspended");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(email, userId, user.getRole().toString());

        UserDTO userDTO = UserDTO.fromEntity(user);

        return AuthResponse.of(accessToken, refreshToken, userDTO, (long) jwtExpirationMs / 1000);
    }

    public void logout(String userId) {
        log.info("User logged out: {}", userId);
        // In a production app, you might want to add the token to a blacklist
    }
}
