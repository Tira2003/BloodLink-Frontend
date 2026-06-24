package com.bloodlink.core.repository;

import com.bloodlink.core.model.RequestResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RequestResponseRepository extends JpaRepository<RequestResponse, UUID> {
    List<RequestResponse> findByRequestId(UUID requestId);
    List<RequestResponse> findByDonorId(UUID donorId);
    Optional<RequestResponse> findByRequestIdAndDonorId(UUID requestId, UUID donorId);
}
