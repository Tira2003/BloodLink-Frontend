package com.bloodlink.core.service;

import com.bloodlink.core.dto.DonorDTO;
import com.bloodlink.core.model.Donor;
import com.bloodlink.core.repository.DonorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class DonorService {
    private final DonorRepository donorRepository;

    public DonorService(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    public DonorDTO createDonor(DonorDTO donorDTO) {
        Donor donor = Donor.builder()
                .userId(donorDTO.getUserId())
                .bloodType(Donor.BloodType.valueOf(donorDTO.getBloodType()))
                .gender(donorDTO.getGender() != null ? Donor.Gender.valueOf(donorDTO.getGender()) : null)
                .dateOfBirth(donorDTO.getDateOfBirth())
                .isActive(true)
                .totalDonations(0)
                .rewardPoints(0)
                .latitude(donorDTO.getLatitude())
                .longitude(donorDTO.getLongitude())
                .build();

        donor = donorRepository.save(donor);
        return mapToDTO(donor);
    }

    public DonorDTO getDonorByUserId(UUID userId) {
        Donor donor = donorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Donor not found for user: " + userId));
        return mapToDTO(donor);
    }

    public DonorDTO getDonorById(UUID donorId) {
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found with ID: " + donorId));
        return mapToDTO(donor);
    }

    public DonorDTO updateDonor(UUID donorId, DonorDTO donorDTO) {
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found with ID: " + donorId));

        if (donorDTO.getBloodType() != null) {
            donor.setBloodType(Donor.BloodType.valueOf(donorDTO.getBloodType()));
        }
        if (donorDTO.getGender() != null) {
            donor.setGender(Donor.Gender.valueOf(donorDTO.getGender()));
        }
        if (donorDTO.getDateOfBirth() != null) {
            donor.setDateOfBirth(donorDTO.getDateOfBirth());
        }
        if (donorDTO.getLatitude() != null) {
            donor.setLatitude(donorDTO.getLatitude());
        }
        if (donorDTO.getLongitude() != null) {
            donor.setLongitude(donorDTO.getLongitude());
        }

        donor = donorRepository.save(donor);
        return mapToDTO(donor);
    }

    public List<DonorDTO> getAvailableDonorsByBloodType(String bloodType) {
        Donor.BloodType type = Donor.BloodType.valueOf(bloodType);
        return donorRepository.findAllByBloodType(type)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DonorDTO activateDonor(UUID donorId) {
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found with ID: " + donorId));
        donor.setIsActive(true);
        donor = donorRepository.save(donor);
        return mapToDTO(donor);
    }

    public DonorDTO deactivateDonor(UUID donorId) {
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found with ID: " + donorId));
        donor.setIsActive(false);
        donor = donorRepository.save(donor);
        return mapToDTO(donor);
    }

    private DonorDTO mapToDTO(Donor donor) {
        return DonorDTO.builder()
                .id(donor.getId())
                .userId(donor.getUserId())
                .bloodType(donor.getBloodType().toString())
                .gender(donor.getGender() != null ? donor.getGender().toString() : null)
                .dateOfBirth(donor.getDateOfBirth())
                .isActive(donor.isActive())
                .totalDonations(donor.getTotalDonations())
                .rewardPoints(donor.getRewardPoints())
                .latitude(donor.getLatitude())
                .longitude(donor.getLongitude())
                .build();
    }
}
