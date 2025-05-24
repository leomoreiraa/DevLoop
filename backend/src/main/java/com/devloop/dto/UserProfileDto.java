package com.devloop.dto;

import java.util.List;

/**
 * DTO para atualização de perfil de usuário
 * Contém apenas os campos que podem ser atualizados pelo usuário
 */
public class UserProfileDto {
    private String username;
    private String bio;
    private String title;
    private String experience;
    private List<String> skills;

    public UserProfileDto() {
    }

    public UserProfileDto(String username, String bio, String title, String experience, List<String> skills) {
        this.username = username;
        this.bio = bio;
        this.title = title;
        this.experience = experience;
        this.skills = skills;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }
}
