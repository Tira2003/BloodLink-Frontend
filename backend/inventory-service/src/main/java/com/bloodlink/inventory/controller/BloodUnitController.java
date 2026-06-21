package com.bloodlink.inventory.controller;

import com.bloodlink.inventory.dto.BloodUnitDTO;
import com.bloodlink.inventory.entity.BloodUnitStatus;
import com.bloodlink.inventory.service.BloodUnitService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/blood-units")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"})
public class BloodUnitController {

    private final BloodUnitService bloodUnitService;

    @PostMapping
    @PreAuthorize("hasRole('HOSPITAL') or hasRole('ADMIN')")
    public ResponseEntity<BloodUnitDTO> createBloodUnit(
            @RequestParam UUID donationId,
            @RequestParam UUID hospitalId,
            @RequestParam String bloodType,
            @RequestParam Integer quantityMl) {
        log.info("Creating blood unit for donation: {}", donationId);
        BloodUnitDTO unit = bloodUnitService.createBloodUnit(donationId, hospitalId, bloodType, quantityMl);
        return ResponseEntity.status(HttpStatus.CREATED).body(unit);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BloodUnitDTO> getBloodUnit(@PathVariable UUID id) {
        log.info("Fetching blood unit: {}", id);
        BloodUnitDTO unit = bloodUnitService.getBloodUnitById(id);
        return ResponseEntity.ok(unit);
    }

    @GetMapping("/donation/{donationId}")
    public ResponseEntity<List<BloodUnitDTO>> getBloodUnitsByDonation(@PathVariable UUID donationId) {
        log.info("Fetching blood units for donation: {}", donationId);
        List<BloodUnitDTO> units = bloodUnitService.getBloodUnitsByDonation(donationId);
        return ResponseEntity.ok(units);
    }

    @GetMapping("/hospital/{hospitalId}")
    @PreAuthorize("hasRole('HOSPITAL') or hasRole('ADMIN')")
    public ResponseEntity<List<BloodUnitDTO>> getBloodUnitsByHospital(@PathVariable UUID hospitalId) {
        log.info("Fetching blood units for hospital: {}", hospitalId);
        List<BloodUnitDTO> units = bloodUnitService.getBloodUnitsByHospital(hospitalId);
        return ResponseEntity.ok(units);
    }

    @GetMapping("/hospital/{hospitalId}/available")
    public ResponseEntity<List<BloodUnitDTO>> getAvailableUnits(@PathVariable UUID hospitalId) {
        log.info("Fetching available units for hospital: {}", hospitalId);
        List<BloodUnitDTO> units = bloodUnitService.getAvailableUnits(hospitalId);
        return ResponseEntity.ok(units);
    }

    @GetMapping("/hospital/{hospitalId}/available/blood-type/{bloodType}")
    public ResponseEntity<List<BloodUnitDTO>> getAvailableUnitsByBloodType(
            @PathVariable UUID hospitalId,
            @PathVariable String bloodType) {
        log.info("Fetching available units for hospital: {} blood type: {}", hospitalId, bloodType);
        List<BloodUnitDTO> units = bloodUnitService.getAvailableUnitsByBloodType(hospitalId, bloodType);
        return ResponseEntity.ok(units);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('HOSPITAL') or hasRole('ADMIN')")
    public ResponseEntity<BloodUnitDTO> updateUnitStatus(
            @PathVariable UUID id,
            @RequestParam BloodUnitStatus status) {
        log.info("Updating blood unit {} status to: {}", id, status);
        BloodUnitDTO unit = bloodUnitService.updateUnitStatus(id, status);
        return ResponseEntity.ok(unit);
    }

    @PutMapping("/{id}/testing-results")
    @PreAuthorize("hasRole('HOSPITAL') or hasRole('ADMIN')")
    public ResponseEntity<BloodUnitDTO> updateTestingResults(
            @PathVariable UUID id,
            @RequestBody String results) {
        log.info("Updating testing results for blood unit: {}", id);
        BloodUnitDTO unit = bloodUnitService.updateTestingResults(id, results);
        return ResponseEntity.ok(unit);
    }

    @GetMapping("/expiring")
    @PreAuthorize("hasRole('HOSPITAL') or hasRole('ADMIN')")
    public ResponseEntity<List<BloodUnitDTO>> getExpiringUnits() {
        log.info("Fetching expiring units");
        List<BloodUnitDTO> units = bloodUnitService.getExpiringUnits();
        return ResponseEntity.ok(units);
    }

    @GetMapping("/hospital/{hospitalId}/count/blood-type/{bloodType}")
    public ResponseEntity<Long> countAvailableUnits(
            @PathVariable UUID hospitalId,
            @PathVariable String bloodType) {
        log.info("Counting available units for hospital: {} blood type: {}", hospitalId, bloodType);
        long count = bloodUnitService.countAvailableUnits(hospitalId, bloodType);
        return ResponseEntity.ok(count);
    }
}
