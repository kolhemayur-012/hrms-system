package com.company.hrms.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;

@Entity
@Table(name = "payslips", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id", "year", "month"}))
public class Payslip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal basicSalary;

    @Column(precision = 10, scale = 2)
    private BigDecimal hra;

    @Column(precision = 10, scale = 2)
    private BigDecimal da;

    @Column(precision = 10, scale = 2)
    private BigDecimal medicalAllowance;

    @Column(precision = 10, scale = 2)
    private BigDecimal transportAllowance;

    @Column(precision = 10, scale = 2)
    private BigDecimal otherAllowances;

    @Column(precision = 10, scale = 2)
    private BigDecimal bonus;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal grossSalary;

    @Column(precision = 10, scale = 2)
    private BigDecimal pfDeduction;

    @Column(precision = 10, scale = 2)
    private BigDecimal taxDeduction;

    @Column(precision = 10, scale = 2)
    private BigDecimal otherDeductions;

    @Column(precision = 10, scale = 2)
    private BigDecimal unpaidLeaveDeduction;

    @Column(precision = 10, scale = 2)
    private BigDecimal absentDeduction;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalDeductions;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal netSalary;

    @Column(nullable = false)
    private Integer workingDays;

    @Column(nullable = false)
    private Integer presentDays;

    @Column(nullable = false)
    private Integer absentDays;

    @Column(nullable = false)
    private Integer leaveDays;

    @Column(nullable = false)
    private LocalDate generatedDate = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PayslipStatus status = PayslipStatus.GENERATED;

    @Column(length = 500)
    private String remarks;

    public enum PayslipStatus {
        GENERATED, SENT, PAID
    }

    // Constructors
    public Payslip() {}

    // Helper method to get month name
    public String getMonthName() {
        return YearMonth.of(year, month).getMonth().name();
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

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public BigDecimal getBasicSalary() {
        return basicSalary;
    }

    public void setBasicSalary(BigDecimal basicSalary) {
        this.basicSalary = basicSalary;
    }

    public BigDecimal getHra() {
        return hra;
    }

    public void setHra(BigDecimal hra) {
        this.hra = hra;
    }

    public BigDecimal getDa() {
        return da;
    }

    public void setDa(BigDecimal da) {
        this.da = da;
    }

    public BigDecimal getMedicalAllowance() {
        return medicalAllowance;
    }

    public void setMedicalAllowance(BigDecimal medicalAllowance) {
        this.medicalAllowance = medicalAllowance;
    }

    public BigDecimal getTransportAllowance() {
        return transportAllowance;
    }

    public void setTransportAllowance(BigDecimal transportAllowance) {
        this.transportAllowance = transportAllowance;
    }

    public BigDecimal getOtherAllowances() {
        return otherAllowances;
    }

    public void setOtherAllowances(BigDecimal otherAllowances) {
        this.otherAllowances = otherAllowances;
    }

    public BigDecimal getBonus() {
        return bonus;
    }

    public void setBonus(BigDecimal bonus) {
        this.bonus = bonus;
    }

    public BigDecimal getGrossSalary() {
        return grossSalary;
    }

    public void setGrossSalary(BigDecimal grossSalary) {
        this.grossSalary = grossSalary;
    }

    public BigDecimal getPfDeduction() {
        return pfDeduction;
    }

    public void setPfDeduction(BigDecimal pfDeduction) {
        this.pfDeduction = pfDeduction;
    }

    public BigDecimal getTaxDeduction() {
        return taxDeduction;
    }

    public void setTaxDeduction(BigDecimal taxDeduction) {
        this.taxDeduction = taxDeduction;
    }

    public BigDecimal getOtherDeductions() {
        return otherDeductions;
    }

    public void setOtherDeductions(BigDecimal otherDeductions) {
        this.otherDeductions = otherDeductions;
    }

    public BigDecimal getUnpaidLeaveDeduction() {
        return unpaidLeaveDeduction;
    }

    public void setUnpaidLeaveDeduction(BigDecimal unpaidLeaveDeduction) {
        this.unpaidLeaveDeduction = unpaidLeaveDeduction;
    }

    public BigDecimal getAbsentDeduction() {
        return absentDeduction;
    }

    public void setAbsentDeduction(BigDecimal absentDeduction) {
        this.absentDeduction = absentDeduction;
    }

    public BigDecimal getTotalDeductions() {
        return totalDeductions;
    }

    public void setTotalDeductions(BigDecimal totalDeductions) {
        this.totalDeductions = totalDeductions;
    }

    public BigDecimal getNetSalary() {
        return netSalary;
    }

    public void setNetSalary(BigDecimal netSalary) {
        this.netSalary = netSalary;
    }

    public Integer getWorkingDays() {
        return workingDays;
    }

    public void setWorkingDays(Integer workingDays) {
        this.workingDays = workingDays;
    }

    public Integer getPresentDays() {
        return presentDays;
    }

    public void setPresentDays(Integer presentDays) {
        this.presentDays = presentDays;
    }

    public Integer getAbsentDays() {
        return absentDays;
    }

    public void setAbsentDays(Integer absentDays) {
        this.absentDays = absentDays;
    }

    public Integer getLeaveDays() {
        return leaveDays;
    }

    public void setLeaveDays(Integer leaveDays) {
        this.leaveDays = leaveDays;
    }

    public LocalDate getGeneratedDate() {
        return generatedDate;
    }

    public void setGeneratedDate(LocalDate generatedDate) {
        this.generatedDate = generatedDate;
    }

    public PayslipStatus getStatus() {
        return status;
    }

    public void setStatus(PayslipStatus status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}