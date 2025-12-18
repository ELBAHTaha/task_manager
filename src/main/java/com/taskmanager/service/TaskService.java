package com.taskmanager.service;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.model.Project;
import com.taskmanager.model.Task;
import com.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private ProjectService projectService;
    
    public TaskResponse createTask(String userEmail, Long projectId, TaskRequest request) {
        Project project = projectService.getProjectEntity(userEmail, projectId);
        
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setCompleted(false);
        task.setProject(project);
        
        Task saved = taskRepository.save(task);
        return mapToResponse(saved);
    }
    
    public List<TaskResponse> getProjectTasks(String userEmail, Long projectId) {
        Project project = projectService.getProjectEntity(userEmail, projectId);
        
        return taskRepository.findByProject(project).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public TaskResponse completeTask(String userEmail, Long taskId) {
        Task task = getTaskEntity(userEmail, taskId);
        task.setCompleted(true);
        Task updated = taskRepository.save(task);
        return mapToResponse(updated);
    }
    
    public void deleteTask(String userEmail, Long taskId) {
        Task task = getTaskEntity(userEmail, taskId);
        taskRepository.delete(task);
    }
    
    private Task getTaskEntity(String userEmail, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        Project project = projectService.getProjectEntity(userEmail, task.getProject().getId());
        
        if (!task.getProject().getId().equals(project.getId())) {
            throw new RuntimeException("Task does not belong to user's project");
        }
        
        return task;
    }
    
    private TaskResponse mapToResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.isCompleted(),
                task.getProject().getId()
        );
    }
}

