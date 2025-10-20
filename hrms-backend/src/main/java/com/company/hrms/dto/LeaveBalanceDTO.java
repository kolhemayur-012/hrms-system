package com.company.hrms.dto;
import com.company.hrms.model.LeaveType;
class LeaveBalanceDTO {
    private Long id;
    private Long employeeId;
    private LeaveType leaveType;
    private Integer year;
    private Integer totalAllowed;
    private Integer used;
    private Integer pending;
    private Integer available;

    // Constructors
    public LeaveBalanceDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    
    public LeaveType getLeaveType() { return leaveType; }
    public void setLeaveType(LeaveType leaveType) { this.leaveType = leaveType; }
    
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    
    public Integer getTotalAllowed() { return totalAllowed; }
    public void setTotalAllowed(Integer totalAllowed) { this.totalAllowed = totalAllowed; }
    
    public Integer getUsed() { return used; }
    public void setUsed(Integer used) { this.used = used; }
    
    public Integer getPending() { return pending; }
    public void setPending(Integer pending) { this.pending = pending; }
    
    public Integer getAvailable() { return available; }
    public void setAvailable(Integer available) { this.available = available; }
}