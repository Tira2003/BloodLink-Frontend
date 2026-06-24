package com.bloodlink.notification.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendDonationNotification(String recipientEmail, String donorName, String requestDetails) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@bloodlink.com");
            message.setTo(recipientEmail);
            message.setSubject("Urgent: Blood Donation Request");
            message.setText(buildDonationEmailBody(donorName, requestDetails));
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }

    public void sendAcceptanceNotification(String recipientEmail, String patientName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@bloodlink.com");
            message.setTo(recipientEmail);
            message.setSubject("Blood Donation Request Accepted");
            message.setText(buildAcceptanceEmailBody(patientName));
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }

    public void sendCompletionNotification(String recipientEmail, String rewardPoints) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@bloodlink.com");
            message.setTo(recipientEmail);
            message.setSubject("Thank You for Your Donation");
            message.setText(buildCompletionEmailBody(rewardPoints));
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }

    private String buildDonationEmailBody(String donorName, String requestDetails) {
        return "Hello " + donorName + ",\n\n" +
                "An urgent blood donation request has been made:\n" +
                requestDetails + "\n\n" +
                "Your blood type matches this request. Would you like to help save a life?\n\n" +
                "Login to the BloodLink app to accept or decline this request.\n\n" +
                "Thank you,\nBloodLink Team";
    }

    private String buildAcceptanceEmailBody(String patientName) {
        return "Hello " + patientName + ",\n\n" +
                "Good news! A donor has accepted your blood donation request.\n" +
                "The donor will contact you shortly with more details.\n\n" +
                "Thank you for using BloodLink.\n\n" +
                "Best regards,\nBloodLink Team";
    }

    private String buildCompletionEmailBody(String rewardPoints) {
        return "Hello,\n\n" +
                "Thank you for completing your blood donation!\n" +
                "You have earned " + rewardPoints + " reward points.\n\n" +
                "Your contribution saves lives. We appreciate your generosity!\n\n" +
                "Best regards,\nBloodLink Team";
    }
}
