package com.taskmanager.config;

import com.taskmanager.model.User;
import com.taskmanager.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    // Temporarily disabled to allow schema to be created first
    // @Bean
    // CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    //     return args -> {
    //         userRepository.findByEmail("admin@test.com")
    //                 .ifPresentOrElse(existing -> {
    //                     // Always reset password and ensure names are set
    //                     existing.setPassword(passwordEncoder.encode("password123"));
    //                     if (existing.getFirstName() == null) {
    //                         existing.setFirstName("Admin");
    //                     }
    //                     if (existing.getLastName() == null) {
    //                         existing.setLastName("User");
    //                     }
    //                     userRepository.save(existing);
    //                     System.out.println("Updated admin@test.com with password 'password123'");
    //                 }, () -> {
    //                     User admin = new User();
    //                     admin.setEmail("admin@test.com");
    //                     admin.setPassword(passwordEncoder.encode("password123"));
    //                     admin.setFirstName("Admin");
    //                     admin.setLastName("User");
    //                     userRepository.save(admin);
    //                     System.out.println("Created admin@test.com with password 'password123'");
    //                 });
    //     };
    // }
}
