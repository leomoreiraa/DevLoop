package com.devloop.service;

import com.devloop.entity.Session;
import com.devloop.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SessionServiceImpl implements SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Override
    public Session createSession(Session session) {
        return sessionRepository.save(session);
    }

    @Override
    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    @Override
    public Session getSessionById(Long id) {
        return sessionRepository.findById(id).orElseThrow();
    }

    @Override
    public Session updateSession(Long id, Session session) {
        Session existing = getSessionById(id);
        // Adapte os campos conforme sua entidade Session
        return sessionRepository.save(existing);
    }

    @Override
    public void deleteSession(Long id) {
        sessionRepository.deleteById(id);
    }
}
