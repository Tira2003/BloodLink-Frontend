package com.bloodlink.donation.service;

import com.bloodlink.donation.dto.BookAppointmentRequest;
import com.bloodlink.donation.dto.DonationAppointmentDTO;
import com.bloodlink.donation.entity.AppointmentStatus;
import com.bloodlink.donation.entity.DonationAppointment;
import com.bloodlink.donation.repository.DonationAppointmentRepository;
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
public class AppointmentService {

    private final DonationAppointmentRepository appointmentRepository;

    @Transactional
    public DonationAppointmentDTO bookAppointment(BookAppointmentRequest request) {
        log.info("Booking appointment for donor: {} at hospital: {}", request.getDonorId(), request.getHospitalId());
        
        DonationAppointment appointment = DonationAppointment.builder()
                .donorId(request.getDonorId())
                .hospitalId(request.getHospitalId())
                .appointmentDate(request.getAppointmentDate())
                .status(AppointmentStatus.PENDING)
                .notes(request.getNotes())
                .collectionCenter(request.getCollectionCenter())
                .build();
        
        DonationAppointment saved = appointmentRepository.save(appointment);
        return mapToDTO(saved);
    }

    public DonationAppointmentDTO getAppointmentById(UUID id) {
        log.info("Fetching appointment: {}", id);
        return appointmentRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    public List<DonationAppointmentDTO> getAppointmentsByDonor(UUID donorId) {
        log.info("Fetching appointments for donor: {}", donorId);
        return appointmentRepository.findByDonorId(donorId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DonationAppointmentDTO> getAppointmentsByHospital(UUID hospitalId) {
        log.info("Fetching appointments for hospital: {}", hospitalId);
        return appointmentRepository.findByHospitalId(hospitalId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DonationAppointmentDTO> getUpcomingAppointments(UUID hospitalId) {
        log.info("Fetching upcoming appointments for hospital: {}", hospitalId);
        return appointmentRepository.findUpcomingAppointmentsByHospital(hospitalId, LocalDateTime.now())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public DonationAppointmentDTO confirmAppointment(UUID id) {
        log.info("Confirming appointment: {}", id);
        DonationAppointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        DonationAppointment updated = appointmentRepository.save(appointment);
        return mapToDTO(updated);
    }

    @Transactional
    public DonationAppointmentDTO cancelAppointment(UUID id) {
        log.info("Cancelling appointment: {}", id);
        DonationAppointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        appointment.setStatus(AppointmentStatus.CANCELLED);
        DonationAppointment updated = appointmentRepository.save(appointment);
        return mapToDTO(updated);
    }

    private DonationAppointmentDTO mapToDTO(DonationAppointment appointment) {
        return DonationAppointmentDTO.builder()
                .id(appointment.getId())
                .donorId(appointment.getDonorId())
                .hospitalId(appointment.getHospitalId())
                .appointmentDate(appointment.getAppointmentDate())
                .status(appointment.getStatus().toString())
                .notes(appointment.getNotes())
                .collectionCenter(appointment.getCollectionCenter())
                .createdAt(appointment.getCreatedAt())
                .updatedAt(appointment.getUpdatedAt())
                .build();
    }
}
