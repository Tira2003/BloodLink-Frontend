package com.bloodlink.core.service;

import com.bloodlink.core.model.Donor;
import com.bloodlink.core.model.Reward;
import com.bloodlink.core.repository.DonorRepository;
import com.bloodlink.core.repository.RewardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class RewardService {
    private final RewardRepository rewardRepository;
    private final DonorRepository donorRepository;

    public RewardService(RewardRepository rewardRepository, DonorRepository donorRepository) {
        this.rewardRepository = rewardRepository;
        this.donorRepository = donorRepository;
    }

    public void awardRewardPoints(UUID donorId, Integer points, String reason) {
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found with ID: " + donorId));

        Reward reward = Reward.builder()
                .donorId(donorId)
                .pointsEarned(points)
                .reason(reason)
                .build();

        rewardRepository.save(reward);

        // Update donor's total reward points
        Integer currentPoints = donor.getRewardPoints() != null ? donor.getRewardPoints() : 0;
        donor.setRewardPoints(currentPoints + points);
        donorRepository.save(donor);
    }

    public Integer getDonorRewardPoints(UUID donorId) {
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found with ID: " + donorId));
        return donor.getRewardPoints() != null ? donor.getRewardPoints() : 0;
    }
}
