package com.pbl.hub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.pbl.hub.dto.MessageResponse;
import com.pbl.hub.dto.TaskRequest;
import com.pbl.hub.model.Project;
import com.pbl.hub.model.Task;
import com.pbl.hub.model.TaskStatus;
import com.pbl.hub.repository.ProjectRepository;
import com.pbl.hub.repository.TaskRepository;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    ProjectRepository projectRepository;

    @GetMapping("/project/{projectId}")
    public List<Task> getTasksByProject(@PathVariable Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MENTOR')")
    public ResponseEntity<?> createTask(@RequestBody TaskRequest taskRequest) {
        Project project = projectRepository.findById(taskRequest.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Task task = new Task();
        task.setProject(project);
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());

        if (taskRequest.getStatus() != null) {
            try {
                task.setStatus(TaskStatus.valueOf(taskRequest.getStatus()));
            } catch (IllegalArgumentException e) {
                task.setStatus(TaskStatus.TODO);
            }
        } else {
            task.setStatus(TaskStatus.TODO);
        }

        taskRepository.save(task);

        return ResponseEntity.ok(new MessageResponse("Task created successfully!"));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('MENTOR')")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long id, @RequestBody TaskRequest taskRequest) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        try {
            task.setStatus(TaskStatus.valueOf(taskRequest.getStatus()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid status"));
        }

        taskRepository.save(task);
        return ResponseEntity.ok(new MessageResponse("Task status updated successfully!"));
    }
}
