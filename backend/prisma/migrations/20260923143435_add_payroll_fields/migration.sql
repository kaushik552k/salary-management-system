-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "jobLevel" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "baseSalary" REAL NOT NULL,
    "bonus" REAL,
    "joiningDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "dateOfBirth" DATETIME,
    "fatherName" TEXT,
    "panNumber" TEXT,
    "mobile" TEXT,
    "address" TEXT,
    "pfAccountNumber" TEXT,
    "epfPercent" REAL NOT NULL DEFAULT 12,
    "esiPercent" REAL NOT NULL DEFAULT 0.75,
    "professionalTax" REAL NOT NULL DEFAULT 200,
    "tdsPercent" REAL NOT NULL DEFAULT 10,
    "allowances" REAL NOT NULL DEFAULT 0,
    "bankName" TEXT,
    "bankAccountNumber" TEXT,
    "paymentMode" TEXT NOT NULL DEFAULT 'Bank Transfer',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Employee" ("baseSalary", "bonus", "country", "createdAt", "currency", "department", "email", "employeeId", "employmentType", "firstName", "id", "jobLevel", "jobTitle", "joiningDate", "lastName", "status", "updatedAt") SELECT "baseSalary", "bonus", "country", "createdAt", "currency", "department", "email", "employeeId", "employmentType", "firstName", "id", "jobLevel", "jobTitle", "joiningDate", "lastName", "status", "updatedAt" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
CREATE UNIQUE INDEX "Employee_employeeId_key" ON "Employee"("employeeId");
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");
CREATE INDEX "Employee_department_idx" ON "Employee"("department");
CREATE INDEX "Employee_country_idx" ON "Employee"("country");
CREATE INDEX "Employee_status_idx" ON "Employee"("status");
CREATE INDEX "Employee_jobLevel_idx" ON "Employee"("jobLevel");
CREATE INDEX "Employee_employmentType_idx" ON "Employee"("employmentType");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
