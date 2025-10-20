package com.company.hrms.repository;

import com.company.hrms.model.Employee;
import com.company.hrms.model.Payslip;
import com.company.hrms.model.SalaryStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryStructureRepository extends JpaRepository<SalaryStructure, Long> {
    Optional<SalaryStructure> findByEmployee(Employee employee);
    boolean existsByEmployee(Employee employee);
}

