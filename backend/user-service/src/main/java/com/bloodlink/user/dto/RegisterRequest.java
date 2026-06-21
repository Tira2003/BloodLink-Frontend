package com.bloodlink.user.dto;

import com.bloodlink.user.entity.BloodType;
import com.bloodlink.user.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password should be at least 8 characters")
    private String password;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String city;
    private String country;
    private String postalCode;
    private BloodType bloodType;
    
    @NotBlank(message = "Role is required")
    private String role;

    // Additional fields for donors
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String medicalConditions;
    private String medications;
    private String allergies;

    // Additional fields for hospitals
    private String hospitalName;
    private String licenseNumber;
}
