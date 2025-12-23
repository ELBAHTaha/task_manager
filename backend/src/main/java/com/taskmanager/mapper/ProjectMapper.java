package com.taskmanager.mapper;

import com.taskmanager.dto.ProjectRequest;
import com.taskmanager.dto.ProjectResponse;
import com.taskmanager.model.Project;
import com.taskmanager.model.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper class for converting between Project entities and DTOs.
 * Provides clean separation between domain models and API contracts.
 */
@Component
public class ProjectMapper {

    /**
     * Maps a ProjectRequest DTO to a Project entity for creation.
     *
     * @param request The project creation request
     * @param user The user who owns the project
     * @return A new Project entity
     */
    public Project toEntity(ProjectRequest request, User user) {
        if (request == null) {
            return null;
        }

        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setUser(user);

        return project;
    }

    /**
     * Maps a Project entity to a ProjectResponse DTO.
     *
     * @param project The project entity
     * @return A ProjectResponse DTO
     */
    public ProjectResponse toResponse(Project project) {
        if (project == null) {
            return null;
        }

        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription()
        );
    }

    /**
     * Maps a list of Project entities to a list of ProjectResponse DTOs.
     *
     * @param projects List of project entities
     * @return List of ProjectResponse DTOs
     */
    public List<ProjectResponse> toResponseList(List<Project> projects) {
        if (projects == null) {
            return null;
        }

        return projects.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Updates an existing Project entity with data from a ProjectRequest.
     * This is useful for update operations while preserving entity relationships.
     *
     * @param existingProject The existing project entity to update
     * @param request The update request
     */
    public void updateEntity(Project existingProject, ProjectRequest request) {
        if (existingProject == null || request == null) {
            return;
        }

        existingProject.setTitle(request.getTitle());
        existingProject.setDescription(request.getDescription());
        // Note: User and ID are not updated as they are immutable for existing projects
    }
}
