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
public class DonationCampDTO {
    private UUID id;
    private String name;
    private UUID organizerId;
    private String locationName;
    private String district;
    private Double latitude;
    private Double longitude;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer targetUnits;
    private Integer collectedUnits;
    private String description;
    private boolean isActive;
}
