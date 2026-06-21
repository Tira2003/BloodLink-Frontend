package com.bloodlink.donation.dto;

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
public class DonationDTO {
    private UUID id;
    private UUID donorId;
    private UUID hospitalId;
    private String bloodType;
    private Integer quantityMl;
    private String status;
    private LocalDateTime donationDate;
    private String notes;
    private String collectionCenter;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
