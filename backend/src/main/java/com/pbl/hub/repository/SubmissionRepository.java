package com.pbl.hub.repository;

import com.pbl.hub.model.Submission;
import com.pbl.hub.model.User;
import com.pbl.hub.model.Project;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByStudent(User student);

    List<Submission> findByProject(Project project);

    Optional<Submission> findByStudentAndProject(User student, Project project);
}
