package com.company.hrms.dto;

import com.company.hrms.model.Payslip.PayslipStatus;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class GeneratePayrollRequest {
    @NotNull
    private Integer year;
    @NotNull
    private Integer month;
    private BigDecimal bonusAmount;

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Integer getMonth() { return month; }
    public void setMonth(Integer month) { this.month = month; }

    public BigDecimal getBonusAmount() { return bonusAmount; }
    public void setBonusAmount(BigDecimal bonusAmount) { this.bonusAmount = bonusAmount; }
}