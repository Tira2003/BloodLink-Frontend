package com.bloodlink.core.controller;

import com.bloodlink.core.service.RewardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/core/rewards")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RewardController {
    private final RewardService rewardService;

    public RewardController(RewardService rewardService) {
        this.rewardService = rewardService;
    }

    @GetMapping("/donors/{donorId}")
    public ResponseEntity<Integer> getDonorRewardPoints(@PathVariable UUID donorId) {
        return ResponseEntity.ok(rewardService.getDonorRewardPoints(donorId));
    }
}
