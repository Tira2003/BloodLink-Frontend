package com.bloodlink.core.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "blood_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Donor.BloodType bloodType;

    private Integer quantityNeeded;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    private String urgency;
    private String hospitalName;
    private String district;
    private String locationDetails;
    private String reason;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime fulfilledDate;

    public enum RequestStatus {
        ACTIVE, FULFILLED, CANCELLED
    }
}
