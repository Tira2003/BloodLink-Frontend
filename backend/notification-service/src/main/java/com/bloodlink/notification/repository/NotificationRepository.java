package com.bloodlink.notification.repository;

import com.bloodlink.notification.entity.Notification;
import com.bloodlink.notification.entity.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    
    List<Notification> findByUserId(UUID userId);
    
    List<Notification> findByUserIdOrderByCreatedAtDesc(UUID userId);
    
    List<Notification> findByUserIdAndIsReadFalse(UUID userId);
    
    List<Notification> findByUserIdAndType(UUID userId, NotificationType type);
    
    @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND n.createdAt BETWEEN :startDate AND :endDate ORDER BY n.createdAt DESC")
    List<Notification> findByUserIdAndDateRange(
        @Param("userId") UUID userId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.userId = :userId AND n.isRead = false")
    long countUnreadByUserId(@Param("userId") UUID userId);
    
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.userId = :userId")
    void markAllAsRead(@Param("userId") UUID userId);
}
