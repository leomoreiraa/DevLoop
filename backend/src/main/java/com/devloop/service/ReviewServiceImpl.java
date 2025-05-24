package com.devloop.service;

import com.devloop.dto.ReviewDto;
import com.devloop.entity.Review;
import com.devloop.entity.Session;
import com.devloop.entity.User;
import com.devloop.repository.ReviewRepository;
import com.devloop.repository.SessionRepository;
import com.devloop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public ReviewDto createReview(ReviewDto dto) {
        Review review = new Review();
        review.setSession(sessionRepository.findById(dto.getSessionId()).orElseThrow());
        review.setReviewer(userRepository.findById(dto.getReviewerId()).orElseThrow());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        Review saved = reviewRepository.save(review);
        return toDto(saved);
    }

    @Override
    public List<ReviewDto> getReviewsBySessionId(Long sessionId) {
        return reviewRepository.findAll().stream()
                .filter(r -> r.getSession().getId().equals(sessionId))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ReviewDto updateReview(Long id, ReviewDto dto) {
        Review review = reviewRepository.findById(id).orElseThrow();
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        return toDto(reviewRepository.save(review));
    }

    @Override
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    private ReviewDto toDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setSessionId(review.getSession().getId());
        dto.setReviewerId(review.getReviewer().getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        return dto;
    }
}
