package com.bloodlink.core.repository;

import com.bloodlink.core.model.Reward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RewardRepository extends JpaRepository<Reward, UUID> {
    List<Reward> findByDonorId(UUID donorId);

    @Query("SELECT SUM(r.pointsEarned) FROM Reward r WHERE r.donorId = :donorId")
    Integer getTotalRewardsByDonor(@Param("donorId") UUID donorId);
}
