package com.bloodlink.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private UUID id;
    private UUID userId;
    private String title;
    private String message;
    private String type;
    private Boolean isRead;
    private String relatedId;
    private String actionUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
