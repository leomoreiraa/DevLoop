package com.devloop.controller;

import com.devloop.entity.Availability;
import com.devloop.entity.User;
import com.devloop.repository.AvailabilityRepository;
import com.devloop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/availabilities")
public class AvailabilityController {

    @Autowired
    private AvailabilityRepository availabilityRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public Availability createAvailability(@RequestBody Availability availability, Principal principal) {
        String email = principal.getName();
        User mentor = userRepository.findByEmail(email).orElseThrow();
        availability.setMentor(mentor);
        return availabilityRepository.save(availability);
    }

    @GetMapping
    public List<Availability> getAvailabilities(@RequestParam(required = false) Long mentorId) {
        if (mentorId != null) {
            User mentor = userRepository.findById(mentorId).orElseThrow();
            return availabilityRepository.findByMentor(mentor);
        }
        return availabilityRepository.findAll();
    }
}