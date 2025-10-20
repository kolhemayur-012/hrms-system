package com.company.hrms.service;

import com.company.hrms.dto.LeaveRequestDTO;
import com.company.hrms.model.*;
import com.company.hrms.model.LeaveRequest.LeaveStatus;
import com.company.hrms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.company.hrms.repository.LeaveBalanceRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public LeaveRequestDTO applyLeave(LeaveRequestDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Calculate number of days
        long days = ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate()) + 1;
        dto.setNumberOfDays((int) days);

        // Check if employee has sufficient leave balance
        LeaveBalance balance = getOrCreateLeaveBalance(employee, dto.getLeaveType(), LocalDate.now().getYear());
        
        if (balance.getAvailable() < dto.getNumberOfDays()) {
            throw new RuntimeException("Insufficient leave balance. Available: " + balance.getAvailable() + " days");
        }

        // Check for overlapping leaves
        List<LeaveRequest> overlapping = leaveRequestRepository
                .findByEmployeeAndStatusNotAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        employee, LeaveStatus.REJECTED, dto.getEndDate(), dto.getStartDate());
        
        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Leave dates overlap with existing leave request");
        }

        // Create leave request
        LeaveRequest request = new LeaveRequest();
        request.setEmployee(employee);
        request.setLeaveType(dto.getLeaveType());
        request.setStartDate(dto.getStartDate());
        request.setEndDate(dto.getEndDate());
        request.setNumberOfDays(dto.getNumberOfDays());
        request.setReason(dto.getReason());
        request.setStatus(LeaveStatus.PENDING);
        request.setAppliedDate(LocalDateTime.now());

        request = leaveRequestRepository.save(request);

        // Update pending count in balance
        balance.setPending(balance.getPending() + dto.getNumberOfDays());
        leaveBalanceRepository.save(balance);

        return convertToDTO(request);
    }

    @Transactional
    public LeaveRequestDTO approveRejectLeave(Long leaveId, LeaveStatus newStatus, String comments, Long approverId) {
        LeaveRequest request = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        if (request.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException("Leave request already processed");
        }

        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new RuntimeException("Approver not found"));

        // Update leave request
        request.setStatus(newStatus);
        request.setApprovedBy(approver);
        request.setApproverComments(comments);
        request.setReviewedDate(LocalDateTime.now());

        request = leaveRequestRepository.save(request);

        // Update leave balance
        LeaveBalance balance = getOrCreateLeaveBalance(
                request.getEmployee(), 
                request.getLeaveType(), 
                request.getStartDate().getYear()
        );

        // Remove from pending
        balance.setPending(balance.getPending() - request.getNumberOfDays());

        // If approved, add to used
        if (newStatus == LeaveStatus.APPROVED) {
            balance.setUsed(balance.getUsed() + request.getNumberOfDays());
        }

        leaveBalanceRepository.save(balance);

        return convertToDTO(request);
    }

    public List<LeaveRequestDTO> getMyLeaveRequests(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        return leaveRequestRepository.findByEmployeeOrderByAppliedDateDesc(employee)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<LeaveRequestDTO> getPendingLeaves() {
        return leaveRequestRepository.findByStatusOrderByAppliedDateDesc(LeaveStatus.PENDING)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<LeaveRequestDTO> getAllLeaveRequests() {
        return leaveRequestRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<LeaveBalance> getMyLeaveBalance(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        int currentYear = LocalDate.now().getYear();
        List<LeaveBalance> balances = leaveBalanceRepository.findByEmployeeAndYear(employee, currentYear);

        // Initialize balances if not exists
        if (balances.isEmpty()) {
            for (LeaveType type : LeaveType.values()) {
                LeaveBalance balance = new LeaveBalance(employee, type, currentYear, type.getDefaultAllowance());
                leaveBalanceRepository.save(balance);
                balances.add(balance);
            }
        }

        return balances;
    }

    @Transactional
    public LeaveRequestDTO cancelLeave(Long leaveId, Long employeeId) {
        LeaveRequest request = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        if (!request.getEmployee().getId().equals(employeeId)) {
            throw new RuntimeException("Unauthorized to cancel this leave");
        }

        if (request.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException("Can only cancel pending leave requests");
        }

        request.setStatus(LeaveStatus.CANCELLED);
        request = leaveRequestRepository.save(request);

        // Update leave balance
        LeaveBalance balance = getOrCreateLeaveBalance(
                request.getEmployee(),
                request.getLeaveType(),
                request.getStartDate().getYear()
        );
        balance.setPending(balance.getPending() - request.getNumberOfDays());
        leaveBalanceRepository.save(balance);

        return convertToDTO(request);
    }

    private LeaveBalance getOrCreateLeaveBalance(Employee employee, LeaveType leaveType, Integer year) {
        return leaveBalanceRepository.findByEmployeeAndLeaveTypeAndYear(employee, leaveType, year)
                .orElseGet(() -> {
                    LeaveBalance balance = new LeaveBalance(employee, leaveType, year, leaveType.getDefaultAllowance());
                    return leaveBalanceRepository.save(balance);
                });
    }

    private LeaveRequestDTO convertToDTO(LeaveRequest request) {
        LeaveRequestDTO dto = new LeaveRequestDTO();
        dto.setId(request.getId());
        dto.setEmployeeId(request.getEmployee().getId());
        dto.setEmployeeName(request.getEmployee().getFirstName() + " " + request.getEmployee().getLastName());
        dto.setEmployeeCode(request.getEmployee().getEmployeeCode());
        dto.setLeaveType(request.getLeaveType());
        dto.setStartDate(request.getStartDate());
        dto.setEndDate(request.getEndDate());
        dto.setNumberOfDays(request.getNumberOfDays());
        dto.setReason(request.getReason());
        dto.setStatus(request.getStatus());
        dto.setAppliedDate(request.getAppliedDate());
        dto.setReviewedDate(request.getReviewedDate());
        
        if (request.getApprovedBy() != null) {
            dto.setApprovedById(request.getApprovedBy().getId());
            dto.setApprovedByName(request.getApprovedBy().getUsername());
        }
        dto.setApproverComments(request.getApproverComments());
        
        return dto;
    }
}