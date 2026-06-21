package com.bloodlink.inventory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "blood_units")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID donationId;

    @Column(nullable = false)
    private UUID hospitalId;

    @Column(nullable = false)
    private String bloodType;

    @Column(nullable = false)
    private Integer quantityMl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BloodUnitStatus status;

    @Column(nullable = false)
    private LocalDateTime collectionDate;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    private String testingResults;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
