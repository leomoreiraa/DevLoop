package com.devloop.service;

import com.devloop.dto.RegisterRequest;

public interface AuthService {
    void registerUser(RegisterRequest request);
}