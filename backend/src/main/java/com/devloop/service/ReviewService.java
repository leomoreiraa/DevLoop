package com.devloop.service;

import com.devloop.dto.ReviewDto;
import java.util.List;

public interface ReviewService {
    ReviewDto createReview(ReviewDto reviewDto);
    List<ReviewDto> getReviewsBySessionId(Long sessionId);
    ReviewDto updateReview(Long id, ReviewDto reviewDto);
    void deleteReview(Long id);
}
