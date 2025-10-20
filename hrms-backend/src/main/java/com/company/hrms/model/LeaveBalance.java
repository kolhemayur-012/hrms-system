package com.company.hrms.model;

import jakarta.persistence.*;

@Entity
@Table(name = "leave_balances", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id", "leave_type", "year"}))
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeaveType leaveType;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer totalAllowed;

    @Column(nullable = false)
    private Integer used = 0;

    @Column(nullable = false)
    private Integer pending = 0;

    // Constructors
    public LeaveBalance() {}

    public LeaveBalance(Employee employee, LeaveType leaveType, Integer year, Integer totalAllowed) {
        this.employee = employee;
        this.leaveType = leaveType;
        this.year = year;
        this.totalAllowed = totalAllowed;
        this.used = 0;
        this.pending = 0;
    }

    // Calculated field
    public Integer getAvailable() {
        return totalAllowed - used - pending;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public LeaveType getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getTotalAllowed() {
        return totalAllowed;
    }

    public void setTotalAllowed(Integer totalAllowed) {
        this.totalAllowed = totalAllowed;
    }

    public Integer getUsed() {
        return used;
    }

    public void setUsed(Integer used) {
        this.used = used;
    }

    public Integer getPending() {
        return pending;
    }

    public void setPending(Integer pending) {
        this.pending = pending;
    }
}