package com.devloop.service;

import com.devloop.dto.RegisterRequest;
import com.devloop.entity.User;
import com.devloop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void registerUser(RegisterRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword_hash(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.valueOf(request.getRole())); // Use o papel enviado
        userRepository.save(user);
    }
}