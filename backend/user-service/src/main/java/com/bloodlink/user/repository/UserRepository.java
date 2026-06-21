package com.bloodlink.user.repository;

import com.bloodlink.user.entity.User;
import com.bloodlink.user.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(UserRole role);
    List<User> findByCity(String city);
    boolean existsByEmail(String email);
}
