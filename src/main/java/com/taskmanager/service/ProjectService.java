package com.taskmanager.service;

import com.taskmanager.dto.ProjectRequest;
import com.taskmanager.dto.ProjectResponse;
import com.taskmanager.dto.ProgressResponse;
import com.taskmanager.model.Project;
import com.taskmanager.model.Task;
import com.taskmanager.model.User;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public ProjectResponse createProject(String userEmail, ProjectRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setUser(user);
        
        Project saved = projectRepository.save(project);
        return mapToResponse(saved);
    }
    
    public List<ProjectResponse> getUserProjects(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return projectRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public ProjectResponse getProjectById(String userEmail, Long projectId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        Project project = projectRepository.findByIdAndUser(projectId, user)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));
        
        return mapToResponse(project);
    }
    
    public Project getProjectEntity(String userEmail, Long projectId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return projectRepository.findByIdAndUser(projectId, user)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));
    }
    
    public ResponseEntity<?> getProjectProgress(String userEmail, Long projectId) {
        Project project = getProjectEntity(userEmail, projectId);
        
        List<Task> tasks = project.getTasks();
        int totalTasks = tasks.size();
        int completedTasks = (int) tasks.stream()
                .filter(Task::isCompleted)
                .count();
        
        double progressPercentage = totalTasks > 0 
                ? (double) completedTasks / totalTasks * 100 
                : 0.0;
        
        ProgressResponse response = new ProgressResponse(
                totalTasks,
                completedTasks,
                progressPercentage
        );
        
        return ResponseEntity.ok(response);
    }
    
    private ProjectResponse mapToResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription()
        );
    }
}

