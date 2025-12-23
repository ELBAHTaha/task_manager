package com.taskmanager.service;

import com.taskmanager.dto.ProjectRequest;
import com.taskmanager.dto.ProjectResponse;
import com.taskmanager.dto.ProgressResponse;
import com.taskmanager.model.Project;
import com.taskmanager.model.Task;
import com.taskmanager.model.User;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProjectService projectService;

    private User testUser;
    private Project testProject;
    private ProjectRequest projectRequest;
    private String userEmail;

    @BeforeEach
    void setUp() {
        userEmail = "test@example.com";

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail(userEmail);
        testUser.setPassword("encodedPassword");

        testProject = new Project();
        testProject.setId(1L);
        testProject.setTitle("Test Project");
        testProject.setDescription("Test Description");
        testProject.setUser(testUser);
        testProject.setTasks(new ArrayList<>());

        projectRequest = new ProjectRequest();
        projectRequest.setTitle("New Project");
        projectRequest.setDescription("New Description");
    }

    @Test
    void createProject_WithValidRequest_ShouldCreateAndReturnProject() {
        // Given
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);

        // When
        ProjectResponse result = projectService.createProject(userEmail, projectRequest);

        // Then
        assertNotNull(result);
        assertEquals(testProject.getId(), result.getId());
        assertEquals(testProject.getTitle(), result.getTitle());
        assertEquals(testProject.getDescription(), result.getDescription());

        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    void createProject_WithUserNotFound_ShouldThrowException() {
        // Given
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(UsernameNotFoundException.class,
            () -> projectService.createProject(userEmail, projectRequest));

        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(projectRepository, never()).save(any(Project.class));
    }

    @Test
    void createProject_WithNullTitle_ShouldStillCreate() {
        // Given
        projectRequest.setTitle(null);
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);

        // When
        ProjectResponse result = projectService.createProject(userEmail, projectRequest);

        // Then
        assertNotNull(result);
        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    void createProject_WithEmptyDescription_ShouldStillCreate() {
        // Given
        projectRequest.setDescription("");
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);

        // When
        ProjectResponse result = projectService.createProject(userEmail, projectRequest);

        // Then
        assertNotNull(result);
        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    void getUserProjects_WithValidUser_ShouldReturnProjects() {
        // Given
        Project project2 = new Project();
        project2.setId(2L);
        project2.setTitle("Project 2");
        project2.setDescription("Description 2");
        project2.setUser(testUser);

        List<Project> projects = Arrays.asList(testProject, project2);

        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
        when(projectRepository.findByUser(testUser)).thenReturn(projects);

        // When
        List<ProjectResponse> result = projectService.getUserProjects(userEmail);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(testProject.getId(), result.get(0).getId());
        assertEquals(project2.getId(), result.get(1).getId());

        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(projectRepository, times(1)).findByUser(testUser);
    }

    @Test
    void getUserProjects_WithUserNotFound_ShouldThrowException() {
        // Given
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(UsernameNotFoundException.class,
            () -> projectService.getUserProjects(userEmail));

        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(projectRepository, never()).findByUser(any(User.class));
    }

    @Test
    void getUserProjects_WithNoProjects_ShouldReturnEmptyList() {
        // Given
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
        when(projectRepository.findByUser(testUser)).thenReturn(new ArrayList<>());

        // When
        List<ProjectResponse> result = projectService.getUserProjects(userEmail);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(projectRepository, times(1)).findByUser(testUser);
    }

    @Test
    void getProjectById_WithValidProjectAndUser_ShouldReturnProject() {
        // Given
        Long projectId = 1L;
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
        when(projectRepository.findByIdAndUser(projectId, testUser)).thenReturn(Optional.of(testProject));

        // When
        ProjectResponse result = projectService.getProjectById(userEmail, projectId);

        // Then
        assertNotNull(result);
        assertEquals(testProject.getId(), result.getId());
        assertEquals(testProject.getTitle(), result.getTitle());
        assertEquals(testProject.getDescription(), result.getDescription());

        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(projectRepository, times(1)).findByIdAndUser(projectId, testUser);
    }

    @Test
    void getProjectById_WithUserNotFound_ShouldThrowException() {
        // Given
        Long projectId = 1L;
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(UsernameNotFoundException.class,
            () -> projectService.getProjectById(userEmail, projectId));

        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(projectRepository, never()).findByIdAndUser(anyLong(), any(User.class));
    }

    @Test
    void getProjectById_WithProjectNotFound_ShouldThrowException() {
        // Given
        Long projectId = 999L;
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
        when(projectRepository.findByIdAndUser(projectId, testUser)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class,
            () -> projectService.getProjectById(userEmail, projectId));

        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(projectRepository, times(1)).findByIdAndUser(projectId, testUser);
    }

    @Test
    void getProjectEntity_WithValidProjectAndUser_ShouldReturnProjectEntity() {
        // Given
        Long projectId = 1L;
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
        when(projectRepository.findByIdAndUser(projectId, testUser)).thenReturn(Optional.of(testProject));

        // When
        Project result = projectService.getProjectEntity(userEmail, projectId);

        // Then
        assertNotNull(result);
        assertEquals(testProject, result);
        assertEquals(testProject.getId(), result.getId());

        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(projectRepository, times(1)).findByIdAndUser(projectId, testUser);
    }

    @Test
    void getProjectEntity_WithUserNotFound_ShouldThrowException() {
        // Given
        Long projectId = 1L;
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(UsernameNotFoundException.class,
            () -> projectService.getProjectEntity(userEmail, projectId));

        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(projectRepository, never()).findByIdAndUser(anyLong(), any(User.class));
    }

    @Test
    void getProjectProgress_WithNoTasks_ShouldReturnZeroProgress() {
        // Given
        Long projectId = 1L;
        testProject.setTasks(new ArrayList<>());

        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
        when(projectRepository.findByIdAndUser(projectId, testUser)).thenReturn(Optional.of(testProject));

        // When
        ResponseEntity<?> result = projectService.getProjectProgress(userEmail, projectId);

        // Then
        assertNotNull(result);
        assertTrue(result.getBody() instanceof ProgressResponse);
        ProgressResponse progress = (ProgressResponse) result.getBody();
        assertEquals(0, progress.getTotalTasks());
        assertEquals(0, progress.getCompletedTasks());
        assertEquals(0.0, progress.getProgressPercentage());

        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(projectRepository, times(1)).findByIdAndUser(projectId, testUser);
    }

    @Test
    void getProjectProgress_WithSomeTasks_ShouldCalculateCorrectProgress() {
        // Given
        Long projectId = 1L;

        Task completedTask = new Task();
        completedTask.setId(1L);
        completedTask.setCompleted(true);

        Task pendingTask1 = new Task();
        pendingTask1.setId(2L);
        pendingTask1.setCompleted(false);

        Task pendingTask2 = new Task();
        pendingTask2.setId(3L);
        pendingTask2.setCompleted(false);

        List<Task> tasks = Arrays.asList(completedTask, pendingTask1, pendingTask2);
        testProject.setTasks(tasks);

        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
        when(projectRepository.findByIdAndUser(projectId, testUser)).thenReturn(Optional.of(testProject));

        // When
        ResponseEntity<?> result = projectService.getProjectProgress(userEmail, projectId);

        // Then
        assertNotNull(result);
        assertTrue(result.getBody() instanceof ProgressResponse);
        ProgressResponse progress = (ProgressResponse) result.getBody();
        assertEquals(3, progress.getTotalTasks());
        assertEquals(1, progress.getCompletedTasks());
        assertEquals(33.333333333333336, progress.getProgressPercentage(), 0.01);

        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(projectRepository, times(1)).findByIdAndUser(projectId, testUser);
    }

    @Test
    void getProjectProgress_WithAllTasksCompleted_ShouldReturn100Percent() {
        // Given
        Long projectId = 1L;

        Task completedTask1 = new Task();
        completedTask1.setId(1L);
        completedTask1.setCompleted(true);

        Task completedTask2 = new Task();
        completedTask2.setId(2L);
        completedTask2.setCompleted(true);

        List<Task> tasks = Arrays.asList(completedTask1, completedTask2);
        testProject.setTasks(tasks);

        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
        when(projectRepository.findByIdAndUser(projectId, testUser)).thenReturn(Optional.of(testProject));

        // When
        ResponseEntity<?> result = projectService.getProjectProgress(userEmail, projectId);

        // Then
        assertNotNull(result);
        assertTrue(result.getBody() instanceof ProgressResponse);
        ProgressResponse progress = (ProgressResponse) result.getBody();
        assertEquals(2, progress.getTotalTasks());
        assertEquals(2, progress.getCompletedTasks());
        assertEquals(100.0, progress.getProgressPercentage());

        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(projectRepository, times(1)).findByIdAndUser(projectId, testUser);
    }

    @Test
    void getProjectProgress_WithProjectNotFound_ShouldThrowException() {
        // Given
        Long projectId = 999L;
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
        when(projectRepository.findByIdAndUser(projectId, testUser)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class,
            () -> projectService.getProjectProgress(userEmail, projectId));

        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(projectRepository, times(1)).findByIdAndUser(projectId, testUser);
    }

    @Test
    void createProject_WhenRepositoryThrowsException_ShouldPropagateException() {
        // Given
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
        when(projectRepository.save(any(Project.class))).thenThrow(new RuntimeException("Database error"));

        // When & Then
        assertThrows(RuntimeException.class,
            () -> projectService.createProject(userEmail, projectRequest));

        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    void getUserProjects_WhenRepositoryThrowsException_ShouldPropagateException() {
        // Given
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
        when(projectRepository.findByUser(testUser)).thenThrow(new RuntimeException("Database error"));

        // When & Then
        assertThrows(RuntimeException.class,
            () -> projectService.getUserProjects(userEmail));

        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(projectRepository, times(1)).findByUser(testUser);
    }
}
