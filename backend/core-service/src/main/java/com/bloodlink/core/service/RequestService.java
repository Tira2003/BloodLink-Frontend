package com.bloodlink.core.service;

import com.bloodlink.core.dto.BloodRequestDTO;
import com.bloodlink.core.model.BloodRequest;
import com.bloodlink.core.model.RequestResponse;
import com.bloodlink.core.repository.BloodRequestRepository;
import com.bloodlink.core.repository.RequestResponseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class RequestService {
    private final BloodRequestRepository bloodRequestRepository;
    private final RequestResponseRepository requestResponseRepository;
    private final MatchingService matchingService;
    private final RewardService rewardService;

    public RequestService(BloodRequestRepository bloodRequestRepository, RequestResponseRepository requestResponseRepository,
                         MatchingService matchingService, RewardService rewardService) {
        this.bloodRequestRepository = bloodRequestRepository;
        this.requestResponseRepository = requestResponseRepository;
        this.matchingService = matchingService;
        this.rewardService = rewardService;
    }

    public BloodRequestDTO createRequest(BloodRequestDTO requestDTO) {
        BloodRequest bloodRequest = BloodRequest.builder()
                .userId(requestDTO.getUserId())
                .bloodType(BloodRequest.BloodType.valueOf(requestDTO.getBloodType()))
                .quantityNeeded(requestDTO.getQuantityNeeded())
                .status(BloodRequest.RequestStatus.ACTIVE)
                .urgency(requestDTO.getUrgency())
                .hospitalName(requestDTO.getHospitalName())
                .district(requestDTO.getDistrict())
                .locationDetails(requestDTO.getLocationDetails())
                .reason(requestDTO.getReason())
                .build();

        bloodRequest = bloodRequestRepository.save(bloodRequest);

        // Trigger matching algorithm
        matchingService.matchDonorsToRequest(bloodRequest);

        return mapToDTO(bloodRequest);
    }

    public BloodRequestDTO getRequestById(UUID requestId) {
        BloodRequest bloodRequest = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Blood request not found with ID: " + requestId));
        return mapToDTO(bloodRequest);
    }

    public List<BloodRequestDTO> getAllActiveRequests() {
        return bloodRequestRepository.findActiveRequests()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<BloodRequestDTO> getRequestsByBloodType(String bloodType) {
        return bloodRequestRepository.findActiveRequestsByBloodType(bloodType)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<BloodRequestDTO> getRequestsByDistrict(String district) {
        return bloodRequestRepository.findActiveRequestsByDistrict(district)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public BloodRequestDTO updateRequest(UUID requestId, BloodRequestDTO requestDTO) {
        BloodRequest bloodRequest = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Blood request not found with ID: " + requestId));

        if (requestDTO.getQuantityNeeded() != null) {
            bloodRequest.setQuantityNeeded(requestDTO.getQuantityNeeded());
        }
        if (requestDTO.getUrgency() != null) {
            bloodRequest.setUrgency(requestDTO.getUrgency());
        }

        bloodRequest = bloodRequestRepository.save(bloodRequest);
        return mapToDTO(bloodRequest);
    }

    public BloodRequestDTO fulfillRequest(UUID requestId) {
        BloodRequest bloodRequest = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Blood request not found with ID: " + requestId));

        bloodRequest.setStatus(BloodRequest.RequestStatus.FULFILLED);
        bloodRequest.setFulfilledDate(LocalDateTime.now());

        bloodRequest = bloodRequestRepository.save(bloodRequest);

        // Mark all responses as completed and award points
        List<RequestResponse> responses = requestResponseRepository.findByRequestId(requestId);
        responses.forEach(response -> {
            if (response.getResponseStatus() == RequestResponse.ResponseStatus.ACCEPTED) {
                response.setResponseStatus(RequestResponse.ResponseStatus.COMPLETED);
                response.setCompletedAt(LocalDateTime.now());
                requestResponseRepository.save(response);

                // Award points to donor
                rewardService.awardRewardPoints(response.getDonorId(), 100, "Successful blood donation");
            }
        });

        return mapToDTO(bloodRequest);
    }

    public void donorRespondsToRequest(UUID requestId, UUID donorId, String response) {
        RequestResponse requestResponse = requestResponseRepository.findByRequestIdAndDonorId(requestId, donorId)
                .orElseThrow(() -> new RuntimeException("Response record not found"));

        if ("ACCEPT".equals(response)) {
            requestResponse.setResponseStatus(RequestResponse.ResponseStatus.ACCEPTED);
            // Award points for accepting the request
            rewardService.awardRewardPoints(donorId, 50, "Accepted blood donation request");
        } else if ("REJECT".equals(response)) {
            requestResponse.setResponseStatus(RequestResponse.ResponseStatus.REJECTED);
        }

        requestResponseRepository.save(requestResponse);
    }

    public List<BloodRequestDTO> getUserRequests(UUID userId) {
        return bloodRequestRepository.findByUserId(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private BloodRequestDTO mapToDTO(BloodRequest bloodRequest) {
        return BloodRequestDTO.builder()
                .id(bloodRequest.getId())
                .userId(bloodRequest.getUserId())
                .bloodType(bloodRequest.getBloodType().toString())
                .quantityNeeded(bloodRequest.getQuantityNeeded())
                .status(bloodRequest.getStatus().toString())
                .urgency(bloodRequest.getUrgency())
                .hospitalName(bloodRequest.getHospitalName())
                .district(bloodRequest.getDistrict())
                .locationDetails(bloodRequest.getLocationDetails())
                .reason(bloodRequest.getReason())
                .createdAt(bloodRequest.getCreatedAt())
                .fulfilledDate(bloodRequest.getFulfilledDate())
                .build();
    }
}
