package com.taskmanager.repository;

import com.taskmanager.model.Project;
import com.taskmanager.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByUser(User user);
    Page<Project> findByUser(User user, Pageable pageable);
    Optional<Project> findByIdAndUser(Long id, User user);
}
