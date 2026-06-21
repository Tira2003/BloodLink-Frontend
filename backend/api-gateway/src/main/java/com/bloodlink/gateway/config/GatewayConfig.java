package com.bloodlink.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // User Service Routes
                .route("user-service", r -> r
                        .path("/api/users/**", "/api/donors/**", "/api/patients/**", "/api/hospitals/**")
                        .uri("http://localhost:8081"))
                
                // Donation Service Routes
                .route("donation-service", r -> r
                        .path("/api/donations/**")
                        .uri("http://localhost:8082"))
                
                // Inventory Service Routes
                .route("inventory-service", r -> r
                        .path("/api/inventory/**", "/api/blood-units/**")
                        .uri("http://localhost:8083"))
                
                // Notification Service Routes
                .route("notification-service", r -> r
                        .path("/api/notifications/**")
                        .uri("http://localhost:8084"))
                
                .build();
    }

}
