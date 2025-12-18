package com.taskmanager.controller;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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
    
    @PutMapping("/tasks/{taskId}/complete")
    public ResponseEntity<TaskResponse> completeTask(
            @PathVariable Long taskId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        TaskResponse response = taskService.completeTask(userEmail, taskId);
        return ResponseEntity.ok(response);
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

