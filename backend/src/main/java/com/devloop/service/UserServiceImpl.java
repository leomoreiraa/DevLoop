package com.devloop.service;

import com.devloop.dto.PasswordUpdateDto;
import com.devloop.dto.UserProfileDto;
import com.devloop.entity.User;
import com.devloop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public User update(Long id, User user) {
        User existing = findById(id);
        existing.setName(user.getName());
        existing.setEmail(user.getEmail());
        existing.setPassword_hash(user.getPassword_hash());
        existing.setRole(user.getRole());
        return userRepository.save(existing);
    }
    
    @Override
    public User updateProfile(Long id, UserProfileDto profileDto) {
        User existing = findById(id);
        
        // Atualiza apenas os campos permitidos do perfil
        if (profileDto.getUsername() != null) {
            existing.setName(profileDto.getUsername());
        }
        
        // Atualiza campos adicionais do perfil
        if (profileDto.getBio() != null) {
            existing.setBio(profileDto.getBio());
        }
        
        if (profileDto.getTitle() != null) {
            existing.setTitle(profileDto.getTitle());
        }
        
        if (profileDto.getExperience() != null) {
            existing.setExperience(profileDto.getExperience());
        }
        
        if (profileDto.getSkills() != null) {
            existing.setSkills(profileDto.getSkills());
        } else {
            // Garante que skills não seja null
            existing.setSkills(new ArrayList<>());
        }
        
        return userRepository.save(existing);
    }
    
    @Override
    public boolean updatePassword(Long id, PasswordUpdateDto passwordDto) {
        User user = findById(id);
        
        // Verifica se a senha atual está correta
        if (!passwordEncoder.matches(passwordDto.getCurrentPassword(), user.getPassword_hash())) {
            return false; // Senha atual incorreta
        }
        
        // Atualiza a senha com a nova senha criptografada
        user.setPassword_hash(passwordEncoder.encode(passwordDto.getNewPassword()));
        userRepository.save(user);
        
        return true; // Senha atualizada com sucesso
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
    
    // Implementação do método que faltava
    @Override
    public User updateProfileImage(Long id, String imageData) {
        User user = findById(id);
        user.setProfileImage(imageData);
        return userRepository.save(user);
    }
}

