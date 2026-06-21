package com.bloodlink.inventory.service;

import com.bloodlink.inventory.dto.BloodUnitDTO;
import com.bloodlink.inventory.entity.BloodUnit;
import com.bloodlink.inventory.entity.BloodUnitStatus;
import com.bloodlink.inventory.repository.BloodUnitRepository;
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
public class BloodUnitService {

    private final BloodUnitRepository bloodUnitRepository;

    @Transactional
    public BloodUnitDTO createBloodUnit(UUID donationId, UUID hospitalId, String bloodType, Integer quantityMl) {
        log.info("Creating blood unit for donation: {} at hospital: {}", donationId, hospitalId);
        
        BloodUnit unit = BloodUnit.builder()
                .donationId(donationId)
                .hospitalId(hospitalId)
                .bloodType(bloodType)
                .quantityMl(quantityMl)
                .status(BloodUnitStatus.PENDING_TEST)
                .collectionDate(LocalDateTime.now())
                .expiryDate(LocalDateTime.now().plusMonths(1))
                .build();
        
        BloodUnit saved = bloodUnitRepository.save(unit);
        return mapToDTO(saved);
    }

    public BloodUnitDTO getBloodUnitById(UUID id) {
        log.info("Fetching blood unit: {}", id);
        return bloodUnitRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Blood unit not found"));
    }

    public List<BloodUnitDTO> getBloodUnitsByDonation(UUID donationId) {
        log.info("Fetching blood units for donation: {}", donationId);
        return bloodUnitRepository.findByDonationId(donationId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<BloodUnitDTO> getBloodUnitsByHospital(UUID hospitalId) {
        log.info("Fetching blood units for hospital: {}", hospitalId);
        return bloodUnitRepository.findByHospitalId(hospitalId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<BloodUnitDTO> getAvailableUnits(UUID hospitalId) {
        log.info("Fetching available units for hospital: {}", hospitalId);
        return bloodUnitRepository.findAvailableUnits(hospitalId, LocalDateTime.now())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<BloodUnitDTO> getAvailableUnitsByBloodType(UUID hospitalId, String bloodType) {
        log.info("Fetching available units for hospital: {} blood type: {}", hospitalId, bloodType);
        return bloodUnitRepository.findByHospitalIdAndBloodTypeAndStatus(hospitalId, bloodType, BloodUnitStatus.AVAILABLE)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BloodUnitDTO updateUnitStatus(UUID id, BloodUnitStatus status) {
        log.info("Updating blood unit {} status to: {}", id, status);
        BloodUnit unit = bloodUnitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood unit not found"));
        
        unit.setStatus(status);
        BloodUnit updated = bloodUnitRepository.save(unit);
        return mapToDTO(updated);
    }

    @Transactional
    public BloodUnitDTO updateTestingResults(UUID id, String results) {
        log.info("Updating testing results for blood unit: {}", id);
        BloodUnit unit = bloodUnitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood unit not found"));
        
        unit.setTestingResults(results);
        unit.setStatus(BloodUnitStatus.APPROVED);
        BloodUnit updated = bloodUnitRepository.save(unit);
        return mapToDTO(updated);
    }

    public List<BloodUnitDTO> getExpiringUnits() {
        log.info("Fetching expiring units");
        return bloodUnitRepository.findExpiringUnits(LocalDateTime.now().plusDays(7))
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public long countAvailableUnits(UUID hospitalId, String bloodType) {
        log.info("Counting available units for hospital: {} blood type: {}", hospitalId, bloodType);
        return bloodUnitRepository.countAvailableByHospitalAndBloodType(hospitalId, bloodType);
    }

    private BloodUnitDTO mapToDTO(BloodUnit unit) {
        return BloodUnitDTO.builder()
                .id(unit.getId())
                .donationId(unit.getDonationId())
                .hospitalId(unit.getHospitalId())
                .bloodType(unit.getBloodType())
                .quantityMl(unit.getQuantityMl())
                .status(unit.getStatus().toString())
                .collectionDate(unit.getCollectionDate())
                .expiryDate(unit.getExpiryDate())
                .testingResults(unit.getTestingResults())
                .createdAt(unit.getCreatedAt())
                .updatedAt(unit.getUpdatedAt())
                .build();
    }
}
