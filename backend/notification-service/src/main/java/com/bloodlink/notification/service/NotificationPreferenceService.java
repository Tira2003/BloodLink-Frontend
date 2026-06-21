package com.bloodlink.notification.service;

import com.bloodlink.notification.dto.NotificationPreferenceDTO;
import com.bloodlink.notification.entity.NotificationPreference;
import com.bloodlink.notification.repository.NotificationPreferenceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationPreferenceService {

    private final NotificationPreferenceRepository preferenceRepository;

    @Transactional
    public NotificationPreferenceDTO createPreference(UUID userId) {
        log.info("Creating notification preferences for user: {}", userId);
        
        NotificationPreference preference = NotificationPreference.builder()
                .userId(userId)
                .emailNotifications(true)
                .smsNotifications(true)
                .pushNotifications(true)
                .donationReminders(true)
                .bloodRequestAlerts(true)
                .appointmentReminders(true)
                .hospitalUpdates(true)
                .build();
        
        NotificationPreference saved = preferenceRepository.save(preference);
        return mapToDTO(saved);
    }

    public NotificationPreferenceDTO getPreference(UUID userId) {
        log.info("Fetching notification preferences for user: {}", userId);
        return preferenceRepository.findByUserId(userId)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Preferences not found"));
    }

    @Transactional
    public NotificationPreferenceDTO updatePreference(UUID userId, NotificationPreferenceDTO dto) {
        log.info("Updating notification preferences for user: {}", userId);
        NotificationPreference preference = preferenceRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Preferences not found"));
        
        preference.setEmailNotifications(dto.getEmailNotifications());
        preference.setSmsNotifications(dto.getSmsNotifications());
        preference.setPushNotifications(dto.getPushNotifications());
        preference.setDonationReminders(dto.getDonationReminders());
        preference.setBloodRequestAlerts(dto.getBloodRequestAlerts());
        preference.setAppointmentReminders(dto.getAppointmentReminders());
        preference.setHospitalUpdates(dto.getHospitalUpdates());
        
        NotificationPreference updated = preferenceRepository.save(preference);
        return mapToDTO(updated);
    }

    private NotificationPreferenceDTO mapToDTO(NotificationPreference preference) {
        return NotificationPreferenceDTO.builder()
                .id(preference.getId())
                .userId(preference.getUserId())
                .emailNotifications(preference.getEmailNotifications())
                .smsNotifications(preference.getSmsNotifications())
                .pushNotifications(preference.getPushNotifications())
                .donationReminders(preference.getDonationReminders())
                .bloodRequestAlerts(preference.getBloodRequestAlerts())
                .appointmentReminders(preference.getAppointmentReminders())
                .hospitalUpdates(preference.getHospitalUpdates())
                .build();
    }
}
