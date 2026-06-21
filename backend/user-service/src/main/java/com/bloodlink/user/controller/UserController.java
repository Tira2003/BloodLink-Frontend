package com.bloodlink.user.controller;

import com.bloodlink.user.dto.AuthResponse;
import com.bloodlink.user.dto.RegisterRequest;
import com.bloodlink.user.dto.UserDTO;
import com.bloodlink.user.entity.UserRole;
import com.bloodlink.user.service.AuthService;
import com.bloodlink.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"})
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegisterRequest request) {
        log.info("Received registration request for email: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable UUID id) {
        log.info("Fetching user with ID: {}", id);
        UserDTO userDTO = userService.getUserById(id);
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        log.info("Fetching user with email: {}", email);
        UserDTO userDTO = userService.getUserByEmail(email);
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserDTO>> getUsersByRole(@PathVariable String role) {
        log.info("Fetching users with role: {}", role);
        List<UserDTO> users = userService.getUsersByRole(UserRole.valueOf(role));
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable UUID id, @Valid @RequestBody UserDTO userDTO) {
        log.info("Updating user with ID: {}", id);
        UserDTO updatedUser = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        log.info("Deleting user with ID: {}", id);
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<UserDTO> verifyUser(@PathVariable UUID id) {
        log.info("Verifying user with ID: {}", id);
        UserDTO verifiedUser = userService.verifyUser(id);
        return ResponseEntity.ok(verifiedUser);
    }
}
