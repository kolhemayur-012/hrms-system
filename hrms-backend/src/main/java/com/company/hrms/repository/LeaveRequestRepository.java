package com.company.hrms.repository;

import com.company.hrms.model.Employee;
import com.company.hrms.model.LeaveBalance;
import com.company.hrms.model.LeaveRequest;
import com.company.hrms.model.LeaveRequest.LeaveStatus;
import com.company.hrms.model.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeOrderByAppliedDateDesc(Employee employee);
    List<LeaveRequest> findByStatusOrderByAppliedDateDesc(LeaveStatus status);
    List<LeaveRequest> findByEmployeeAndStatus(Employee employee, LeaveStatus status);
    
    // Check for overlapping leaves
    List<LeaveRequest> findByEmployeeAndStatusNotAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
        Employee employee, 
        LeaveStatus status, 
        LocalDate endDate, 
        LocalDate startDate
    );
}

