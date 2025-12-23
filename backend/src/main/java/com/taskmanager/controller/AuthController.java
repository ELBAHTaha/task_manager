package com.taskmanager.controller;

import com.taskmanager.dto.LoginRequest;
import com.taskmanager.dto.LoginResponse;
import com.taskmanager.dto.RegisterRequest;
import com.taskmanager.model.User;
import com.taskmanager.security.JwtUtil;
import com.taskmanager.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        User user = userService.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null || !userService.verifyPassword(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        LoginResponse response = new LoginResponse(token, user.getEmail());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            // Check if user already exists
            if (userService.existsByEmail(request.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("User with email " + request.getEmail() + " already exists");
            }

            // Create new user
            User user = userService.registerUser(request);

            // Generate token for the new user
            String token = jwtUtil.generateToken(user.getEmail());
            LoginResponse response = new LoginResponse(token, user.getEmail());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Registration failed: " + e.getMessage());
        }
    }
}
