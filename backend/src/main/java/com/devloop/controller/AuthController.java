package com.devloop.controller;

import com.devloop.dto.LoginRequest;
import com.devloop.dto.RegisterRequest;
import com.devloop.service.AuthService;
import com.devloop.util.JwtUtil;
import com.devloop.entity.User;
import com.devloop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);

        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuário não encontrado"));
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword_hash())) {
            return ResponseEntity.status(401).body(Map.of("error", "Senha inválida"));
        }

        UserDetails userDetails = org.springframework.security.core.userdetails.User
            .withUsername(user.getEmail())
            .password(user.getPassword_hash())
            .roles(user.getRole().name())
            .build();

        String jwt = jwtUtil.generateToken(userDetails);
        // Return JWT as a JSON object for consistency
        return ResponseEntity.ok(Map.of("token", jwt)); 
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            authService.registerUser(registerRequest);
            return ResponseEntity.ok(Map.of("message", "User registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
}
