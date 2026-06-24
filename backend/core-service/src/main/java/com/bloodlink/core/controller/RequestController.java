package com.bloodlink.core.controller;

import com.bloodlink.core.dto.BloodRequestDTO;
import com.bloodlink.core.service.RequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/core/requests")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RequestController {
    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    public ResponseEntity<BloodRequestDTO> createRequest(@RequestBody BloodRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(requestService.createRequest(requestDTO));
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<BloodRequestDTO> getRequestById(@PathVariable UUID requestId) {
        return ResponseEntity.ok(requestService.getRequestById(requestId));
    }

    @GetMapping
    public ResponseEntity<List<BloodRequestDTO>> getAllActiveRequests() {
        return ResponseEntity.ok(requestService.getAllActiveRequests());
    }

    @GetMapping("/blood-type/{bloodType}")
    public ResponseEntity<List<BloodRequestDTO>> getRequestsByBloodType(@PathVariable String bloodType) {
        return ResponseEntity.ok(requestService.getRequestsByBloodType(bloodType));
    }

    @GetMapping("/district/{district}")
    public ResponseEntity<List<BloodRequestDTO>> getRequestsByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(requestService.getRequestsByDistrict(district));
    }

    @PutMapping("/{requestId}")
    public ResponseEntity<BloodRequestDTO> updateRequest(@PathVariable UUID requestId,
                                                         @RequestBody BloodRequestDTO requestDTO) {
        return ResponseEntity.ok(requestService.updateRequest(requestId, requestDTO));
    }

    @PostMapping("/{requestId}/fulfill")
    public ResponseEntity<BloodRequestDTO> fulfillRequest(@PathVariable UUID requestId) {
        return ResponseEntity.ok(requestService.fulfillRequest(requestId));
    }

    @PostMapping("/{requestId}/respond")
    public ResponseEntity<String> respondToRequest(@PathVariable UUID requestId,
                                                    @RequestParam UUID donorId,
                                                    @RequestParam String response) {
        requestService.donorRespondsToRequest(requestId, donorId, response);
        return ResponseEntity.ok("Response recorded successfully");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BloodRequestDTO>> getUserRequests(@PathVariable UUID userId) {
        return ResponseEntity.ok(requestService.getUserRequests(userId));
    }
}
