package com.devloop.dto;

import java.util.List;

public class UserDto {
    private Long id;
    private String username; // <-- troque de name para username
    private String email;
    private String role;
    private String bio;
    private String title;
    private String experience;
    private List<String> skills;
    private String profileImage;

    public UserDto() {}

    public UserDto(Long id, String username, String email, String role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public UserDto(Long id, String username, String email, String role, String bio, 
                  String title, String experience, List<String> skills, String profileImage) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.bio = bio;
        this.title = title;
        this.experience = experience;
        this.skills = skills;
        this.profileImage = profileImage;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
}