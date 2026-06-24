package com.bloodlink.core.controller;

import com.bloodlink.core.dto.DonationCampDTO;
import com.bloodlink.core.service.CampService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/core/camps")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CampController {
    private final CampService campService;

    public CampController(CampService campService) {
        this.campService = campService;
    }

    @PostMapping
    public ResponseEntity<DonationCampDTO> createCamp(@RequestBody DonationCampDTO campDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(campService.createCamp(campDTO));
    }

    @GetMapping("/{campId}")
    public ResponseEntity<DonationCampDTO> getCampById(@PathVariable UUID campId) {
        return ResponseEntity.ok(campService.getCampById(campId));
    }

    @GetMapping
    public ResponseEntity<List<DonationCampDTO>> getAllActiveCamps() {
        return ResponseEntity.ok(campService.getAllActiveCamps());
    }

    @GetMapping("/district/{district}")
    public ResponseEntity<List<DonationCampDTO>> getCampsByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(campService.getCampsByDistrict(district));
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<DonationCampDTO>> getCampsByOrganizer(@PathVariable UUID organizerId) {
        return ResponseEntity.ok(campService.getCampsByOrganizer(organizerId));
    }

    @PutMapping("/{campId}")
    public ResponseEntity<DonationCampDTO> updateCamp(@PathVariable UUID campId,
                                                      @RequestBody DonationCampDTO campDTO) {
        return ResponseEntity.ok(campService.updateCamp(campId, campDTO));
    }

    @PostMapping("/{campId}/deactivate")
    public ResponseEntity<DonationCampDTO> deactivateCamp(@PathVariable UUID campId) {
        return ResponseEntity.ok(campService.deactivateCamp(campId));
    }

    @PostMapping("/{campId}/update-units")
    public ResponseEntity<String> updateCollectedUnits(@PathVariable UUID campId,
                                                       @RequestParam Integer units) {
        campService.updateCollectedUnits(campId, units);
        return ResponseEntity.ok("Units updated successfully");
    }
}
