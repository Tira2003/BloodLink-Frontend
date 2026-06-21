package com.bloodlink.user.security;

import com.bloodlink.user.exception.UnauthorizedException;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Arrays;

@Slf4j
@Aspect
@Component
public class RoleBasedAccessControlAspect {

    @Before("@annotation(com.bloodlink.user.security.RequireRole)")
    public void checkRole(JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RequireRole annotation = method.getAnnotation(RequireRole.class);

        if (annotation != null) {
            String[] requiredRoles = annotation.roles();
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                throw new UnauthorizedException("User is not authenticated");
            }

            boolean hasRole = authentication.getAuthorities().stream()
                    .anyMatch(auth -> Arrays.asList(requiredRoles)
                            .contains(auth.getAuthority().replace("ROLE_", "")));

            if (!hasRole) {
                log.warn("Access denied for user: {} with required roles: {}", 
                        authentication.getPrincipal(), Arrays.toString(requiredRoles));
                throw new UnauthorizedException("User does not have required permissions");
            }
        }
    }
}
