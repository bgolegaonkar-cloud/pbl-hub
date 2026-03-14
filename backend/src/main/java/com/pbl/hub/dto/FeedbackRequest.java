package com.pbl.hub.dto;

public class FeedbackRequest {
    private String comments;
    private Integer rating;
    private String status;

    public FeedbackRequest() {
    }

    public FeedbackRequest(String comments, Integer rating, String status) {
        this.comments = comments;
        this.rating = rating;
        this.status = status;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
