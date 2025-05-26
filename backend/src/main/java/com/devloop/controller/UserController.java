package com.devloop.controller;

import com.devloop.dto.PasswordUpdateDto;
import com.devloop.dto.UserDto;
import com.devloop.dto.UserProfileDto;
import com.devloop.entity.User;
import com.devloop.repository.UserRepository;
import com.devloop.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.save(user);
        return ResponseEntity.status(201).body(createdUser);
    }

    /**
     * Endpoint legado para atualização completa de usuário
     * Mantido para compatibilidade, mas não deve ser usado para atualização de perfil ou senha
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        User updatedUser = userService.update(id, user);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Novo endpoint para atualização apenas de campos do perfil
     * Aceita apenas campos permitidos e não afeta campos sensíveis como senha ou email
     */
    @PutMapping("/{id}/profile")
    public ResponseEntity<User> updateUserProfile(@PathVariable Long id, @RequestBody UserProfileDto profileDto) {
        User updatedUser = userService.updateProfile(id, profileDto);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Endpoint específico para atualização de senha
     * Requer senha atual para validação e retorna status de sucesso/falha
     */
    @PutMapping("/{id}/password")
    public ResponseEntity<?> updateUserPassword(@PathVariable Long id, @RequestBody PasswordUpdateDto passwordDto) {
        boolean success = userService.updatePassword(id, passwordDto);
        
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Senha atualizada com sucesso"));
        } else {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Falha ao atualizar senha. Verifique se a senha atual está correta."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        // Corrija para garantir que o username não seja null
        String username = user.getName() != null ? user.getName() : user.getEmail();
        
        // Criar DTO completo com todos os campos do perfil
        UserDto dto = new UserDto(
            user.getId(), 
            username, 
            user.getEmail(), 
            user.getRole().name(),
            user.getBio(),
            user.getTitle(),
            user.getExperience(),
            user.getSkills(),
            user.getProfileImage()
        );
        
        return ResponseEntity.ok(dto);
    }
    
    /**
     * Endpoint para upload de imagem de perfil
     */
    @PutMapping("/{id}/profile-image")
    public ResponseEntity<User> updateProfileImage(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String imageData = payload.get("imageData");
        if (imageData == null || imageData.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        User updatedUser = userService.updateProfileImage(id, imageData);
        return ResponseEntity.ok(updatedUser);
    }
}