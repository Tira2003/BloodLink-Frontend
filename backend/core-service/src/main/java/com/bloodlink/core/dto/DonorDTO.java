package com.bloodlink.core.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonorDTO {
    private UUID id;
    private UUID userId;
    private String bloodType;
    private String gender;
    private LocalDate dateOfBirth;
    private boolean isActive;
    private Integer totalDonations;
    private Integer rewardPoints;
    private Double latitude;
    private Double longitude;
}
