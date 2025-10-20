package com.company.hrms.service;

import com.company.hrms.dto.PayslipDTO;
import com.company.hrms.dto.SalaryStructureDTO;
import com.company.hrms.model.*;
import com.company.hrms.model.Attendance.AttendanceStatus;
import com.company.hrms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.company.hrms.repository.PayslipRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PayrollService {

    @Autowired
    private SalaryStructureRepository salaryStructureRepository;

    @Autowired
    private PayslipRepository payslipRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Transactional
    public SalaryStructureDTO createOrUpdateSalaryStructure(SalaryStructureDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        SalaryStructure structure = salaryStructureRepository.findByEmployee(employee)
                .orElse(new SalaryStructure());

        structure.setEmployee(employee);
        structure.setBasicSalary(dto.getBasicSalary());
        structure.setHra(dto.getHra() != null ? dto.getHra() : BigDecimal.ZERO);
        structure.setDa(dto.getDa() != null ? dto.getDa() : BigDecimal.ZERO);
        structure.setMedicalAllowance(dto.getMedicalAllowance() != null ? dto.getMedicalAllowance() : BigDecimal.ZERO);
        structure.setTransportAllowance(dto.getTransportAllowance() != null ? dto.getTransportAllowance() : BigDecimal.ZERO);
        structure.setOtherAllowances(dto.getOtherAllowances() != null ? dto.getOtherAllowances() : BigDecimal.ZERO);
        structure.setPfDeduction(dto.getPfDeduction() != null ? dto.getPfDeduction() : BigDecimal.ZERO);
        structure.setTaxDeduction(dto.getTaxDeduction() != null ? dto.getTaxDeduction() : BigDecimal.ZERO);
        structure.setOtherDeductions(dto.getOtherDeductions() != null ? dto.getOtherDeductions() : BigDecimal.ZERO);

        structure = salaryStructureRepository.save(structure);
        return convertSalaryStructureToDTO(structure);
    }

    public SalaryStructureDTO getSalaryStructure(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        return salaryStructureRepository.findByEmployee(employee)
                .map(this::convertSalaryStructureToDTO)
                .orElse(null);
    }

    public List<SalaryStructureDTO> getAllSalaryStructures() {
        return salaryStructureRepository.findAll()
                .stream()
                .map(this::convertSalaryStructureToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PayslipDTO generatePayslip(Long employeeId, Integer year, Integer month, BigDecimal bonus) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Check if payslip already exists
        if (payslipRepository.existsByEmployeeAndYearAndMonth(employee, year, month)) {
            throw new RuntimeException("Payslip already generated for this month");
        }

        // Get salary structure
        SalaryStructure structure = salaryStructureRepository.findByEmployee(employee)
                .orElseThrow(() -> new RuntimeException("Salary structure not found for employee"));

        // Calculate attendance data
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        int totalWorkingDays = yearMonth.lengthOfMonth();

        List<Attendance> attendanceList = attendanceRepository
                .findByEmployeeAndDateBetweenOrderByDateDesc(employee, startDate, endDate);

        int presentDays = (int) attendanceList.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.PRESENT || 
                            a.getStatus() == AttendanceStatus.WORK_FROM_HOME)
                .count();

        int absentDays = (int) attendanceList.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.ABSENT)
                .count();

        int leaveDays = (int) attendanceList.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.ON_LEAVE)
                .count();

        // Calculate pro-rated salary based on present days
        BigDecimal perDaySalary = structure.calculateGrossSalary()
                .divide(BigDecimal.valueOf(totalWorkingDays), 2, RoundingMode.HALF_UP);

        // Calculate deductions for absent days
        BigDecimal absentDeduction = perDaySalary
                .multiply(BigDecimal.valueOf(absentDays))
                .setScale(2, RoundingMode.HALF_UP);

        // Calculate unpaid leave deduction
        BigDecimal unpaidLeaveDeduction = calculateUnpaidLeaveDeduction(employee, year, month, perDaySalary);

        // Create payslip
        Payslip payslip = new Payslip();
        payslip.setEmployee(employee);
        payslip.setYear(year);
        payslip.setMonth(month);
        payslip.setBasicSalary(structure.getBasicSalary());
        payslip.setHra(structure.getHra());
        payslip.setDa(structure.getDa());
        payslip.setMedicalAllowance(structure.getMedicalAllowance());
        payslip.setTransportAllowance(structure.getTransportAllowance());
        payslip.setOtherAllowances(structure.getOtherAllowances());
        payslip.setBonus(bonus != null ? bonus : BigDecimal.ZERO);

        BigDecimal grossSalary = structure.calculateGrossSalary().add(payslip.getBonus());
        payslip.setGrossSalary(grossSalary);

        payslip.setPfDeduction(structure.getPfDeduction());
        payslip.setTaxDeduction(structure.getTaxDeduction());
        payslip.setOtherDeductions(structure.getOtherDeductions());
        payslip.setAbsentDeduction(absentDeduction);
        payslip.setUnpaidLeaveDeduction(unpaidLeaveDeduction);

        BigDecimal totalDeductions = structure.calculateTotalDeductions()
                .add(absentDeduction)
                .add(unpaidLeaveDeduction);
        payslip.setTotalDeductions(totalDeductions);

        BigDecimal netSalary = grossSalary.subtract(totalDeductions);
        payslip.setNetSalary(netSalary);

        payslip.setWorkingDays(totalWorkingDays);
        payslip.setPresentDays(presentDays);
        payslip.setAbsentDays(absentDays);
        payslip.setLeaveDays(leaveDays);

        payslip = payslipRepository.save(payslip);
        return convertPayslipToDTO(payslip);
    }

    @Transactional
    public List<PayslipDTO> generatePayrollForAll(Integer year, Integer month, BigDecimal bonus) {
        List<Employee> employees = employeeRepository.findAll();
        return employees.stream()
                .filter(emp -> salaryStructureRepository.existsByEmployee(emp))
                .filter(emp -> !payslipRepository.existsByEmployeeAndYearAndMonth(emp, year, month))
                .map(emp -> {
                    try {
                        return generatePayslip(emp.getId(), year, month, bonus);
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(payslip -> payslip != null)
                .collect(Collectors.toList());
    }

    public List<PayslipDTO> getMyPayslips(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        return payslipRepository.findByEmployeeOrderByYearDescMonthDesc(employee)
                .stream()
                .map(this::convertPayslipToDTO)
                .collect(Collectors.toList());
    }

    public PayslipDTO getPayslip(Long payslipId) {
        Payslip payslip = payslipRepository.findById(payslipId)
                .orElseThrow(() -> new RuntimeException("Payslip not found"));
        return convertPayslipToDTO(payslip);
    }

    public List<PayslipDTO> getPayslipsByMonth(Integer year, Integer month) {
        return payslipRepository.findByYearAndMonth(year, month)
                .stream()
                .map(this::convertPayslipToDTO)
                .collect(Collectors.toList());
    }

    private BigDecimal calculateUnpaidLeaveDeduction(Employee employee, Integer year, Integer month, BigDecimal perDaySalary) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        // Get unpaid leaves
        List<LeaveRequest> unpaidLeaves = leaveRequestRepository
                .findByEmployeeAndStatusNotAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        employee, 
                        LeaveRequest.LeaveStatus.REJECTED,
                        endDate,
                        startDate
                ).stream()
                .filter(leave -> leave.getLeaveType() == LeaveType.UNPAID && 
                               leave.getStatus() == LeaveRequest.LeaveStatus.APPROVED)
                .collect(Collectors.toList());

        int unpaidDays = unpaidLeaves.stream()
                .mapToInt(LeaveRequest::getNumberOfDays)
                .sum();

        return perDaySalary.multiply(BigDecimal.valueOf(unpaidDays))
                .setScale(2, RoundingMode.HALF_UP);
    }

    @Transactional
    public void deletePayslip(Long payslipId) {
        payslipRepository.deleteById(payslipId);
    }

    private SalaryStructureDTO convertSalaryStructureToDTO(SalaryStructure structure) {
        SalaryStructureDTO dto = new SalaryStructureDTO();
        dto.setId(structure.getId());
        dto.setEmployeeId(structure.getEmployee().getId());
        dto.setEmployeeName(structure.getEmployee().getFirstName() + " " + 
                           structure.getEmployee().getLastName());
        dto.setEmployeeCode(structure.getEmployee().getEmployeeCode());
        dto.setBasicSalary(structure.getBasicSalary());
        dto.setHra(structure.getHra());
        dto.setDa(structure.getDa());
        dto.setMedicalAllowance(structure.getMedicalAllowance());
        dto.setTransportAllowance(structure.getTransportAllowance());
        dto.setOtherAllowances(structure.getOtherAllowances());
        dto.setPfDeduction(structure.getPfDeduction());
        dto.setTaxDeduction(structure.getTaxDeduction());
        dto.setOtherDeductions(structure.getOtherDeductions());
        dto.setGrossSalary(structure.calculateGrossSalary());
        dto.setTotalDeductions(structure.calculateTotalDeductions());
        dto.setNetSalary(structure.calculateNetSalary());
        return dto;
    }

    private PayslipDTO convertPayslipToDTO(Payslip payslip) {
        PayslipDTO dto = new PayslipDTO();
        dto.setId(payslip.getId());
        dto.setEmployeeId(payslip.getEmployee().getId());
        dto.setEmployeeName(payslip.getEmployee().getFirstName() + " " + 
                           payslip.getEmployee().getLastName());
        dto.setEmployeeCode(payslip.getEmployee().getEmployeeCode());
        dto.setYear(payslip.getYear());
        dto.setMonth(payslip.getMonth());
        dto.setMonthName(payslip.getMonthName());
        dto.setBasicSalary(payslip.getBasicSalary());
        dto.setHra(payslip.getHra());
        dto.setDa(payslip.getDa());
        dto.setMedicalAllowance(payslip.getMedicalAllowance());
        dto.setTransportAllowance(payslip.getTransportAllowance());
        dto.setOtherAllowances(payslip.getOtherAllowances());
        dto.setBonus(payslip.getBonus());
        dto.setGrossSalary(payslip.getGrossSalary());
        dto.setPfDeduction(payslip.getPfDeduction());
        dto.setTaxDeduction(payslip.getTaxDeduction());
        dto.setOtherDeductions(payslip.getOtherDeductions());
        dto.setUnpaidLeaveDeduction(payslip.getUnpaidLeaveDeduction());
        dto.setAbsentDeduction(payslip.getAbsentDeduction());
        dto.setTotalDeductions(payslip.getTotalDeductions());
        dto.setNetSalary(payslip.getNetSalary());
        dto.setWorkingDays(payslip.getWorkingDays());
        dto.setPresentDays(payslip.getPresentDays());
        dto.setAbsentDays(payslip.getAbsentDays());
        dto.setLeaveDays(payslip.getLeaveDays());
        dto.setGeneratedDate(payslip.getGeneratedDate());
        dto.setStatus(payslip.getStatus());
        dto.setRemarks(payslip.getRemarks());
        return dto;
    }
}