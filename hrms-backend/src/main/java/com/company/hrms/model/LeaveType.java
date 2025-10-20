package com.company.hrms.model;

public enum LeaveType {
    SICK("Sick Leave", 12),
    CASUAL("Casual Leave", 12),
    EARNED("Earned Leave", 18),
    MATERNITY("Maternity Leave", 180),
    PATERNITY("Paternity Leave", 15),
    UNPAID("Unpaid Leave", 365);

    private final String displayName;
    private final int defaultAllowance; // days per year

    LeaveType(String displayName, int defaultAllowance) {
        this.displayName = displayName;
        this.defaultAllowance = defaultAllowance;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getDefaultAllowance() {
        return defaultAllowance;
    }
}