package com.bloodlink.core.service;

import com.bloodlink.core.model.BloodRequest;
import com.bloodlink.core.model.Donor;
import com.bloodlink.core.model.RequestResponse;
import com.bloodlink.core.repository.DonorRepository;
import com.bloodlink.core.repository.RequestResponseRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class MatchingService {
    private final DonorRepository donorRepository;
    private final RequestResponseRepository requestResponseRepository;
    private final ApplicationEventPublisher eventPublisher;

    public MatchingService(DonorRepository donorRepository, RequestResponseRepository requestResponseRepository,
                          ApplicationEventPublisher eventPublisher) {
        this.donorRepository = donorRepository;
        this.requestResponseRepository = requestResponseRepository;
        this.eventPublisher = eventPublisher;
    }

    public void matchDonorsToRequest(BloodRequest bloodRequest) {
        // Get compatible donors based on blood type
        List<Donor> compatibleDonors = getCompatibleDonors(bloodRequest.getBloodType());

        // Filter by location/district proximity
        List<Donor> nearbyDonors = filterByProximity(compatibleDonors, bloodRequest.getDistrict());

        // Limit notifications to top matches
        int matchLimit = 5;
        nearbyDonors.stream()
                .limit(matchLimit)
                .forEach(donor -> {
                    // Create response records for potential donors
                    RequestResponse response = RequestResponse.builder()
                            .requestId(bloodRequest.getId())
                            .donorId(donor.getId())
                            .responseStatus(RequestResponse.ResponseStatus.ACCEPTED)
                            .respondedAt(java.time.LocalDateTime.now())
                            .build();
                    requestResponseRepository.save(response);

                    // Publish event for notification service
                    eventPublisher.publishEvent(
                            new DonationMatchedEvent(donor.getId(), bloodRequest.getId(), donor.getUserId())
                    );
                });
    }

    private List<Donor> getCompatibleDonors(Donor.BloodType bloodType) {
        return switch (bloodType) {
            case O_NEG -> donorRepository.findAllByBloodType(Donor.BloodType.O_NEG);
            case O_POS -> donorRepository.findAllByBloodType(Donor.BloodType.O_POS);
            case A_NEG -> List.of();
            case A_POS -> List.of();
            case B_NEG -> List.of();
            case B_POS -> List.of();
            case AB_NEG -> List.of();
            case AB_POS -> donorRepository.findAllByBloodType(Donor.BloodType.AB_POS);
        };
    }

    private List<Donor> filterByProximity(List<Donor> donors, String district) {
        return donors.stream()
                .filter(donor -> {
                    boolean hasLocation = donor.getLatitude() != null && donor.getLongitude() != null;
                    return hasLocation || district != null;
                })
                .toList();
    }

    public static class DonationMatchedEvent {
        public final UUID donorId;
        public final UUID requestId;
        public final UUID userId;

        public DonationMatchedEvent(UUID donorId, UUID requestId, UUID userId) {
            this.donorId = donorId;
            this.requestId = requestId;
            this.userId = userId;
        }
    }
}
