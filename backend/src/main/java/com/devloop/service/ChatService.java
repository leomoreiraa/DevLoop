package com.devloop.service;

import com.devloop.entity.Message;

public interface ChatService {
    Message saveMessage(Message message);
}
