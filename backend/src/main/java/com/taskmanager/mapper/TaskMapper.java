package com.taskmanager.mapper;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.model.Project;
import com.taskmanager.model.Task;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper class for converting between Task entities and DTOs.
 * Provides clean separation between domain models and API contracts.
 */
@Component
public class TaskMapper {

    /**
     * Maps a TaskRequest DTO to a Task entity for creation.
     *
     * @param request The task creation request
     * @param project The project that owns the task
     * @return A new Task entity
     */
    public Task toEntity(TaskRequest request, Project project) {
        if (request == null) {
            return null;
        }

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setCompleted(false); // New tasks are always incomplete
        task.setProject(project);

        return task;
    }

    /**
     * Maps a Task entity to a TaskResponse DTO.
     *
     * @param task The task entity
     * @return A TaskResponse DTO
     */
    public TaskResponse toResponse(Task task) {
        if (task == null) {
            return null;
        }

        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.isCompleted(),
                task.getProject() != null ? task.getProject().getId() : null
        );
    }

    /**
     * Maps a list of Task entities to a list of TaskResponse DTOs.
     *
     * @param tasks List of task entities
     * @return List of TaskResponse DTOs
     */
    public List<TaskResponse> toResponseList(List<Task> tasks) {
        if (tasks == null) {
            return null;
        }

        return tasks.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Updates an existing Task entity with data from a TaskRequest.
     * This is useful for update operations while preserving entity relationships.
     *
     * @param existingTask The existing task entity to update
     * @param request The update request
     */
    public void updateEntity(Task existingTask, TaskRequest request) {
        if (existingTask == null || request == null) {
            return;
        }

        existingTask.setTitle(request.getTitle());
        existingTask.setDescription(request.getDescription());
        existingTask.setDueDate(request.getDueDate());
        // Note: Project, ID, and completion status are not updated through this method
    }

    /**
     * Marks a task as completed.
     *
     * @param task The task to mark as completed
     */
    public void markCompleted(Task task) {
        if (task != null) {
            task.setCompleted(true);
        }
    }

    /**
     * Marks a task as incomplete.
     *
     * @param task The task to mark as incomplete
     */
    public void markIncomplete(Task task) {
        if (task != null) {
            task.setCompleted(false);
        }
    }
}
