package com.devloop.service;

import com.devloop.entity.Session;
import java.util.List;

public interface SessionService {
    Session createSession(Session session);
    List<Session> getAllSessions();
    Session getSessionById(Long id);
    Session updateSession(Long id, Session session);
    void deleteSession(Long id);
}
