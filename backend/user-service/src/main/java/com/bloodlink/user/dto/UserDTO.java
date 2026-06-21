package com.bloodlink.user.dto;

import com.bloodlink.user.entity.BloodType;
import com.bloodlink.user.entity.UserRole;
import com.bloodlink.user.entity.UserStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private UUID id;
    private String email;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private UserRole role;
    private UserStatus status;
    private String address;
    private String city;
    private String country;
    private String postalCode;
    private String profilePictureUrl;
    private BloodType bloodType;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
