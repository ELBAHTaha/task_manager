package com.taskmanager.repository;

import com.taskmanager.model.Project;
import com.taskmanager.model.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProject(Project project);
    Page<Task> findByProject(Project project, Pageable pageable);

    Optional<Task> findByIdAndProject(Long id, Project project);

    // Filter by completion status
    Page<Task> findByProjectAndCompleted(Project project, Boolean completed, Pageable pageable);

    // Filter by title containing text (case-insensitive)
    @Query("SELECT t FROM Task t WHERE t.project = :project AND LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    Page<Task> findByProjectAndTitleContainingIgnoreCase(@Param("project") Project project, @Param("title") String title, Pageable pageable);

    // Combined filter: title and status
    @Query("SELECT t FROM Task t WHERE t.project = :project AND LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%')) AND t.completed = :completed")
    Page<Task> findByProjectAndTitleContainingIgnoreCaseAndCompleted(@Param("project") Project project, @Param("title") String title, @Param("completed") Boolean completed, Pageable pageable);
}
