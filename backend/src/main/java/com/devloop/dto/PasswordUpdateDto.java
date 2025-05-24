package com.devloop.dto;

/**
 * DTO para atualização de senha de usuário
 * Contém a senha atual e a nova senha para validação
 */
public class PasswordUpdateDto {
    private String currentPassword;
    private String newPassword;

    public PasswordUpdateDto() {
    }

    public PasswordUpdateDto(String currentPassword, String newPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
