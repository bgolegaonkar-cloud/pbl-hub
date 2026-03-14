package com.pbl.hub.dto;

import java.util.List;
import java.util.Map;

public class ReportStatsDto {
    private long totalProjects;
    private long completedProjects;
    private long inProgressProjects;
    private long overdueProjects;
    private Map<String, Long> taskDistribution;
    private List<MonthlyActivityDto> monthlyActivity;

    public ReportStatsDto() {
    }

    public ReportStatsDto(long totalProjects, long completedProjects, long inProgressProjects, long overdueProjects,
            Map<String, Long> taskDistribution, List<MonthlyActivityDto> monthlyActivity) {
        this.totalProjects = totalProjects;
        this.completedProjects = completedProjects;
        this.inProgressProjects = inProgressProjects;
        this.overdueProjects = overdueProjects;
        this.taskDistribution = taskDistribution;
        this.monthlyActivity = monthlyActivity;
    }

    // Getters and Setters
    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getCompletedProjects() {
        return completedProjects;
    }

    public void setCompletedProjects(long completedProjects) {
        this.completedProjects = completedProjects;
    }

    public long getInProgressProjects() {
        return inProgressProjects;
    }

    public void setInProgressProjects(long inProgressProjects) {
        this.inProgressProjects = inProgressProjects;
    }

    public long getOverdueProjects() {
        return overdueProjects;
    }

    public void setOverdueProjects(long overdueProjects) {
        this.overdueProjects = overdueProjects;
    }

    public Map<String, Long> getTaskDistribution() {
        return taskDistribution;
    }

    public void setTaskDistribution(Map<String, Long> taskDistribution) {
        this.taskDistribution = taskDistribution;
    }

    public List<MonthlyActivityDto> getMonthlyActivity() {
        return monthlyActivity;
    }

    public void setMonthlyActivity(List<MonthlyActivityDto> monthlyActivity) {
        this.monthlyActivity = monthlyActivity;
    }

    public static class MonthlyActivityDto {
        private String month;
        private long active;
        private long completed;

        public MonthlyActivityDto(String month, long active, long completed) {
            this.month = month;
            this.active = active;
            this.completed = completed;
        }

        public String getMonth() {
            return month;
        }

        public void setMonth(String month) {
            this.month = month;
        }

        public long getActive() {
            return active;
        }

        public void setActive(long active) {
            this.active = active;
        }

        public long getCompleted() {
            return completed;
        }

        public void setCompleted(long completed) {
            this.completed = completed;
        }
    }
}
