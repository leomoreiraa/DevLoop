package com.devloop.controller;

import com.devloop.dto.ReviewDto;
import com.devloop.entity.User;
import com.devloop.repository.UserRepository;
import com.devloop.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ReviewDto> createReview(@RequestBody ReviewDto reviewDto, Authentication authentication) {
        String email = authentication.getName();
        User reviewer = userRepository.findByEmail(email).orElseThrow();
        reviewDto.setReviewerId(reviewer.getId());
        ReviewDto createdReview = reviewService.createReview(reviewDto);
        return ResponseEntity.ok(createdReview);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<List<ReviewDto>> getReviewsBySessionId(@PathVariable Long sessionId) {
        List<ReviewDto> reviews = reviewService.getReviewsBySessionId(sessionId);
        return ResponseEntity.ok(reviews);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewDto> updateReview(@PathVariable Long id, @RequestBody ReviewDto reviewDto) {
        ReviewDto updatedReview = reviewService.updateReview(id, reviewDto);
        return ResponseEntity.ok(updatedReview);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}