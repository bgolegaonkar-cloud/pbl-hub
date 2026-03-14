package com.pbl.hub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "calendar")
public class Calendar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String assignee;

    private String status; // Not Started, In Progress, Submitted, Needs Revision, Approved

    private Integer progressPct;

    private Integer startDay;

    private Integer endDay;

    @Column(columnDefinition = "TEXT")
    private String mentorComment;

    private String lastUpdatedAt;

    public Calendar() {
    }

    public Calendar(String title, String assignee, String status, Integer progressPct, Integer startDay, Integer endDay,
            String mentorComment, String lastUpdatedAt) {
        this.title = title;
        this.assignee = assignee;
        this.status = status;
        this.progressPct = progressPct;
        this.startDay = startDay;
        this.endDay = endDay;
        this.mentorComment = mentorComment;
        this.lastUpdatedAt = lastUpdatedAt;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getProgressPct() {
        return progressPct;
    }

    public void setProgressPct(Integer progressPct) {
        this.progressPct = progressPct;
    }

    public Integer getStartDay() {
        return startDay;
    }

    public void setStartDay(Integer startDay) {
        this.startDay = startDay;
    }

    public Integer getEndDay() {
        return endDay;
    }

    public void setEndDay(Integer endDay) {
        this.endDay = endDay;
    }

    public String getMentorComment() {
        return mentorComment;
    }

    public void setMentorComment(String mentorComment) {
        this.mentorComment = mentorComment;
    }

    public String getLastUpdatedAt() {
        return lastUpdatedAt;
    }

    public void setLastUpdatedAt(String lastUpdatedAt) {
        this.lastUpdatedAt = lastUpdatedAt;
    }
}
