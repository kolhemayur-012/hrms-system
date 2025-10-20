package com.company.hrms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HrmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(HrmsApplication.class, args);
        System.out.println("\n✅ HRMS Application Started Successfully!");
        System.out.println("🌐 Access at: http://localhost:8080");
        System.out.println("📝 Create admin: POST http://localhost:8080/api/auth/register\n");
    }
}