package com.bloodlink.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationPreferenceDTO {
    private UUID id;
    private UUID userId;
    private Boolean emailNotifications;
    private Boolean smsNotifications;
    private Boolean pushNotifications;
    private Boolean donationReminders;
    private Boolean bloodRequestAlerts;
    private Boolean appointmentReminders;
    private Boolean hospitalUpdates;
}
