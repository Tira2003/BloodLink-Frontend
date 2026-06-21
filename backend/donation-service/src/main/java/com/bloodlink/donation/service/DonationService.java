package com.bloodlink.donation.service;

import com.bloodlink.donation.dto.CreateDonationRequest;
import com.bloodlink.donation.dto.DonationDTO;
import com.bloodlink.donation.entity.Donation;
import com.bloodlink.donation.entity.DonationStatus;
import com.bloodlink.donation.repository.DonationRepository;
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
public class DonationService {

    private final DonationRepository donationRepository;

    @Transactional
    public DonationDTO createDonation(CreateDonationRequest request) {
        log.info("Creating donation for donor: {} at hospital: {}", request.getDonorId(), request.getHospitalId());
        
        Donation donation = Donation.builder()
                .donorId(request.getDonorId())
                .hospitalId(request.getHospitalId())
                .bloodType(request.getBloodType())
                .quantityMl(request.getQuantityMl())
                .status(DonationStatus.PENDING)
                .donationDate(request.getDonationDate())
                .notes(request.getNotes())
                .collectionCenter(request.getCollectionCenter())
                .build();
        
        Donation saved = donationRepository.save(donation);
        return mapToDTO(saved);
    }

    public DonationDTO getDonationById(UUID id) {
        log.info("Fetching donation: {}", id);
        return donationRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Donation not found"));
    }

    public List<DonationDTO> getDonationsByDonor(UUID donorId) {
        log.info("Fetching donations for donor: {}", donorId);
        return donationRepository.findByDonorId(donorId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DonationDTO> getDonationsByHospital(UUID hospitalId) {
        log.info("Fetching donations for hospital: {}", hospitalId);
        return donationRepository.findByHospitalId(hospitalId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DonationDTO> getDonationsByStatus(DonationStatus status) {
        log.info("Fetching donations with status: {}", status);
        return donationRepository.findByStatus(status)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public DonationDTO updateDonationStatus(UUID id, DonationStatus status) {
        log.info("Updating donation {} status to: {}", id, status);
        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found"));
        
        donation.setStatus(status);
        Donation updated = donationRepository.save(donation);
        return mapToDTO(updated);
    }

    public List<DonationDTO> getDonationsByDateRange(UUID donorId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Fetching donations for donor {} between {} and {}", donorId, startDate, endDate);
        return donationRepository.findDonationsByDonorAndDateRange(donorId, startDate, endDate)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public long getDonationCount(UUID donorId) {
        log.info("Getting donation count for donor: {}", donorId);
        return donationRepository.countCompletedDonationsByDonor(donorId);
    }

    private DonationDTO mapToDTO(Donation donation) {
        return DonationDTO.builder()
                .id(donation.getId())
                .donorId(donation.getDonorId())
                .hospitalId(donation.getHospitalId())
                .bloodType(donation.getBloodType())
                .quantityMl(donation.getQuantityMl())
                .status(donation.getStatus().toString())
                .donationDate(donation.getDonationDate())
                .notes(donation.getNotes())
                .collectionCenter(donation.getCollectionCenter())
                .createdAt(donation.getCreatedAt())
                .updatedAt(donation.getUpdatedAt())
                .build();
    }
}
