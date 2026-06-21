package com.bloodlink.inventory.dto;

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
public class BloodUnitDTO {
    private UUID id;
    private UUID donationId;
    private UUID hospitalId;
    private String bloodType;
    private Integer quantityMl;
    private String status;
    private LocalDateTime collectionDate;
    private LocalDateTime expiryDate;
    private String testingResults;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
