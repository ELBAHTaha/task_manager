package com.taskmanager.service;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.mapper.TaskMapper;
import com.taskmanager.model.Project;
import com.taskmanager.model.Task;
import com.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private TaskMapper taskMapper;

    public TaskResponse createTask(String userEmail, Long projectId, TaskRequest request) {
        Project project = projectService.getProjectEntity(userEmail, projectId);

        Task task = taskMapper.toEntity(request, project);
        Task saved = taskRepository.save(task);
        return taskMapper.toResponse(saved);
    }

    public List<TaskResponse> getProjectTasks(String userEmail, Long projectId) {
        Project project = projectService.getProjectEntity(userEmail, projectId);

        List<Task> tasks = taskRepository.findByProject(project);
        return taskMapper.toResponseList(tasks);
    }

    public Page<TaskResponse> getProjectTasksPaginated(String userEmail, Long projectId, Pageable pageable, String title, Boolean completed) {
        Project project = projectService.getProjectEntity(userEmail, projectId);

        Page<Task> tasks;

        if (title != null && !title.trim().isEmpty() && completed != null) {
            // Filter by both title and completion status
            tasks = taskRepository.findByProjectAndTitleContainingIgnoreCaseAndCompleted(project, title, completed, pageable);
        } else if (title != null && !title.trim().isEmpty()) {
            // Filter by title only
            tasks = taskRepository.findByProjectAndTitleContainingIgnoreCase(project, title, pageable);
        } else if (completed != null) {
            // Filter by completion status only
            tasks = taskRepository.findByProjectAndCompleted(project, completed, pageable);
        } else {
            // No filters, return all tasks
            tasks = taskRepository.findByProject(project, pageable);
        }

        return tasks.map(taskMapper::toResponse);
    }

    public TaskResponse completeTask(String userEmail, Long taskId) {
        Task task = getTaskEntity(userEmail, taskId);
        taskMapper.markCompleted(task);
        Task updated = taskRepository.save(task);
        return taskMapper.toResponse(updated);
    }

    public TaskResponse toggleTaskCompletion(String userEmail, Long taskId) {
        Task task = getTaskEntity(userEmail, taskId);
        if (task.isCompleted()) {
            taskMapper.markIncomplete(task);
        } else {
            taskMapper.markCompleted(task);
        }
        Task updated = taskRepository.save(task);
        return taskMapper.toResponse(updated);
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


}
