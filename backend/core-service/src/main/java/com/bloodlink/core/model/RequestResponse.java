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
@Table(name = "request_responses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID requestId;
    private UUID donorId;

    @Enumerated(EnumType.STRING)
    private ResponseStatus responseStatus;

    private LocalDateTime respondedAt;
    private LocalDateTime completedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum ResponseStatus {
        ACCEPTED, REJECTED, COMPLETED
    }
}
