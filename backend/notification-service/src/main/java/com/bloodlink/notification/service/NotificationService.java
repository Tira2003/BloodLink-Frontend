package com.bloodlink.notification.service;

import com.bloodlink.notification.dto.CreateNotificationRequest;
import com.bloodlink.notification.dto.NotificationDTO;
import com.bloodlink.notification.entity.Notification;
import com.bloodlink.notification.entity.NotificationType;
import com.bloodlink.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public NotificationDTO createNotification(CreateNotificationRequest request) {
        log.info("Creating notification for user: {}", request.getUserId());
        
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .title(request.getTitle())
                .message(request.getMessage())
                .type(NotificationType.valueOf(request.getType()))
                .relatedId(request.getRelatedId())
                .actionUrl(request.getActionUrl())
                .isRead(false)
                .build();
        
        Notification saved = notificationRepository.save(notification);
        return mapToDTO(saved);
    }

    public NotificationDTO getNotificationById(UUID id) {
        log.info("Fetching notification: {}", id);
        return notificationRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    public List<NotificationDTO> getNotificationsByUser(UUID userId) {
        log.info("Fetching notifications for user: {}", userId);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getUnreadNotifications(UUID userId) {
        log.info("Fetching unread notifications for user: {}", userId);
        return notificationRepository.findByUserIdAndIsReadFalse(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getNotificationsByType(UUID userId, String type) {
        log.info("Fetching notifications for user: {} type: {}", userId, type);
        return notificationRepository.findByUserIdAndType(userId, NotificationType.valueOf(type))
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public NotificationDTO markAsRead(UUID id) {
        log.info("Marking notification as read: {}", id);
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        notification.setIsRead(true);
        Notification updated = notificationRepository.save(notification);
        return mapToDTO(updated);
    }

    @Transactional
    public void markAllAsRead(UUID userId) {
        log.info("Marking all notifications as read for user: {}", userId);
        notificationRepository.markAllAsRead(userId);
    }

    public long getUnreadCount(UUID userId) {
        log.info("Getting unread count for user: {}", userId);
        return notificationRepository.countUnreadByUserId(userId);
    }

    @Transactional
    public void deleteNotification(UUID id) {
        log.info("Deleting notification: {}", id);
        notificationRepository.deleteById(id);
    }

    public List<NotificationDTO> getNotificationsByDateRange(UUID userId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Fetching notifications for user: {} between {} and {}", userId, startDate, endDate);
        return notificationRepository.findByUserIdAndDateRange(userId, startDate, endDate)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private NotificationDTO mapToDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType().toString())
                .isRead(notification.getIsRead())
                .relatedId(notification.getRelatedId())
                .actionUrl(notification.getActionUrl())
                .createdAt(notification.getCreatedAt())
                .updatedAt(notification.getUpdatedAt())
                .build();
    }
}
