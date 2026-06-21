package com.bloodlink.notification.controller;

import com.bloodlink.notification.dto.NotificationPreferenceDTO;
import com.bloodlink.notification.service.NotificationPreferenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications/preferences")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"})
public class NotificationPreferenceController {

    private final NotificationPreferenceService preferenceService;

    @PostMapping
    public ResponseEntity<NotificationPreferenceDTO> createPreference(@RequestParam UUID userId) {
        log.info("Creating notification preferences for user: {}", userId);
        NotificationPreferenceDTO preference = preferenceService.createPreference(userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(preference);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<NotificationPreferenceDTO> getPreference(@PathVariable UUID userId) {
        log.info("Fetching notification preferences for user: {}", userId);
        NotificationPreferenceDTO preference = preferenceService.getPreference(userId);
        return ResponseEntity.ok(preference);
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<NotificationPreferenceDTO> updatePreference(
            @PathVariable UUID userId,
            @Valid @RequestBody NotificationPreferenceDTO dto) {
        log.info("Updating notification preferences for user: {}", userId);
        NotificationPreferenceDTO preference = preferenceService.updatePreference(userId, dto);
        return ResponseEntity.ok(preference);
    }
}
