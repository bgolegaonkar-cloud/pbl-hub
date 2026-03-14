package com.pbl.hub.dto;

public class SubmissionRequest {
    private Long projectId;
    private String fileUrl;

    public SubmissionRequest() {
    }

    public SubmissionRequest(Long projectId, String fileUrl) {
        this.projectId = projectId;
        this.fileUrl = fileUrl;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }
}
