package com.company.hrms.repository;

import com.company.hrms.model.Employee;
import com.company.hrms.model.LeaveBalance;
import com.company.hrms.model.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {
    List<LeaveBalance> findByEmployeeId(Long employeeId);
    Optional<LeaveBalance> findByEmployeeIdAndLeaveType(Long employeeId, LeaveType leaveType);
    void deleteByEmployeeId(Long employeeId);
    
    // Methods called by LeaveService
    List<LeaveBalance> findByEmployeeAndYear(Employee employee, int year);
    Optional<LeaveBalance> findByEmployeeAndLeaveTypeAndYear(Employee employee, LeaveType leaveType, Integer year);
}