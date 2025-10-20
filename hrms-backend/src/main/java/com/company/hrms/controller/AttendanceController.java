package com.company.hrms.controller;

import com.company.hrms.dto.AttendanceDTO;
import com.company.hrms.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/check-in")
    public ResponseEntity<?> checkIn(@RequestBody Map<String, Object> request) {
        try {
            Long employeeId = Long.parseLong(request.get("employeeId").toString());
            String remarks = request.get("remarks") != null ? request.get("remarks").toString() : null;
            
            AttendanceDTO attendance = attendanceService.checkIn(employeeId, remarks);
            return ResponseEntity.status(HttpStatus.CREATED).body(attendance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/check-out")
    public ResponseEntity<?> checkOut(@RequestBody Map<String, Object> request) {
        try {
            Long employeeId = Long.parseLong(request.get("employeeId").toString());
            String remarks = request.get("remarks") != null ? request.get("remarks").toString() : null;
            
            AttendanceDTO attendance = attendanceService.checkOut(employeeId, remarks);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/today/{employeeId}")
    public ResponseEntity<?> getTodayAttendance(@PathVariable Long employeeId) {
        try {
            AttendanceDTO attendance = attendanceService.getTodayAttendance(employeeId);
            if (attendance == null) {
                return ResponseEntity.ok(Map.of("message", "No attendance marked for today"));
            }
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-attendance/{employeeId}")
    public ResponseEntity<?> getMyAttendance(
            @PathVariable Long employeeId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        try {
            List<AttendanceDTO> attendance = attendanceService.getMyAttendance(employeeId, year, month);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<?> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<AttendanceDTO> attendance = attendanceService.getAllAttendanceByDate(date);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/date-range")
    public ResponseEntity<?> getAttendanceByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<AttendanceDTO> attendance = attendanceService.getAllAttendanceByDateRange(startDate, endDate);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/mark")
    public ResponseEntity<?> markAttendance(@Valid @RequestBody AttendanceDTO attendanceDTO) {
        try {
            AttendanceDTO marked = attendanceService.markAttendance(attendanceDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(marked);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/report/{employeeId}")
    public ResponseEntity<?> getMonthlyReport(
            @PathVariable Long employeeId,
            @RequestParam Integer year,
            @RequestParam Integer month) {
        try {
            AttendanceDTO report = attendanceService.getMonthlyReport(employeeId, year, month);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{attendanceId}")
    public ResponseEntity<?> deleteAttendance(@PathVariable Long attendanceId) {
        try {
            attendanceService.deleteAttendance(attendanceId);
            return ResponseEntity.ok("Attendance deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}