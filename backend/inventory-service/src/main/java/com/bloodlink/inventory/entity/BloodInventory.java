package com.bloodlink.inventory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "blood_inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID hospitalId;

    @Column(nullable = false)
    private String bloodType;

    @Column(nullable = false)
    private Integer quantityMl;

    @Column(nullable = false)
    private Integer minimumThreshold;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    private String notes;

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
