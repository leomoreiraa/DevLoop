package com.devloop.controller;

import com.devloop.entity.Session;
import com.devloop.entity.User;
import com.devloop.repository.UserRepository;
import com.devloop.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import com.devloop.entity.Availability;
import com.devloop.repository.AvailabilityRepository;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AvailabilityRepository availabilityRepository;

    @PostMapping
    public ResponseEntity<Session> createSession(@RequestBody Session session, Authentication authentication) {
        // Pega o usuário autenticado pelo JWT
        String email = authentication.getName();
        User mentee = userRepository.findByEmail(email).orElseThrow();
        session.setMentee(mentee);

        // Validação: só pode agendar se houver disponibilidade
        LocalDateTime scheduledTime = session.getScheduledTime();
        User mentor = session.getMentor();
        List<Availability> availabilities = availabilityRepository.findByMentor(mentor);
        Availability slot = availabilities.stream()
            .filter(a -> !scheduledTime.isBefore(a.getStart()) && !scheduledTime.isAfter(a.getEndTime()))
            .findFirst()
            .orElse(null);

        if (slot == null) {
            return ResponseEntity.badRequest().body(null); // ou lance uma exceção customizada
        }

        // Remove a disponibilidade usada
        availabilityRepository.delete(slot);

        Session createdSession = sessionService.createSession(session);
        return ResponseEntity.ok(createdSession);
    }

    @GetMapping
    public ResponseEntity<List<Session>> getAllSessions() {
        List<Session> sessions = sessionService.getAllSessions();
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Session> getSessionById(@PathVariable Long id) {
        Session session = sessionService.getSessionById(id);
        return ResponseEntity.ok(session);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Session> updateSession(@PathVariable Long id, @RequestBody Session session) {
        Session updatedSession = sessionService.updateSession(id, session);
        return ResponseEntity.ok(updatedSession);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        sessionService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }
}