package com.bloodlink.user.controller;

import com.bloodlink.user.dto.DonorDTO;
import com.bloodlink.user.service.DonorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/donors")
@RequiredArgsConstructor
@Slf4j
public class DonorController {

    private final DonorService donorService;

    @PostMapping("/{userId}")
    public ResponseEntity<DonorDTO> createDonor(@PathVariable UUID userId, @Valid @RequestBody DonorDTO donorDTO) {
        log.info("Creating donor record for user: {}", userId);
        DonorDTO createdDonor = donorService.createDonor(userId, donorDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDonor);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<DonorDTO> getDonorByUserId(@PathVariable UUID userId) {
        log.info("Fetching donor for user: {}", userId);
        DonorDTO donorDTO = donorService.getDonorByUserId(userId);
        return ResponseEntity.ok(donorDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonorDTO> getDonorById(@PathVariable UUID id) {
        log.info("Fetching donor with ID: {}", id);
        DonorDTO donorDTO = donorService.getDonorById(id);
        return ResponseEntity.ok(donorDTO);
    }

    @GetMapping("/eligible")
    public ResponseEntity<List<DonorDTO>> getEligibleDonors() {
        log.info("Fetching all eligible donors");
        List<DonorDTO> donors = donorService.getEligibleDonors();
        return ResponseEntity.ok(donors);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DonorDTO> updateDonor(@PathVariable UUID id, @Valid @RequestBody DonorDTO donorDTO) {
        log.info("Updating donor with ID: {}", id);
        DonorDTO updatedDonor = donorService.updateDonor(id, donorDTO);
        return ResponseEntity.ok(updatedDonor);
    }

    @PostMapping("/{id}/record-donation")
    public ResponseEntity<DonorDTO> recordDonation(@PathVariable UUID id) {
        log.info("Recording donation for donor: {}", id);
        DonorDTO updatedDonor = donorService.recordDonation(id);
        return ResponseEntity.ok(updatedDonor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonor(@PathVariable UUID id) {
        log.info("Deleting donor with ID: {}", id);
        donorService.deleteDonor(id);
        return ResponseEntity.noContent().build();
    }
}
