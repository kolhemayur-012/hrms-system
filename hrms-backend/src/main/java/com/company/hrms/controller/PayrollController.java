package com.company.hrms.controller;

import com.company.hrms.dto.PayslipDTO;
import com.company.hrms.dto.SalaryStructureDTO;
import com.company.hrms.service.PayrollService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "*")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    // Salary Structure Management
    @PostMapping("/salary-structure")
    public ResponseEntity<?> createOrUpdateSalaryStructure(@Valid @RequestBody SalaryStructureDTO dto) {
        try {
            SalaryStructureDTO created = payrollService.createOrUpdateSalaryStructure(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/salary-structure/{employeeId}")
    public ResponseEntity<?> getSalaryStructure(@PathVariable Long employeeId) {
        try {
            SalaryStructureDTO structure = payrollService.getSalaryStructure(employeeId);
            if (structure == null) {
                return ResponseEntity.ok(Map.of("message", "No salary structure found"));
            }
            return ResponseEntity.ok(structure);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/salary-structures")
    public ResponseEntity<?> getAllSalaryStructures() {
        try {
            List<SalaryStructureDTO> structures = payrollService.getAllSalaryStructures();
            return ResponseEntity.ok(structures);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Payslip Generation
    @PostMapping("/generate-payslip")
    public ResponseEntity<?> generatePayslip(@RequestBody Map<String, Object> request) {
        try {
            Long employeeId = Long.parseLong(request.get("employeeId").toString());
            Integer year = Integer.parseInt(request.get("year").toString());
            Integer month = Integer.parseInt(request.get("month").toString());
            BigDecimal bonus = request.get("bonus") != null ? 
                new BigDecimal(request.get("bonus").toString()) : BigDecimal.ZERO;

            PayslipDTO payslip = payrollService.generatePayslip(employeeId, year, month, bonus);
            return ResponseEntity.status(HttpStatus.CREATED).body(payslip);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/generate-payroll")
    public ResponseEntity<?> generatePayrollForAll(@RequestBody Map<String, Object> request) {
        try {
            Integer year = Integer.parseInt(request.get("year").toString());
            Integer month = Integer.parseInt(request.get("month").toString());
            BigDecimal bonus = request.get("bonus") != null ? 
                new BigDecimal(request.get("bonus").toString()) : BigDecimal.ZERO;

            List<PayslipDTO> payslips = payrollService.generatePayrollForAll(year, month, bonus);
            return ResponseEntity.status(HttpStatus.CREATED).body(payslips);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-payslips/{employeeId}")
    public ResponseEntity<?> getMyPayslips(@PathVariable Long employeeId) {
        try {
            List<PayslipDTO> payslips = payrollService.getMyPayslips(employeeId);
            return ResponseEntity.ok(payslips);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/payslip/{payslipId}")
    public ResponseEntity<?> getPayslip(@PathVariable Long payslipId) {
        try {
            PayslipDTO payslip = payrollService.getPayslip(payslipId);
            return ResponseEntity.ok(payslip);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/payslips")
    public ResponseEntity<?> getPayslipsByMonth(
            @RequestParam Integer year,
            @RequestParam Integer month) {
        try {
            List<PayslipDTO> payslips = payrollService.getPayslipsByMonth(year, month);
            return ResponseEntity.ok(payslips);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/payslip/{payslipId}")
    public ResponseEntity<?> deletePayslip(@PathVariable Long payslipId) {
        try {
            payrollService.deletePayslip(payslipId);
            return ResponseEntity.ok("Payslip deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}