package com.bloodlink.donation.controller;

import com.bloodlink.donation.dto.BookAppointmentRequest;
import com.bloodlink.donation.dto.DonationAppointmentDTO;
import com.bloodlink.donation.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/donations/appointments")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"})
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<DonationAppointmentDTO> bookAppointment(@Valid @RequestBody BookAppointmentRequest request) {
        log.info("Received request to book appointment");
        DonationAppointmentDTO appointment = appointmentService.bookAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationAppointmentDTO> getAppointment(@PathVariable UUID id) {
        log.info("Fetching appointment: {}", id);
        DonationAppointmentDTO appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(appointment);
    }

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<DonationAppointmentDTO>> getAppointmentsByDonor(@PathVariable UUID donorId) {
        log.info("Fetching appointments for donor: {}", donorId);
        List<DonationAppointmentDTO> appointments = appointmentService.getAppointmentsByDonor(donorId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/hospital/{hospitalId}")
    @PreAuthorize("hasRole('HOSPITAL') or hasRole('ADMIN')")
    public ResponseEntity<List<DonationAppointmentDTO>> getAppointmentsByHospital(@PathVariable UUID hospitalId) {
        log.info("Fetching appointments for hospital: {}", hospitalId);
        List<DonationAppointmentDTO> appointments = appointmentService.getAppointmentsByHospital(hospitalId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/hospital/{hospitalId}/upcoming")
    @PreAuthorize("hasRole('HOSPITAL') or hasRole('ADMIN')")
    public ResponseEntity<List<DonationAppointmentDTO>> getUpcomingAppointments(@PathVariable UUID hospitalId) {
        log.info("Fetching upcoming appointments for hospital: {}", hospitalId);
        List<DonationAppointmentDTO> appointments = appointmentService.getUpcomingAppointments(hospitalId);
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/{id}/confirm")
    @PreAuthorize("hasRole('HOSPITAL') or hasRole('ADMIN')")
    public ResponseEntity<DonationAppointmentDTO> confirmAppointment(@PathVariable UUID id) {
        log.info("Confirming appointment: {}", id);
        DonationAppointmentDTO appointment = appointmentService.confirmAppointment(id);
        return ResponseEntity.ok(appointment);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<DonationAppointmentDTO> cancelAppointment(@PathVariable UUID id) {
        log.info("Cancelling appointment: {}", id);
        DonationAppointmentDTO appointment = appointmentService.cancelAppointment(id);
        return ResponseEntity.ok(appointment);
    }
}
