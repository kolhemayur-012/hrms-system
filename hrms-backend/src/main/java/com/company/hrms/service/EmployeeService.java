package com.company.hrms.service;

import com.company.hrms.dto.EmployeeDTO;
import com.company.hrms.model.Employee;
import com.company.hrms.model.User;
import com.company.hrms.repository.EmployeeRepository;
import com.company.hrms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {
        if (employeeRepository.existsByEmployeeCode(employeeDTO.getEmployeeCode())) {
            throw new RuntimeException("Employee code already exists");
        }

        // Create User
        User user = new User();
        user.setUsername(employeeDTO.getUsername());
        user.setPassword(passwordEncoder.encode(employeeDTO.getPassword()));
        user.setEmail(employeeDTO.getEmail());
        user.setRole(User.Role.valueOf(employeeDTO.getRole()));
        user.setIsActive(true);
        user = userRepository.save(user);

        // Create Employee
        Employee employee = new Employee();
        employee.setUser(user);
        employee.setEmployeeCode(employeeDTO.getEmployeeCode());
        employee.setFirstName(employeeDTO.getFirstName());
        employee.setLastName(employeeDTO.getLastName());
        employee.setEmail(employeeDTO.getEmail());
        employee.setPhone(employeeDTO.getPhone());
        employee.setDesignation(employeeDTO.getDesignation());
        employee.setDateOfJoining(employeeDTO.getDateOfJoining());
        employee.setSalary(employeeDTO.getSalary());
        employee.setStatus(Employee.EmployeeStatus.ACTIVE);

        employee = employeeRepository.save(employee);
        return convertToDTO(employee);
    }

    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return convertToDTO(employee);
    }

    public Page<EmployeeDTO> getAllEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable).map(this::convertToDTO);
    }

    public List<EmployeeDTO> getAllEmployeesList() {
        return employeeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        employee.setFirstName(employeeDTO.getFirstName());
        employee.setLastName(employeeDTO.getLastName());
        employee.setEmail(employeeDTO.getEmail());
        employee.setPhone(employeeDTO.getPhone());
        employee.setDesignation(employeeDTO.getDesignation());
        employee.setDateOfJoining(employeeDTO.getDateOfJoining());
        employee.setSalary(employeeDTO.getSalary());
        employee.setStatus(employeeDTO.getStatus());

        employee = employeeRepository.save(employee);
        return convertToDTO(employee);
    }

    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        employee.setStatus(Employee.EmployeeStatus.INACTIVE);
        employeeRepository.save(employee);
    }

    private EmployeeDTO convertToDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setEmployeeCode(employee.getEmployeeCode());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setDesignation(employee.getDesignation());
        dto.setDateOfJoining(employee.getDateOfJoining());
        dto.setSalary(employee.getSalary());
        dto.setStatus(employee.getStatus());
        return dto;
    }
}