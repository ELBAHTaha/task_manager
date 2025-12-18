package com.taskmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgressResponse {
    private int totalTasks;
    private int completedTasks;
    private double progressPercentage;
}

