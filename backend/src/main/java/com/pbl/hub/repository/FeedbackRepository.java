package com.pbl.hub.repository;

import com.pbl.hub.model.Feedback;
import com.pbl.hub.model.Submission;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Optional<Feedback> findBySubmission(Submission submission);
}
