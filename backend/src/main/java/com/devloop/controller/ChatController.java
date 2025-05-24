package com.devloop.controller;

import com.devloop.entity.Message;
import com.devloop.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/session/{id}/send")
    @SendTo("/topic/session/{id}")
    public Message sendMessage(Message message) {
        return chatService.saveMessage(message);
    }
}