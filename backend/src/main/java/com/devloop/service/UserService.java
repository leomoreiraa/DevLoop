package com.devloop.service;

import com.devloop.dto.PasswordUpdateDto;
import com.devloop.dto.UserProfileDto;
import com.devloop.entity.User;
import java.util.List;

public interface UserService {
    List<User> findAll();
    User findById(Long id);
    User save(User user);
    User update(Long id, User user);
    User updateProfile(Long id, UserProfileDto profileDto);
    boolean updatePassword(Long id, PasswordUpdateDto passwordDto);
    void delete(Long id);
    
    // Adicionar a assinatura do método que faltava
    User updateProfileImage(Long id, String imageData);
}

