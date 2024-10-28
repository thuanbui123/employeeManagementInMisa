use misa_cukcuk_demo;

create table Employee (
	EmployeeId char(36) primary key,
    EmployeeCode varchar(36) unique,
    FullName varchar(100),
    DateOfBirth datetime,
    Gender varchar(5),
    Email varchar(255),
    AddressCode varchar(36),
    Department varchar(255),
    Position varchar(255),
    WorkingStatus varchar(255),
    PhoneNumber varchar(15),
    Landline varchar(15),
    IdentityNumber varchar(12),
    IdentityPlace varchar(255),
    IdentityDate datetime,
    Salary decimal(10, 0),
    BankAccount varchar(15),
    BankName varchar(255),
    BankBranch varchar(255)
);

Create table Address (
	AddressId char(36) primary key,
    AddressCode varchar(36) unique,
    Street varchar(255),
    Commune varchar(255),
    District varchar(255),
    Province varchar(255)
);

select count(*) from employee;
SELECT  * FROM Employee e WHERE e.Branch = 'Hà Nội'
INSERT INTO Address (AddressId, AddressCode, Street, Commune, District, Province)
VALUES
('1a2e4567-e89b-12d3-a456-426614174001', 'HN-001', 'Nguyễn Thái Học', 'Phường Văn Miếu', 'Quận Đống Đa', 'Thành phố Hà Nội'),
('1a2e4567-e89b-12d3-a456-426614174002', 'HN-002', 'Tràng Thi', 'Phường Hàng Trống', 'Quận Hoàn Kiếm', 'Thành phố Hà Nội'),
('1a2e4567-e89b-12d3-a456-426614174003', 'HN-003', 'Nguyễn Đình Chiểu', 'Phường Láng Hạ', 'Quận Đống Đa', 'Thành phố Hà Nội'),
('1a2e4567-e89b-12d3-a456-426614174004', 'HN-004', 'Lê Duẩn', 'Phường Khâm Thiên', 'Quận Đống Đa', 'Thành phố Hà Nội'),
('1a2e4567-e89b-12d3-a456-426614174005', 'HN-005', 'Hoàng Đạo Thúy', 'Phường Nhân Chính', 'Quận Thanh Xuân', 'Thành phố Hà Nội'),
('1a2e4567-e89b-12d3-a456-426614174006', 'HN-006', 'Nguyễn Văn Cừ', 'Phường Bồ Đề', 'Quận Long Biên', 'Thành phố Hà Nội'),
('1a2e4567-e89b-12d3-a456-426614174007', 'HN-007', 'Phan Đình Phùng', 'Phường Ngọc Hà', 'Quận Ba Đình', 'Thành phố Hà Nội'),
('1a2e4567-e89b-12d3-a456-426614174008', 'HN-008', 'Trần Hưng Đạo', 'Phường Trần Hưng Đạo', 'Quận Hoàn Kiếm', 'Thành phố Hà Nội'),
('1a2e4567-e89b-12d3-a456-426614174009', 'HN-009', 'Cầu Giấy', 'Phường Dịch Vọng', 'Quận Cầu Giấy', 'Thành phố Hà Nội'),
('1a2e4567-e89b-12d3-a456-426614174010', 'HN-010', 'Nguyễn Khuyến', 'Phường Văn Quán', 'Quận Hà Đông', 'Thành phố Hà Nội');

select * from Employee order by EmployeeCode;

INSERT INTO Employee (
    EmployeeId, 
    EmployeeCode, 
    FullName, 
    DateOfBirth, 
    Gender, 
    Email, 
    Address, 
    Department, 
    Position, 
    WorkingStatus,
    PhoneNumber, 
    Landline, 
    IdentityNumber, 
    IdentityPlace, 
    IdentityDate, 
    Salary, 
    BankAccount, 
    BankName, 
    BankBranch
) VALUES 
('9c68f144-7eb7-44e2-9911-efb09f7ec9e2', 'EMP1', 'Nguyễn Văn A', '1990-01-01 00:00:00', 'Nam', 'nguyenvana@example.com', 'Hà Nội', 'Nhân sự', 'Intern', 'Đang làm', '0123456789', '0212345678', '123456789', 'Thành phố H', '2015-01-01 00:00:00', 10000000, '123456789012345', 'Ngân hàng ABC', 'Chi nhánh H'),
('a53d6b2c-2cf1-4bb5-9476-abbf8e9f0b47', 'EMP2', 'Trần Thị B', '1992-03-15 00:00:00', 'Nữ', 'tranthib@example.com', 'Thái Bình', 'Kinh doanh', 'Fresher', 'Đã nghỉ', '0987654321', '0223456789', '234567890', 'Thành phố H', '2016-03-01 00:00:00', 12000000, '987654321012345', 'Ngân hàng XYZ', 'Chi nhánh H')
SELECT EmployeeCode FROM Employee ORDER BY EmployeeCode DESC LIMIT 1

SELECT EmployeeCode
FROM Employee
ORDER BY CAST(SUBSTRING(EmployeeCode, 4, LENGTH(EmployeeCode)) AS UNSIGNED) DESC
LIMIT 1;

SELECT * FROM Employee ORDER BY EmployeeCode LIMIT 10 OFFSET 0 ;  

truncate employee