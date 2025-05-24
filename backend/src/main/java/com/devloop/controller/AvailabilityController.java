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

    @PutMapping("/{id}")
    public Availability updateAvailability(@PathVariable Long id, @RequestBody Availability updatedAvailability, Principal principal) {
        Availability availability = availabilityRepository.findById(id).orElseThrow();
        // (Opcional) Verifique se o usuário autenticado é o mentor dono da disponibilidade
        String email = principal.getName();
        if (!availability.getMentor().getEmail().equals(email)) {
            throw new RuntimeException("Você não tem permissão para atualizar esta disponibilidade.");
        }
        availability.setStart(updatedAvailability.getStart());
        availability.setEndTime(updatedAvailability.getEndTime());
        availability.setDayOfWeek(updatedAvailability.getDayOfWeek());
        return availabilityRepository.save(availability);
    }

    @DeleteMapping("/{id}")
    public void deleteAvailability(@PathVariable Long id, Principal principal) {
        Availability availability = availabilityRepository.findById(id).orElseThrow();
        String email = principal.getName();
        if (!availability.getMentor().getEmail().equals(email)) {
            throw new RuntimeException("Você não tem permissão para excluir esta disponibilidade.");
        }
        availabilityRepository.deleteById(id);
    }
}