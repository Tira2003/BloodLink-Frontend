package com.bloodlink.inventory.service;

import com.bloodlink.inventory.dto.BloodInventoryDTO;
import com.bloodlink.inventory.entity.BloodInventory;
import com.bloodlink.inventory.repository.BloodInventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final BloodInventoryRepository inventoryRepository;

    @Transactional
    public BloodInventoryDTO createInventory(UUID hospitalId, String bloodType, Integer initialQuantity, Integer minimumThreshold) {
        log.info("Creating inventory for hospital: {} blood type: {}", hospitalId, bloodType);
        
        BloodInventory inventory = BloodInventory.builder()
                .hospitalId(hospitalId)
                .bloodType(bloodType)
                .quantityMl(initialQuantity)
                .minimumThreshold(minimumThreshold)
                .expiryDate(LocalDateTime.now().plusMonths(1))
                .build();
        
        BloodInventory saved = inventoryRepository.save(inventory);
        return mapToDTO(saved);
    }

    public BloodInventoryDTO getInventoryById(UUID id) {
        log.info("Fetching inventory: {}", id);
        return inventoryRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));
    }

    public List<BloodInventoryDTO> getInventoryByHospital(UUID hospitalId) {
        log.info("Fetching inventory for hospital: {}", hospitalId);
        return inventoryRepository.findByHospitalId(hospitalId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public BloodInventoryDTO getInventoryByHospitalAndBloodType(UUID hospitalId, String bloodType) {
        log.info("Fetching inventory for hospital: {} blood type: {}", hospitalId, bloodType);
        return inventoryRepository.findByHospitalIdAndBloodType(hospitalId, bloodType)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));
    }

    public List<BloodInventoryDTO> getLowStockInventory(UUID hospitalId) {
        log.info("Fetching low stock inventory for hospital: {}", hospitalId);
        return inventoryRepository.findLowStockByHospital(hospitalId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<BloodInventoryDTO> getExpiredInventory() {
        log.info("Fetching expired inventory");
        return inventoryRepository.findExpiredInventory(LocalDateTime.now())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BloodInventoryDTO updateQuantity(UUID id, Integer quantityChange) {
        log.info("Updating inventory {} quantity by: {}", id, quantityChange);
        BloodInventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));
        
        int newQuantity = Math.max(0, inventory.getQuantityMl() + quantityChange);
        inventory.setQuantityMl(newQuantity);
        
        BloodInventory updated = inventoryRepository.save(inventory);
        return mapToDTO(updated);
    }

    public Integer getTotalQuantityByHospitalAndBloodType(UUID hospitalId, String bloodType) {
        log.info("Getting total quantity for hospital: {} blood type: {}", hospitalId, bloodType);
        Integer total = inventoryRepository.getTotalQuantityByHospitalAndBloodType(hospitalId, bloodType);
        return total != null ? total : 0;
    }

    private BloodInventoryDTO mapToDTO(BloodInventory inventory) {
        LocalDateTime now = LocalDateTime.now();
        return BloodInventoryDTO.builder()
                .id(inventory.getId())
                .hospitalId(inventory.getHospitalId())
                .bloodType(inventory.getBloodType())
                .quantityMl(inventory.getQuantityMl())
                .minimumThreshold(inventory.getMinimumThreshold())
                .expiryDate(inventory.getExpiryDate())
                .notes(inventory.getNotes())
                .createdAt(inventory.getCreatedAt())
                .updatedAt(inventory.getUpdatedAt())
                .isLowStock(inventory.getQuantityMl() < inventory.getMinimumThreshold())
                .isExpired(inventory.getExpiryDate().isBefore(now))
                .build();
    }
}
