package com.pbl.hub.repository;

import com.pbl.hub.model.Project;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    long countByEndDateBefore(LocalDate date);

    long countByEndDateAfter(LocalDate date);
}
