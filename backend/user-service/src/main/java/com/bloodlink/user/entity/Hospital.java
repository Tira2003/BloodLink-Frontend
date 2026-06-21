package com.bloodlink.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "hospitals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", unique = true, nullable = false)
    private UUID userId;

    @Column(name = "hospital_name", nullable = false)
    private String hospitalName;

    @Column(name = "license_number", unique = true)
    private String licenseNumber;

    private String phone;
    private String email;
    private String address;
    private String city;
    private String country;

    @Column(name = "postal_code")
    private String postalCode;

    private BigDecimal latitude;
    private BigDecimal longitude;

    @Column(name = "is_verified")
    private Boolean isVerified;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;
}
