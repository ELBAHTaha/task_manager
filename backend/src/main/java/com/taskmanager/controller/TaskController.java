package com.taskmanager.controller;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody TaskRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        TaskResponse response = taskService.createTask(userEmail, projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskResponse>> getProjectTasks(
            @PathVariable Long projectId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        List<TaskResponse> tasks = taskService.getProjectTasks(userEmail, projectId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/projects/{projectId}/tasks/paginated")
    public ResponseEntity<Page<TaskResponse>> getProjectTasksPaginated(
            @PathVariable Long projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Boolean completed,
            Authentication authentication) {

        String userEmail = authentication.getName();

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ?
            Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<TaskResponse> tasks = taskService.getProjectTasksPaginated(
            userEmail, projectId, pageable, title, completed);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/tasks/{taskId}/complete")
    public ResponseEntity<?> completeTask(
            @PathVariable Long taskId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            TaskResponse response = taskService.completeTask(userEmail, taskId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to complete task: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while completing the task");
        }
    }

    @PutMapping("/tasks/{taskId}/toggle")
    public ResponseEntity<?> toggleTaskCompletion(
            @PathVariable Long taskId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            TaskResponse response = taskService.toggleTaskCompletion(userEmail, taskId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to toggle task completion: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while toggling the task");
        }
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        taskService.deleteTask(userEmail, taskId);
        return ResponseEntity.noContent().build();
    }
}
