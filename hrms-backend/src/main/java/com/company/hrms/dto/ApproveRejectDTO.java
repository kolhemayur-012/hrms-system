package com.company.hrms.dto;

import com.company.hrms.model.LeaveRequest.LeaveStatus;
import com.company.hrms.model.LeaveType;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

class ApproveRejectDTO {
    @NotNull
    private LeaveStatus status;
    private String comments;

    // Getters and Setters
    public LeaveStatus getStatus() { return status; }
    public void setStatus(LeaveStatus status) { this.status = status; }
    
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}