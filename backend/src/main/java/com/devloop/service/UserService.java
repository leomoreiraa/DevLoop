package com.devloop.service;

import com.devloop.entity.User;
import java.util.List;

public interface UserService {
    List<User> findAll();
    User findById(Long id);
    User save(User user);
    User update(Long id, User user);
    void delete(Long id);
}
