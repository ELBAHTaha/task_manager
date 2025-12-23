package com.taskmanager.service;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.model.Project;
import com.taskmanager.model.Task;
import com.taskmanager.model.User;
import com.taskmanager.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private TaskService taskService;

    private User testUser;
    private Project testProject;
    private Task testTask;
    private TaskRequest taskRequest;
    private String userEmail;
    private Long projectId;
    private Long taskId;

    @BeforeEach
    void setUp() {
        userEmail = "test@example.com";
        projectId = 1L;
        taskId = 1L;

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail(userEmail);

        testProject = new Project();
        testProject.setId(projectId);
        testProject.setTitle("Test Project");
        testProject.setUser(testUser);

        testTask = new Task();
        testTask.setId(taskId);
        testTask.setTitle("Test Task");
        testTask.setDescription("Test Description");
        testTask.setDueDate(LocalDate.now().plusDays(7));
        testTask.setCompleted(false);
        testTask.setProject(testProject);

        taskRequest = new TaskRequest();
        taskRequest.setTitle("New Task");
        taskRequest.setDescription("New Description");
        taskRequest.setDueDate(LocalDate.now().plusDays(5));
    }

    @Test
    void createTask_WithValidRequest_ShouldCreateAndReturnTask() {
        // Given
        when(projectService.getProjectEntity(userEmail, projectId)).thenReturn(testProject);
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When
        TaskResponse result = taskService.createTask(userEmail, projectId, taskRequest);

        // Then
        assertNotNull(result);
        assertEquals(testTask.getId(), result.getId());
        assertEquals(testTask.getTitle(), result.getTitle());
        assertEquals(testTask.getDescription(), result.getDescription());
        assertEquals(testTask.getDueDate(), result.getDueDate());
        assertFalse(result.isCompleted());
        assertEquals(projectId, result.getProjectId());

        verify(projectService, times(1)).getProjectEntity(userEmail, projectId);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void createTask_WithProjectNotFound_ShouldThrowException() {
        // Given
        when(projectService.getProjectEntity(userEmail, projectId))
                .thenThrow(new RuntimeException("Project not found"));

        // When & Then
        assertThrows(RuntimeException.class,
            () -> taskService.createTask(userEmail, projectId, taskRequest));

        verify(projectService, times(1)).getProjectEntity(userEmail, projectId);
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void createTask_WithNullTitle_ShouldStillCreate() {
        // Given
        taskRequest.setTitle(null);
        when(projectService.getProjectEntity(userEmail, projectId)).thenReturn(testProject);
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When
        TaskResponse result = taskService.createTask(userEmail, projectId, taskRequest);

        // Then
        assertNotNull(result);
        verify(projectService, times(1)).getProjectEntity(userEmail, projectId);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void createTask_WithNullDueDate_ShouldStillCreate() {
        // Given
        taskRequest.setDueDate(null);
        when(projectService.getProjectEntity(userEmail, projectId)).thenReturn(testProject);
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When
        TaskResponse result = taskService.createTask(userEmail, projectId, taskRequest);

        // Then
        assertNotNull(result);
        verify(projectService, times(1)).getProjectEntity(userEmail, projectId);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void createTask_WithEmptyDescription_ShouldStillCreate() {
        // Given
        taskRequest.setDescription("");
        when(projectService.getProjectEntity(userEmail, projectId)).thenReturn(testProject);
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When
        TaskResponse result = taskService.createTask(userEmail, projectId, taskRequest);

        // Then
        assertNotNull(result);
        verify(projectService, times(1)).getProjectEntity(userEmail, projectId);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void getProjectTasks_WithValidProject_ShouldReturnTasks() {
        // Given
        Task task2 = new Task();
        task2.setId(2L);
        task2.setTitle("Task 2");
        task2.setDescription("Description 2");
        task2.setDueDate(LocalDate.now().plusDays(3));
        task2.setCompleted(true);
        task2.setProject(testProject);

        List<Task> tasks = Arrays.asList(testTask, task2);

        when(projectService.getProjectEntity(userEmail, projectId)).thenReturn(testProject);
        when(taskRepository.findByProject(testProject)).thenReturn(tasks);

        // When
        List<TaskResponse> result = taskService.getProjectTasks(userEmail, projectId);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(testTask.getId(), result.get(0).getId());
        assertEquals(task2.getId(), result.get(1).getId());

        verify(projectService, times(1)).getProjectEntity(userEmail, projectId);
        verify(taskRepository, times(1)).findByProject(testProject);
    }

    @Test
    void getProjectTasks_WithProjectNotFound_ShouldThrowException() {
        // Given
        when(projectService.getProjectEntity(userEmail, projectId))
                .thenThrow(new RuntimeException("Project not found"));

        // When & Then
        assertThrows(RuntimeException.class,
            () -> taskService.getProjectTasks(userEmail, projectId));

        verify(projectService, times(1)).getProjectEntity(userEmail, projectId);
        verify(taskRepository, never()).findByProject(any(Project.class));
    }

    @Test
    void getProjectTasks_WithNoTasks_ShouldReturnEmptyList() {
        // Given
        when(projectService.getProjectEntity(userEmail, projectId)).thenReturn(testProject);
        when(taskRepository.findByProject(testProject)).thenReturn(Arrays.asList());

        // When
        List<TaskResponse> result = taskService.getProjectTasks(userEmail, projectId);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(projectService, times(1)).getProjectEntity(userEmail, projectId);
        verify(taskRepository, times(1)).findByProject(testProject);
    }

    @Test
    void completeTask_WithValidTask_ShouldMarkAsCompleted() {
        // Given
        Task completedTask = new Task();
        completedTask.setId(taskId);
        completedTask.setTitle(testTask.getTitle());
        completedTask.setDescription(testTask.getDescription());
        completedTask.setDueDate(testTask.getDueDate());
        completedTask.setCompleted(true);
        completedTask.setProject(testProject);

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        when(projectService.getProjectEntity(userEmail, projectId)).thenReturn(testProject);
        when(taskRepository.save(any(Task.class))).thenReturn(completedTask);

        // When
        TaskResponse result = taskService.completeTask(userEmail, taskId);

        // Then
        assertNotNull(result);
        assertEquals(taskId, result.getId());
        assertTrue(result.isCompleted());

        verify(taskRepository, times(1)).findById(taskId);
        verify(projectService, times(1)).getProjectEntity(userEmail, projectId);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void completeTask_WithTaskNotFound_ShouldThrowException() {
        // Given
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class,
            () -> taskService.completeTask(userEmail, taskId));

        verify(taskRepository, times(1)).findById(taskId);
        verify(projectService, never()).getProjectEntity(anyString(), anyLong());
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void completeTask_WithTaskNotBelongingToUser_ShouldThrowException() {
        // Given
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        when(projectService.getProjectEntity(userEmail, projectId))
                .thenThrow(new RuntimeException("Task does not belong to user's project"));

        // When & Then
        assertThrows(RuntimeException.class,
            () -> taskService.completeTask(userEmail, taskId));

        verify(taskRepository, times(1)).findById(taskId);
        verify(projectService, times(1)).getProjectEntity(userEmail, projectId);
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void completeTask_WithAlreadyCompletedTask_ShouldStillUpdate() {
        // Given
        testTask.setCompleted(true);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        when(projectService.getProjectEntity(userEmail, projectId)).thenReturn(testProject);
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When
        TaskResponse result = taskService.completeTask(userEmail, taskId);

        // Then
        assertNotNull(result);
        assertTrue(result.isCompleted());

        verify(taskRepository, times(1)).findById(taskId);
        verify(projectService, times(1)).getProjectEntity(userEmail, projectId);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void deleteTask_WithValidTask_ShouldDeleteTask() {
        // Given
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        when(projectService.getProjectEntity(userEmail, projectId)).thenReturn(testProject);

        // When
        taskService.deleteTask(userEmail, taskId);

        // Then
        verify(taskRepository, times(1)).findById(taskId);
        verify(projectService, times(1)).getProjectEntity(userEmail, projectId);
        verify(taskRepository, times(1)).delete(testTask);
    }

    @Test
    void deleteTask_WithTaskNotFound_ShouldThrowException() {
        // Given
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class,
            () -> taskService.deleteTask(userEmail, taskId));

        verify(taskRepository, times(1)).findById(taskId);
        verify(projectService, never()).getProjectEntity(anyString(), anyLong());
        verify(taskRepository, never()).delete(any(Task.class));
    }

    @Test
    void deleteTask_WithTaskNotBelongingToUser_ShouldThrowException() {
        // Given
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        when(projectService.getProjectEntity(userEmail, projectId))
                .thenThrow(new RuntimeException("Task does not belong to user's project"));

        // When & Then
        assertThrows(RuntimeException.class,
            () -> taskService.deleteTask(userEmail, taskId));

        verify(taskRepository, times(1)).findById(taskId);
        verify(projectService, times(1)).getProjectEntity(userEmail, projectId);
        verify(taskRepository, never()).delete(any(Task.class));
    }

    @Test
    void deleteTask_WhenRepositoryThrowsException_ShouldPropagateException() {
        // Given
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        when(projectService.getProjectEntity(userEmail, projectId)).thenReturn(testProject);
        doThrow(new RuntimeException("Database error")).when(taskRepository).delete(testTask);

        // When & Then
        assertThrows(RuntimeException.class,
            () -> taskService.deleteTask(userEmail, taskId));

        verify(taskRepository, times(1)).findById(taskId);
        verify(projectService, times(1)).getProjectEntity(userEmail, projectId);
        verify(taskRepository, times(1)).delete(testTask);
    }

    @Test
    void createTask_WhenRepositoryThrowsException_ShouldPropagateException() {
        // Given
        when(projectService.getProjectEntity(userEmail, projectId)).thenReturn(testProject);
        when(taskRepository.save(any(Task.class))).thenThrow(new RuntimeException("Database error"));

        // When & Then
        assertThrows(RuntimeException.class,
            () -> taskService.createTask(userEmail, projectId, taskRequest));

        verify(projectService, times(1)).getProjectEntity(userEmail, projectId);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void getProjectTasks_WhenRepositoryThrowsException_ShouldPropagateException() {
        // Given
        when(projectService.getProjectEntity(userEmail, projectId)).thenReturn(testProject);
        when(taskRepository.findByProject(testProject)).thenThrow(new RuntimeException("Database error"));

        // When & Then
        assertThrows(RuntimeException.class,
            () -> taskService.getProjectTasks(userEmail, projectId));

        verify(projectService, times(1)).getProjectEntity(userEmail, projectId);
        verify(taskRepository, times(1)).findByProject(testProject);
    }

    @Test
    void completeTask_WhenRepositoryThrowsExceptionOnSave_ShouldPropagateException() {
        // Given
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        when(projectService.getProjectEntity(userEmail, projectId)).thenReturn(testProject);
        when(taskRepository.save(any(Task.class))).thenThrow(new RuntimeException("Database error"));

        // When & Then
        assertThrows(RuntimeException.class,
            () -> taskService.completeTask(userEmail, taskId));

        verify(taskRepository, times(1)).findById(taskId);
        verify(projectService, times(1)).getProjectEntity(userEmail, projectId);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void getTaskEntity_WithValidTaskAndUser_ShouldReturnTask() {
        // This tests the private method indirectly through completeTask
        // Given
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(testTask));
        when(projectService.getProjectEntity(userEmail, projectId)).thenReturn(testProject);
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When
        TaskResponse result = taskService.completeTask(userEmail, taskId);

        // Then
        assertNotNull(result);
        verify(taskRepository, times(1)).findById(taskId);
        verify(projectService, times(1)).getProjectEntity(userEmail, projectId);
    }

    @Test
    void mapToResponse_ShouldMapAllFields() {
        // This tests the private method indirectly through getProjectTasks
        // Given
        when(projectService.getProjectEntity(userEmail, projectId)).thenReturn(testProject);
        when(taskRepository.findByProject(testProject)).thenReturn(Arrays.asList(testTask));

        // When
        List<TaskResponse> result = taskService.getProjectTasks(userEmail, projectId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        TaskResponse response = result.get(0);
        assertEquals(testTask.getId(), response.getId());
        assertEquals(testTask.getTitle(), response.getTitle());
        assertEquals(testTask.getDescription(), response.getDescription());
        assertEquals(testTask.getDueDate(), response.getDueDate());
        assertEquals(testTask.isCompleted(), response.isCompleted());
        assertEquals(testTask.getProject().getId(), response.getProjectId());
    }
}
