package com.company.hrms.repository;

import com.company.hrms.model.Attendance;
import com.company.hrms.model.Attendance.AttendanceStatus;
import com.company.hrms.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    // Find attendance by employee and date
    Optional<Attendance> findByEmployeeAndDate(Employee employee, LocalDate date);
    
    // Find all attendance for an employee
    List<Attendance> findByEmployeeOrderByDateDesc(Employee employee);
    
    // Find attendance by employee and date range
    List<Attendance> findByEmployeeAndDateBetweenOrderByDateDesc(
        Employee employee, LocalDate startDate, LocalDate endDate);
    
    // Find all attendance for a specific date
    List<Attendance> findByDate(LocalDate date);
    
    // Find attendance by date range
    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Check if attendance exists for employee on date
    boolean existsByEmployeeAndDate(Employee employee, LocalDate date);
    
    // Count attendance by status for an employee in date range
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.employee = :employee " +
           "AND a.date BETWEEN :startDate AND :endDate AND a.status = :status")
    Long countByEmployeeAndStatusInDateRange(
        @Param("employee") Employee employee,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("status") AttendanceStatus status);
    
    // Count late arrivals for an employee in date range
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.employee = :employee " +
           "AND a.date BETWEEN :startDate AND :endDate AND a.isLate = true")
    Long countLateArrivalsByEmployee(
        @Param("employee") Employee employee,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);
    
    // Sum working hours for an employee in date range
    @Query("SELECT COALESCE(SUM(a.workingHours), 0.0) FROM Attendance a " +
           "WHERE a.employee = :employee AND a.date BETWEEN :startDate AND :endDate")
    Double sumWorkingHoursByEmployee(
        @Param("employee") Employee employee,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);
}