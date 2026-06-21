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
public class BloodInventoryDTO {
    private UUID id;
    private UUID hospitalId;
    private String bloodType;
    private Integer quantityMl;
    private Integer minimumThreshold;
    private LocalDateTime expiryDate;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isLowStock;
    private boolean isExpired;
}
