package com.company.hrms.controller;

import com.company.hrms.dto.LeaveRequestDTO;
import com.company.hrms.model.LeaveBalance;
import com.company.hrms.model.LeaveRequest.LeaveStatus;
import com.company.hrms.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "*")public class LeaveControl {
     @Autowired
    private LeaveService leaveService;

    @PostMapping("/apply")
    public ResponseEntity<?> applyLeave(@Valid @RequestBody LeaveRequestDTO leaveRequestDTO) {
        try {
            LeaveRequestDTO created = leaveService.applyLeave(leaveRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-leaves/{employeeId}")
    public ResponseEntity<List<LeaveRequestDTO>> getMyLeaves(@PathVariable Long employeeId) {
        List<LeaveRequestDTO> leaves = leaveService.getMyLeaveRequests(employeeId);
        return ResponseEntity.ok(leaves);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<LeaveRequestDTO>> getPendingLeaves() {
        List<LeaveRequestDTO> leaves = leaveService.getPendingLeaves();
        return ResponseEntity.ok(leaves);
    }

    @GetMapping("/all")
    public ResponseEntity<List<LeaveRequestDTO>> getAllLeaves() {
        List<LeaveRequestDTO> leaves = leaveService.getAllLeaveRequests();
        return ResponseEntity.ok(leaves);
    }

    @GetMapping("/balance/{employeeId}")
    public ResponseEntity<List<LeaveBalance>> getLeaveBalance(@PathVariable Long employeeId) {
        List<LeaveBalance> balances = leaveService.getMyLeaveBalance(employeeId);
        return ResponseEntity.ok(balances);
    }

    @PutMapping("/approve/{leaveId}")
    public ResponseEntity<?> approveLeave(
            @PathVariable Long leaveId,
            @RequestBody Map<String, String> payload) {
        try {
            String comments = payload.get("comments");
            Long approverId = Long.parseLong(payload.get("approverId"));
            
            LeaveRequestDTO updated = leaveService.approveRejectLeave(
                    leaveId, LeaveStatus.APPROVED, comments, approverId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/reject/{leaveId}")
    public ResponseEntity<?> rejectLeave(
            @PathVariable Long leaveId,
            @RequestBody Map<String, String> payload) {
        try {
            String comments = payload.get("comments");
            Long approverId = Long.parseLong(payload.get("approverId"));
            
            LeaveRequestDTO updated = leaveService.approveRejectLeave(
                    leaveId, LeaveStatus.REJECTED, comments, approverId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/cancel/{leaveId}/{employeeId}")
    public ResponseEntity<?> cancelLeave(
            @PathVariable Long leaveId,
            @PathVariable Long employeeId) {
        try {
            LeaveRequestDTO updated = leaveService.cancelLeave(leaveId, employeeId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
