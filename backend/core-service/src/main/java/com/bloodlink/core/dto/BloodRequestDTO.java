package com.bloodlink.core.dto;

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
public class BloodRequestDTO {
    private UUID id;
    private UUID userId;
    private String bloodType;
    private Integer quantityNeeded;
    private String status;
    private String urgency;
    private String hospitalName;
    private String district;
    private String locationDetails;
    private String reason;
    private LocalDateTime createdAt;
    private LocalDateTime fulfilledDate;
}
