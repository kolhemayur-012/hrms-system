package com.company.hrms.repository;

import com.company.hrms.model.Employee;
import com.company.hrms.model.Employee.EmployeeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmployeeCode(String employeeCode);
    Boolean existsByEmployeeCode(String employeeCode);
    List<Employee> findByStatus(EmployeeStatus status);
    Page<Employee> findByStatus(EmployeeStatus status, Pageable pageable);
}