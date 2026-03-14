package com.pbl.hub.repository;

import com.pbl.hub.model.Task;
import com.pbl.hub.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);

    long countByStatus(TaskStatus status);
}
