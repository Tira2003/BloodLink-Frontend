package com.bloodlink.donation.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
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
public class BookAppointmentRequest {
    
    @NotNull(message = "Donor ID is required")
    private UUID donorId;
    
    @NotNull(message = "Hospital ID is required")
    private UUID hospitalId;
    
    @NotNull(message = "Appointment date is required")
    @FutureOrPresent(message = "Appointment date cannot be in the past")
    private LocalDateTime appointmentDate;
    
    private String notes;
    
    private String collectionCenter;
}
