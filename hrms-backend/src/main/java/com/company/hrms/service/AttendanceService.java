package com.company.hrms.service;

import com.company.hrms.dto.AttendanceDTO;
import com.company.hrms.model.Attendance;
import com.company.hrms.model.Attendance.AttendanceStatus;
import com.company.hrms.model.Employee;
import com.company.hrms.repository.AttendanceRepository;
import com.company.hrms.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Transactional
    public AttendanceDTO checkIn(Long employeeId, String remarks) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        LocalDate today = LocalDate.now();
        
        // Check if already checked in today
        if (attendanceRepository.existsByEmployeeAndDate(employee, today)) {
            throw new RuntimeException("Already checked in today");
        }

        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setDate(today);
        attendance.setCheckInTime(LocalTime.now());
        attendance.setStatus(AttendanceStatus.PRESENT);
        attendance.setRemarks(remarks);
        attendance.checkIfLate();

        attendance = attendanceRepository.save(attendance);
        return convertToDTO(attendance);
    }

    @Transactional
    public AttendanceDTO checkOut(Long employeeId, String remarks) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        LocalDate today = LocalDate.now();
        
        Attendance attendance = attendanceRepository.findByEmployeeAndDate(employee, today)
                .orElseThrow(() -> new RuntimeException("No check-in found for today"));

        if (attendance.getCheckOutTime() != null) {
            throw new RuntimeException("Already checked out today");
        }

        attendance.setCheckOutTime(LocalTime.now());
        attendance.calculateWorkingHours();
        
        if (remarks != null && !remarks.isEmpty()) {
            String existingRemarks = attendance.getRemarks();
            attendance.setRemarks(existingRemarks != null ? 
                existingRemarks + " | Checkout: " + remarks : "Checkout: " + remarks);
        }

        attendance = attendanceRepository.save(attendance);
        return convertToDTO(attendance);
    }

    public AttendanceDTO getTodayAttendance(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        LocalDate today = LocalDate.now();
        
        return attendanceRepository.findByEmployeeAndDate(employee, today)
                .map(this::convertToDTO)
                .orElse(null);
    }

    public List<AttendanceDTO> getMyAttendance(Long employeeId, Integer year, Integer month) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        LocalDate startDate, endDate;
        
        if (year != null && month != null) {
            YearMonth yearMonth = YearMonth.of(year, month);
            startDate = yearMonth.atDay(1);
            endDate = yearMonth.atEndOfMonth();
        } else {
            // Default to current month
            YearMonth currentMonth = YearMonth.now();
            startDate = currentMonth.atDay(1);
            endDate = currentMonth.atEndOfMonth();
        }

        return attendanceRepository.findByEmployeeAndDateBetweenOrderByDateDesc(employee, startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getAllAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getAllAttendanceByDateRange(LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByDateBetween(startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AttendanceDTO markAttendance(AttendanceDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Check if attendance already exists
        Attendance attendance = attendanceRepository
                .findByEmployeeAndDate(employee, dto.getDate())
                .orElse(new Attendance());

        attendance.setEmployee(employee);
        attendance.setDate(dto.getDate());
        attendance.setStatus(dto.getStatus());
        attendance.setCheckInTime(dto.getCheckInTime());
        attendance.setCheckOutTime(dto.getCheckOutTime());
        attendance.setRemarks(dto.getRemarks());
        
        if (dto.getCheckInTime() != null) {
            attendance.checkIfLate();
        }
        
        if (dto.getCheckInTime() != null && dto.getCheckOutTime() != null) {
            attendance.calculateWorkingHours();
        }

        attendance = attendanceRepository.save(attendance);
        return convertToDTO(attendance);
    }

    public AttendanceDTO getMonthlyReport(Long employeeId, Integer year, Integer month) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        // Count different attendance statuses
        Long presentDays = attendanceRepository.countByEmployeeAndStatusInDateRange(
                employee, startDate, endDate, AttendanceStatus.PRESENT);
        
        Long absentDays = attendanceRepository.countByEmployeeAndStatusInDateRange(
                employee, startDate, endDate, AttendanceStatus.ABSENT);
        
        Long halfDays = attendanceRepository.countByEmployeeAndStatusInDateRange(
                employee, startDate, endDate, AttendanceStatus.HALF_DAY);
        
        Long wfhDays = attendanceRepository.countByEmployeeAndStatusInDateRange(
                employee, startDate, endDate, AttendanceStatus.WORK_FROM_HOME);
        
        Long leaveDays = attendanceRepository.countByEmployeeAndStatusInDateRange(
                employee, startDate, endDate, AttendanceStatus.ON_LEAVE);

        Long lateDays = attendanceRepository.countLateArrivalsByEmployee(
                employee, startDate, endDate);

        Double totalWorkingHours = attendanceRepository.sumWorkingHoursByEmployee(
                employee, startDate, endDate);

        // Create summary DTO
        AttendanceDTO summary = new AttendanceDTO();
        summary.setEmployeeId(employee.getId());
        summary.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
        summary.setEmployeeCode(employee.getEmployeeCode());
        // Note: You might want to create a separate ReportDTO for this
        summary.setRemarks(String.format(
                "Present: %d, Absent: %d, Half-Day: %d, WFH: %d, Leave: %d, Late: %d, Total Hours: %.2f",
                presentDays, absentDays, halfDays, wfhDays, leaveDays, lateDays, totalWorkingHours
        ));

        return summary;
    }

    @Transactional
    public void deleteAttendance(Long attendanceId) {
        attendanceRepository.deleteById(attendanceId);
    }

    private AttendanceDTO convertToDTO(Attendance attendance) {
        AttendanceDTO dto = new AttendanceDTO();
        dto.setId(attendance.getId());
        dto.setEmployeeId(attendance.getEmployee().getId());
        dto.setEmployeeName(attendance.getEmployee().getFirstName() + " " + 
                           attendance.getEmployee().getLastName());
        dto.setEmployeeCode(attendance.getEmployee().getEmployeeCode());
        dto.setDate(attendance.getDate());
        dto.setCheckInTime(attendance.getCheckInTime());
        dto.setCheckOutTime(attendance.getCheckOutTime());
        dto.setStatus(attendance.getStatus());
        dto.setWorkingHours(attendance.getWorkingHours());
        dto.setIsLate(attendance.getIsLate());
        dto.setRemarks(attendance.getRemarks());
        return dto;
    }
}