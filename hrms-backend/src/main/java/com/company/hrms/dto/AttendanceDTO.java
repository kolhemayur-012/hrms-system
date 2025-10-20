package com.company.hrms.dto;

import com.company.hrms.model.Attendance.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

// AttendanceDTO.java
public class AttendanceDTO {
    private Long id;
    @NotNull
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    @NotNull
    private LocalDate date;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private AttendanceStatus status;
    private Double workingHours;
    private Boolean isLate;
    private String remarks;

    // Constructors
    public AttendanceDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalTime checkInTime) { this.checkInTime = checkInTime; }

    public LocalTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalTime checkOutTime) { this.checkOutTime = checkOutTime; }

    public AttendanceStatus getStatus() { return status; }
    public void setStatus(AttendanceStatus status) { this.status = status; }

    public Double getWorkingHours() { return workingHours; }
    public void setWorkingHours(Double workingHours) { this.workingHours = workingHours; }

    public Boolean getIsLate() { return isLate; }
    public void setIsLate(Boolean isLate) { this.isLate = isLate; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}

// CheckInRequest.java
class CheckInRequest {
    @NotNull
    private Long employeeId;
    private String remarks;

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}

// CheckOutRequest.java
class CheckOutRequest {
    @NotNull
    private Long employeeId;
    private String remarks;

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}

// AttendanceReportDTO.java
class AttendanceReportDTO {
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    private Integer totalDays;
    private Integer presentDays;
    private Integer absentDays;
    private Integer halfDays;
    private Integer wfhDays;
    private Integer leaveDays;
    private Integer lateDays;
    private Double totalWorkingHours;
    private Double averageWorkingHours;

    // Constructors
    public AttendanceReportDTO() {}

    // Getters and Setters
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public Integer getTotalDays() { return totalDays; }
    public void setTotalDays(Integer totalDays) { this.totalDays = totalDays; }

    public Integer getPresentDays() { return presentDays; }
    public void setPresentDays(Integer presentDays) { this.presentDays = presentDays; }

    public Integer getAbsentDays() { return absentDays; }
    public void setAbsentDays(Integer absentDays) { this.absentDays = absentDays; }

    public Integer getHalfDays() { return halfDays; }
    public void setHalfDays(Integer halfDays) { this.halfDays = halfDays; }

    public Integer getWfhDays() { return wfhDays; }
    public void setWfhDays(Integer wfhDays) { this.wfhDays = wfhDays; }

    public Integer getLeaveDays() { return leaveDays; }
    public void setLeaveDays(Integer leaveDays) { this.leaveDays = leaveDays; }

    public Integer getLateDays() { return lateDays; }
    public void setLateDays(Integer lateDays) { this.lateDays = lateDays; }

    public Double getTotalWorkingHours() { return totalWorkingHours; }
    public void setTotalWorkingHours(Double totalWorkingHours) { this.totalWorkingHours = totalWorkingHours; }

    public Double getAverageWorkingHours() { return averageWorkingHours; }
    public void setAverageWorkingHours(Double averageWorkingHours) { this.averageWorkingHours = averageWorkingHours; }
}