package com.bloodlink.notification.listener;

import com.bloodlink.notification.service.EmailService;
import com.bloodlink.notification.service.NotificationService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class DonationEventListener {
    private final NotificationService notificationService;
    private final EmailService emailService;

    public DonationEventListener(NotificationService notificationService, EmailService emailService) {
        this.notificationService = notificationService;
        this.emailService = emailService;
    }

    @EventListener
    public void onDonationMatched(DonationMatchedEvent event) {
        // Create in-app notification
        notificationService.createNotification(
                event.userId,
                "Blood Donation Request",
                "An urgent blood donation request matches your blood type. Your help can save lives!",
                "DONATION_REQUEST"
        );

        // Send email notification (would need actual email from user service)
        System.out.println("[v0] Donation matched event received for user: " + event.userId);
    }

    @EventListener
    public void onDonationAccepted(DonationAcceptedEvent event) {
        // Create in-app notification for patient
        notificationService.createNotification(
                event.patientId,
                "Donor Accepted Your Request",
                "Great news! A donor has accepted your blood donation request.",
                "DONATION_ACCEPTED"
        );

        // Notify donor
        notificationService.createNotification(
                event.donorId,
                "Donation Request Accepted",
                "You have accepted a blood donation request. Please complete the donation soon.",
                "DONATION_ACCEPTED_CONFIRMATION"
        );

        System.out.println("[v0] Donation accepted event received");
    }

    @EventListener
    public void onDonationCompleted(DonationCompletedEvent event) {
        // Reward notification
        notificationService.createNotification(
                event.donorId,
                "Donation Completed - Rewards Earned",
                "Thank you for completing your blood donation! You have earned " + event.rewardPoints + " reward points.",
                "DONATION_COMPLETED"
        );

        // Patient notification
        notificationService.createNotification(
                event.patientId,
                "Blood Donation Complete",
                "Your blood donation request has been fulfilled. Thank you to our generous donor!",
                "DONATION_FULFILLED"
        );

        System.out.println("[v0] Donation completed event received for donor: " + event.donorId);
    }

    // Event classes
    public static class DonationMatchedEvent {
        public final UUID userId;
        public final UUID donorId;
        public final UUID requestId;

        public DonationMatchedEvent(UUID userId, UUID donorId, UUID requestId) {
            this.userId = userId;
            this.donorId = donorId;
            this.requestId = requestId;
        }
    }

    public static class DonationAcceptedEvent {
        public final UUID donorId;
        public final UUID patientId;
        public final UUID requestId;

        public DonationAcceptedEvent(UUID donorId, UUID patientId, UUID requestId) {
            this.donorId = donorId;
            this.patientId = patientId;
            this.requestId = requestId;
        }
    }

    public static class DonationCompletedEvent {
        public final UUID donorId;
        public final UUID patientId;
        public final UUID requestId;
        public final Integer rewardPoints;

        public DonationCompletedEvent(UUID donorId, UUID patientId, UUID requestId, Integer rewardPoints) {
            this.donorId = donorId;
            this.patientId = patientId;
            this.requestId = requestId;
            this.rewardPoints = rewardPoints;
        }
    }
}
