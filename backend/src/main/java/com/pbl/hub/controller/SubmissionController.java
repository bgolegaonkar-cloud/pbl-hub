package com.pbl.hub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.pbl.hub.dto.FeedbackRequest;
import com.pbl.hub.dto.MessageResponse;
import com.pbl.hub.dto.SubmissionRequest;
import com.pbl.hub.model.*;
import com.pbl.hub.repository.*;
import com.pbl.hub.security.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    SubmissionRepository submissionRepository;

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    FeedbackRepository feedbackRepository;

    @PostMapping
    @PreAuthorize("hasAuthority('STUDENT')")
    public ResponseEntity<?> submitProject(@RequestBody SubmissionRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User student = userRepository.findById(userDetails.getId()).orElseThrow();

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (submissionRepository.findByStudentAndProject(student, project).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("You have already submitted for this project."));
        }

        Submission submission = new Submission();
        submission.setProject(project);
        submission.setStudent(student);
        submission.setFileUrl(request.getFileUrl());

        submissionRepository.save(submission);

        return ResponseEntity.ok(new MessageResponse("Project submitted successfully!"));
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAuthority('MENTOR')")
    public List<Submission> getSubmissionsByProject(@PathVariable Long projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow();
        return submissionRepository.findByProject(project);
    }

    @GetMapping("/my")
    public List<Submission> getMySubmissions() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User student = userRepository.findById(userDetails.getId()).orElseThrow();

        return submissionRepository.findByStudent(student);
    }

    @PostMapping("/{id}/feedback")
    @PreAuthorize("hasAuthority('MENTOR')")
    public ResponseEntity<?> gradeSubmission(@PathVariable Long id, @RequestBody FeedbackRequest feedbackRequest) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User mentor = userRepository.findById(userDetails.getId()).orElseThrow();

        // Update Submission Status
        try {
            submission.setStatus(SubmissionStatus.valueOf(feedbackRequest.getStatus()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid status"));
        }
        submissionRepository.save(submission);

        // Save Feedback
        Feedback feedback = new Feedback();
        feedback.setSubmission(submission);
        feedback.setMentor(mentor);
        feedback.setComments(feedbackRequest.getComments());
        feedback.setRating(feedbackRequest.getRating());

        feedbackRepository.save(feedback);

        return ResponseEntity.ok(new MessageResponse("Feedback submitted successfully!"));
    }
}
