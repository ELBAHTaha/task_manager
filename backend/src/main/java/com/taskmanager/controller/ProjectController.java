package com.taskmanager.controller;

import com.taskmanager.dto.ProjectRequest;
import com.taskmanager.dto.ProjectResponse;
import com.taskmanager.service.ProjectService;
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
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        ProjectResponse response = projectService.createProject(userEmail, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getUserProjects(Authentication authentication) {
        String userEmail = authentication.getName();
        List<ProjectResponse> projects = projectService.getUserProjects(userEmail);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<ProjectResponse>> getUserProjectsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            Authentication authentication) {

        String userEmail = authentication.getName();

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ?
            Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<ProjectResponse> projects = projectService.getUserProjectsPaginated(userEmail, pageable);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(
            @PathVariable Long id,
            Authentication authentication) {
        String userEmail = authentication.getName();
        ProjectResponse project = projectService.getProjectById(userEmail, id);
        return ResponseEntity.ok(project);
    }

    @GetMapping("/{projectId}/progress")
    public ResponseEntity<?> getProjectProgress(
            @PathVariable Long projectId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        return projectService.getProjectProgress(userEmail, projectId);
    }
}
