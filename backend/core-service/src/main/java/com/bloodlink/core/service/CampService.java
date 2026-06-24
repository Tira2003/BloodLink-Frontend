package com.bloodlink.core.service;

import com.bloodlink.core.dto.DonationCampDTO;
import com.bloodlink.core.model.DonationCamp;
import com.bloodlink.core.repository.DonationCampRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CampService {
    private final DonationCampRepository campRepository;

    public CampService(DonationCampRepository campRepository) {
        this.campRepository = campRepository;
    }

    public DonationCampDTO createCamp(DonationCampDTO campDTO) {
        DonationCamp camp = DonationCamp.builder()
                .name(campDTO.getName())
                .organizerId(campDTO.getOrganizerId())
                .locationName(campDTO.getLocationName())
                .district(campDTO.getDistrict())
                .latitude(campDTO.getLatitude())
                .longitude(campDTO.getLongitude())
                .startDate(campDTO.getStartDate())
                .endDate(campDTO.getEndDate())
                .targetUnits(campDTO.getTargetUnits())
                .collectedUnits(0)
                .description(campDTO.getDescription())
                .isActive(true)
                .build();

        camp = campRepository.save(camp);
        return mapToDTO(camp);
    }

    public DonationCampDTO getCampById(UUID campId) {
        DonationCamp camp = campRepository.findById(campId)
                .orElseThrow(() -> new RuntimeException("Camp not found with ID: " + campId));
        return mapToDTO(camp);
    }

    public List<DonationCampDTO> getAllActiveCamps() {
        return campRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DonationCampDTO> getCampsByDistrict(String district) {
        return campRepository.findByDistrict(district)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DonationCampDTO> getCampsByOrganizer(UUID organizerId) {
        return campRepository.findByOrganizerId(organizerId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DonationCampDTO updateCamp(UUID campId, DonationCampDTO campDTO) {
        DonationCamp camp = campRepository.findById(campId)
                .orElseThrow(() -> new RuntimeException("Camp not found with ID: " + campId));

        if (campDTO.getName() != null) {
            camp.setName(campDTO.getName());
        }
        if (campDTO.getLocationName() != null) {
            camp.setLocationName(campDTO.getLocationName());
        }
        if (campDTO.getDistrict() != null) {
            camp.setDistrict(campDTO.getDistrict());
        }
        if (campDTO.getStartDate() != null) {
            camp.setStartDate(campDTO.getStartDate());
        }
        if (campDTO.getEndDate() != null) {
            camp.setEndDate(campDTO.getEndDate());
        }
        if (campDTO.getTargetUnits() != null) {
            camp.setTargetUnits(campDTO.getTargetUnits());
        }
        if (campDTO.getDescription() != null) {
            camp.setDescription(campDTO.getDescription());
        }

        camp = campRepository.save(camp);
        return mapToDTO(camp);
    }

    public DonationCampDTO deactivateCamp(UUID campId) {
        DonationCamp camp = campRepository.findById(campId)
                .orElseThrow(() -> new RuntimeException("Camp not found with ID: " + campId));
        camp.setIsActive(false);
        camp = campRepository.save(camp);
        return mapToDTO(camp);
    }

    public void updateCollectedUnits(UUID campId, Integer units) {
        DonationCamp camp = campRepository.findById(campId)
                .orElseThrow(() -> new RuntimeException("Camp not found with ID: " + campId));
        Integer currentUnits = camp.getCollectedUnits() != null ? camp.getCollectedUnits() : 0;
        camp.setCollectedUnits(currentUnits + units);
        campRepository.save(camp);
    }

    private DonationCampDTO mapToDTO(DonationCamp camp) {
        return DonationCampDTO.builder()
                .id(camp.getId())
                .name(camp.getName())
                .organizerId(camp.getOrganizerId())
                .locationName(camp.getLocationName())
                .district(camp.getDistrict())
                .latitude(camp.getLatitude())
                .longitude(camp.getLongitude())
                .startDate(camp.getStartDate())
                .endDate(camp.getEndDate())
                .targetUnits(camp.getTargetUnits())
                .collectedUnits(camp.getCollectedUnits())
                .description(camp.getDescription())
                .isActive(camp.isActive())
                .build();
    }
}
