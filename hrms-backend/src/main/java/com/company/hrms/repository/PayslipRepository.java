package com.company.hrms.repository;

import com.company.hrms.model.Employee;
import com.company.hrms.model.Payslip;
import com.company.hrms.model.SalaryStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayslipRepository extends JpaRepository<Payslip, Long> {
    List<Payslip> findByEmployeeOrderByYearDescMonthDesc(Employee employee);
    Optional<Payslip> findByEmployeeAndYearAndMonth(Employee employee, Integer year, Integer month);
    List<Payslip> findByYearAndMonth(Integer year, Integer month);
    List<Payslip> findByYear(Integer year);
    boolean existsByEmployeeAndYearAndMonth(Employee employee, Integer year, Integer month);
}