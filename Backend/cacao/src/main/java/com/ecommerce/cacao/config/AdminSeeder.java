package com.ecommerce.cacao.config;

import com.ecommerce.cacao.entity.User;
import com.ecommerce.cacao.entity.UserRole;
import com.ecommerce.cacao.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminSeeder {

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Bean
    public CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            if (userRepository.existsByEmail(adminEmail)) {
                return;
            }

            User admin = new User();

            admin.setName("Cacao Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(
                    passwordEncoder.encode(adminPassword)
            );
            admin.setRole(UserRole.ADMIN);

            userRepository.save(admin);

            System.out.println(
                    "========================================"
            );
            System.out.println(
                    "Cacao admin account created successfully"
            );
            System.out.println(
                    "Admin email: " + adminEmail
            );
            System.out.println(
                    "========================================"
            );
        };
    }
}