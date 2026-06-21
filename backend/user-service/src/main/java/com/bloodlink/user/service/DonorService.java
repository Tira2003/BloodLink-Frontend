package com.bloodlink.user.service;

import com.bloodlink.user.dto.DonorDTO;
import com.bloodlink.user.entity.Donor;
import com.bloodlink.user.repository.DonorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DonorService {

    private final DonorRepository donorRepository;

    public DonorDTO createDonor(UUID userId, DonorDTO donorDTO) {
        log.info("Creating donor record for user: {}", userId);
        
        Donor donor = Donor.builder()
                .userId(userId)
                .isEligibleToDonate(true)
                .totalDonations(0)
                .emergencyContactName(donorDTO.getEmergencyContactName())
                .emergencyContactPhone(donorDTO.getEmergencyContactPhone())
                .medicalConditions(donorDTO.getMedicalConditions())
                .medications(donorDTO.getMedications())
                .allergies(donorDTO.getAllergies())
                .build();

        Donor savedDonor = donorRepository.save(donor);
        log.info("Donor record created successfully with ID: {}", savedDonor.getId());
        return mapToDTO(savedDonor);
    }

    public DonorDTO getDonorByUserId(UUID userId) {
        log.debug("Fetching donor for user: {}", userId);
        Donor donor = donorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Donor not found for user: " + userId));
        return mapToDTO(donor);
    }

    public DonorDTO getDonorById(UUID id) {
        log.debug("Fetching donor with ID: {}", id);
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found"));
        return mapToDTO(donor);
    }

    public List<DonorDTO> getEligibleDonors() {
        log.debug("Fetching all eligible donors");
        return donorRepository.findByIsEligibleToDonateTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DonorDTO updateDonor(UUID id, DonorDTO donorDTO) {
        log.info("Updating donor with ID: {}", id);
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        if (donorDTO.getEmergencyContactName() != null) 
            donor.setEmergencyContactName(donorDTO.getEmergencyContactName());
        if (donorDTO.getEmergencyContactPhone() != null) 
            donor.setEmergencyContactPhone(donorDTO.getEmergencyContactPhone());
        if (donorDTO.getMedicalConditions() != null) 
            donor.setMedicalConditions(donorDTO.getMedicalConditions());
        if (donorDTO.getMedications() != null) 
            donor.setMedications(donorDTO.getMedications());
        if (donorDTO.getAllergies() != null) 
            donor.setAllergies(donorDTO.getAllergies());
        if (donorDTO.getIsEligibleToDonate() != null)
            donor.setIsEligibleToDonate(donorDTO.getIsEligibleToDonate());

        Donor updatedDonor = donorRepository.save(donor);
        log.info("Donor updated successfully");
        return mapToDTO(updatedDonor);
    }

    public DonorDTO recordDonation(UUID donorId) {
        log.info("Recording donation for donor: {}", donorId);
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));
        
        donor.setLastDonationDate(LocalDate.now());
        donor.setTotalDonations(donor.getTotalDonations() != null ? donor.getTotalDonations() + 1 : 1);
        
        Donor updatedDonor = donorRepository.save(donor);
        log.info("Donation recorded successfully");
        return mapToDTO(updatedDonor);
    }

    public void deleteDonor(UUID id) {
        log.info("Deleting donor with ID: {}", id);
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found"));
        donorRepository.delete(donor);
        log.info("Donor deleted successfully");
    }

    private DonorDTO mapToDTO(Donor donor) {
        return DonorDTO.builder()
                .id(donor.getId())
                .userId(donor.getUserId())
                .lastDonationDate(donor.getLastDonationDate())
                .totalDonations(donor.getTotalDonations())
                .isEligibleToDonate(donor.getIsEligibleToDonate())
                .medicalConditions(donor.getMedicalConditions())
                .medications(donor.getMedications())
                .allergies(donor.getAllergies())
                .emergencyContactName(donor.getEmergencyContactName())
                .emergencyContactPhone(donor.getEmergencyContactPhone())
                .createdAt(donor.getCreatedAt())
                .updatedAt(donor.getUpdatedAt())
                .build();
    }
}
