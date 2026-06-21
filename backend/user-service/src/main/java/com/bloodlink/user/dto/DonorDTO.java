package com.bloodlink.user.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonorDTO {
    private UUID id;
    private UUID userId;
    private LocalDate lastDonationDate;
    private Integer totalDonations;
    private Boolean isEligibleToDonate;
    private String medicalConditions;
    private String medications;
    private String allergies;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
