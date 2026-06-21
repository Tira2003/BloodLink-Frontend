package com.bloodlink.notification.controller;

import com.bloodlink.notification.dto.CreateNotificationRequest;
import com.bloodlink.notification.dto.NotificationDTO;
import com.bloodlink.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"})
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('HOSPITAL')")
    public ResponseEntity<NotificationDTO> createNotification(@Valid @RequestBody CreateNotificationRequest request) {
        log.info("Creating notification");
        NotificationDTO notification = notificationService.createNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(notification);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationDTO> getNotification(@PathVariable UUID id) {
        log.info("Fetching notification: {}", id);
        NotificationDTO notification = notificationService.getNotificationById(id);
        return ResponseEntity.ok(notification);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByUser(@PathVariable UUID userId) {
        log.info("Fetching notifications for user: {}", userId);
        List<NotificationDTO> notifications = notificationService.getNotificationsByUser(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(@PathVariable UUID userId) {
        log.info("Fetching unread notifications for user: {}", userId);
        List<NotificationDTO> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByType(
            @PathVariable UUID userId,
            @PathVariable String type) {
        log.info("Fetching notifications for user: {} type: {}", userId, type);
        List<NotificationDTO> notifications = notificationService.getNotificationsByType(userId, type);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDTO> markAsRead(@PathVariable UUID id) {
        log.info("Marking notification as read: {}", id);
        NotificationDTO notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(notification);
    }

    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable UUID userId) {
        log.info("Marking all notifications as read for user: {}", userId);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable UUID userId) {
        log.info("Getting unread count for user: {}", userId);
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable UUID id) {
        log.info("Deleting notification: {}", id);
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}/history")
    public ResponseEntity<List<NotificationDTO>> getNotificationHistory(
            @PathVariable UUID userId,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate) {
        log.info("Fetching notification history for user: {}", userId);
        
        if (startDate != null && endDate != null) {
            List<NotificationDTO> notifications = notificationService.getNotificationsByDateRange(userId, startDate, endDate);
            return ResponseEntity.ok(notifications);
        }
        
        List<NotificationDTO> notifications = notificationService.getNotificationsByUser(userId);
        return ResponseEntity.ok(notifications);
    }
}
