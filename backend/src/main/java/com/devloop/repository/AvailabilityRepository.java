package com.devloop.repository;

import com.devloop.entity.Availability;
import com.devloop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByMentor(User mentor);
}
