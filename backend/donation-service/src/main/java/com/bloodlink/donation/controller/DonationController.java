package com.bloodlink.donation.controller;

import com.bloodlink.donation.dto.CreateDonationRequest;
import com.bloodlink.donation.dto.DonationDTO;
import com.bloodlink.donation.entity.DonationStatus;
import com.bloodlink.donation.service.DonationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"})
public class DonationController {

    private final DonationService donationService;

    @PostMapping
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<DonationDTO> createDonation(@Valid @RequestBody CreateDonationRequest request) {
        log.info("Received request to create donation");
        DonationDTO donation = donationService.createDonation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(donation);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationDTO> getDonation(@PathVariable UUID id) {
        log.info("Fetching donation: {}", id);
        DonationDTO donation = donationService.getDonationById(id);
        return ResponseEntity.ok(donation);
    }

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<DonationDTO>> getDonationsByDonor(@PathVariable UUID donorId) {
        log.info("Fetching donations for donor: {}", donorId);
        List<DonationDTO> donations = donationService.getDonationsByDonor(donorId);
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<DonationDTO>> getDonationsByHospital(@PathVariable UUID hospitalId) {
        log.info("Fetching donations for hospital: {}", hospitalId);
        List<DonationDTO> donations = donationService.getDonationsByHospital(hospitalId);
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HOSPITAL')")
    public ResponseEntity<List<DonationDTO>> getDonationsByStatus(@PathVariable DonationStatus status) {
        log.info("Fetching donations with status: {}", status);
        List<DonationDTO> donations = donationService.getDonationsByStatus(status);
        return ResponseEntity.ok(donations);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('HOSPITAL') or hasRole('ADMIN')")
    public ResponseEntity<DonationDTO> updateDonationStatus(
            @PathVariable UUID id,
            @RequestParam DonationStatus status) {
        log.info("Updating donation {} status to: {}", id, status);
        DonationDTO donation = donationService.updateDonationStatus(id, status);
        return ResponseEntity.ok(donation);
    }

    @GetMapping("/history/{donorId}")
    public ResponseEntity<List<DonationDTO>> getDonationHistory(
            @PathVariable UUID donorId,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate) {
        log.info("Fetching donation history for donor: {}", donorId);
        
        if (startDate != null && endDate != null) {
            List<DonationDTO> donations = donationService.getDonationsByDateRange(donorId, startDate, endDate);
            return ResponseEntity.ok(donations);
        }
        
        List<DonationDTO> donations = donationService.getDonationsByDonor(donorId);
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/stats/donor/{donorId}")
    public ResponseEntity<Long> getDonationCount(@PathVariable UUID donorId) {
        log.info("Getting donation count for donor: {}", donorId);
        long count = donationService.getDonationCount(donorId);
        return ResponseEntity.ok(count);
    }
}
