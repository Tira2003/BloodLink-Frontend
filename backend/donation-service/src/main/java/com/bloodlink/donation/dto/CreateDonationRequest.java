package com.bloodlink.donation.dto;

import jakarta.validation.constraints.*;
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
public class CreateDonationRequest {
    
    @NotNull(message = "Donor ID is required")
    private UUID donorId;
    
    @NotNull(message = "Hospital ID is required")
    private UUID hospitalId;
    
    @NotBlank(message = "Blood type is required")
    private String bloodType;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 100, message = "Minimum donation quantity is 100ml")
    @Max(value = 500, message = "Maximum donation quantity is 500ml")
    private Integer quantityMl;
    
    @NotNull(message = "Donation date is required")
    @FutureOrPresent(message = "Donation date cannot be in the past")
    private LocalDateTime donationDate;
    
    private String notes;
    
    private String collectionCenter;
}
