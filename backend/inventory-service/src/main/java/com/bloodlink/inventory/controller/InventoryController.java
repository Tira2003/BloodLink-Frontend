package com.bloodlink.inventory.controller;

import com.bloodlink.inventory.dto.BloodInventoryDTO;
import com.bloodlink.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"})
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    @PreAuthorize("hasRole('HOSPITAL') or hasRole('ADMIN')")
    public ResponseEntity<BloodInventoryDTO> createInventory(
            @RequestParam UUID hospitalId,
            @RequestParam String bloodType,
            @RequestParam Integer initialQuantity,
            @RequestParam Integer minimumThreshold) {
        log.info("Creating inventory for hospital: {}", hospitalId);
        BloodInventoryDTO inventory = inventoryService.createInventory(hospitalId, bloodType, initialQuantity, minimumThreshold);
        return ResponseEntity.status(HttpStatus.CREATED).body(inventory);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BloodInventoryDTO> getInventory(@PathVariable UUID id) {
        log.info("Fetching inventory: {}", id);
        BloodInventoryDTO inventory = inventoryService.getInventoryById(id);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/hospital/{hospitalId}")
    @PreAuthorize("hasRole('HOSPITAL') or hasRole('ADMIN')")
    public ResponseEntity<List<BloodInventoryDTO>> getInventoryByHospital(@PathVariable UUID hospitalId) {
        log.info("Fetching inventory for hospital: {}", hospitalId);
        List<BloodInventoryDTO> inventory = inventoryService.getInventoryByHospital(hospitalId);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/hospital/{hospitalId}/blood-type/{bloodType}")
    public ResponseEntity<BloodInventoryDTO> getInventoryByBloodType(
            @PathVariable UUID hospitalId,
            @PathVariable String bloodType) {
        log.info("Fetching inventory for hospital: {} blood type: {}", hospitalId, bloodType);
        BloodInventoryDTO inventory = inventoryService.getInventoryByHospitalAndBloodType(hospitalId, bloodType);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/hospital/{hospitalId}/low-stock")
    @PreAuthorize("hasRole('HOSPITAL') or hasRole('ADMIN')")
    public ResponseEntity<List<BloodInventoryDTO>> getLowStockInventory(@PathVariable UUID hospitalId) {
        log.info("Fetching low stock inventory for hospital: {}", hospitalId);
        List<BloodInventoryDTO> inventory = inventoryService.getLowStockInventory(hospitalId);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/expired")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BloodInventoryDTO>> getExpiredInventory() {
        log.info("Fetching expired inventory");
        List<BloodInventoryDTO> inventory = inventoryService.getExpiredInventory();
        return ResponseEntity.ok(inventory);
    }

    @PutMapping("/{id}/update-quantity")
    @PreAuthorize("hasRole('HOSPITAL') or hasRole('ADMIN')")
    public ResponseEntity<BloodInventoryDTO> updateQuantity(
            @PathVariable UUID id,
            @RequestParam Integer quantityChange) {
        log.info("Updating inventory {} quantity by: {}", id, quantityChange);
        BloodInventoryDTO inventory = inventoryService.updateQuantity(id, quantityChange);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/hospital/{hospitalId}/total/blood-type/{bloodType}")
    public ResponseEntity<Integer> getTotalQuantity(
            @PathVariable UUID hospitalId,
            @PathVariable String bloodType) {
        log.info("Getting total quantity for hospital: {} blood type: {}", hospitalId, bloodType);
        Integer total = inventoryService.getTotalQuantityByHospitalAndBloodType(hospitalId, bloodType);
        return ResponseEntity.ok(total);
    }
}
