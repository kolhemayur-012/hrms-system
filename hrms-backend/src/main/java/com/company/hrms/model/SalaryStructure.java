package com.company.hrms.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "salary_structures")
public class SalaryStructure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "employee_id", nullable = false, unique = true)
    private Employee employee;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal basicSalary;

    @Column(precision = 10, scale = 2)
    private BigDecimal hra; // House Rent Allowance

    @Column(precision = 10, scale = 2)
    private BigDecimal da; // Dearness Allowance

    @Column(precision = 10, scale = 2)
    private BigDecimal medicalAllowance;

    @Column(precision = 10, scale = 2)
    private BigDecimal transportAllowance;

    @Column(precision = 10, scale = 2)
    private BigDecimal otherAllowances;

    @Column(precision = 10, scale = 2)
    private BigDecimal pfDeduction; // Provident Fund

    @Column(precision = 10, scale = 2)
    private BigDecimal taxDeduction; // Income Tax (TDS)

    @Column(precision = 10, scale = 2)
    private BigDecimal otherDeductions;

    // Constructors
    public SalaryStructure() {}

    // Calculate gross salary
    public BigDecimal calculateGrossSalary() {
        BigDecimal gross = basicSalary;
        if (hra != null) gross = gross.add(hra);
        if (da != null) gross = gross.add(da);
        if (medicalAllowance != null) gross = gross.add(medicalAllowance);
        if (transportAllowance != null) gross = gross.add(transportAllowance);
        if (otherAllowances != null) gross = gross.add(otherAllowances);
        return gross;
    }

    // Calculate total deductions
    public BigDecimal calculateTotalDeductions() {
        BigDecimal deductions = BigDecimal.ZERO;
        if (pfDeduction != null) deductions = deductions.add(pfDeduction);
        if (taxDeduction != null) deductions = deductions.add(taxDeduction);
        if (otherDeductions != null) deductions = deductions.add(otherDeductions);
        return deductions;
    }

    // Calculate net salary
    public BigDecimal calculateNetSalary() {
        return calculateGrossSalary().subtract(calculateTotalDeductions());
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
}