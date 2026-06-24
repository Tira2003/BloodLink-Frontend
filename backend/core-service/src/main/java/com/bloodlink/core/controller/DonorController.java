package com.bloodlink.core.controller;

import com.bloodlink.core.dto.DonorDTO;
import com.bloodlink.core.service.DonorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/core/donors")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DonorController {
    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    @PostMapping
    public ResponseEntity<DonorDTO> createDonor(@RequestBody DonorDTO donorDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(donorService.createDonor(donorDTO));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<DonorDTO> getDonorByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(donorService.getDonorByUserId(userId));
    }

    @GetMapping("/{donorId}")
    public ResponseEntity<DonorDTO> getDonorById(@PathVariable UUID donorId) {
        return ResponseEntity.ok(donorService.getDonorById(donorId));
    }

    @PutMapping("/{donorId}")
    public ResponseEntity<DonorDTO> updateDonor(@PathVariable UUID donorId, @RequestBody DonorDTO donorDTO) {
        return ResponseEntity.ok(donorService.updateDonor(donorId, donorDTO));
    }

    @GetMapping("/blood-type/{bloodType}")
    public ResponseEntity<List<DonorDTO>> getAvailableDonorsByBloodType(@PathVariable String bloodType) {
        return ResponseEntity.ok(donorService.getAvailableDonorsByBloodType(bloodType));
    }

    @PostMapping("/{donorId}/activate")
    public ResponseEntity<DonorDTO> activateDonor(@PathVariable UUID donorId) {
        return ResponseEntity.ok(donorService.activateDonor(donorId));
    }

    @PostMapping("/{donorId}/deactivate")
    public ResponseEntity<DonorDTO> deactivateDonor(@PathVariable UUID donorId) {
        return ResponseEntity.ok(donorService.deactivateDonor(donorId));
    }
}
