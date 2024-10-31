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
    DepartmentCode, 
    PositionCode, 
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



SELECT * FROM Employee e WHERE e.Branch = 'Hà Nội' ORDER BY EmployeeCode LIMIT 10 OFFSET 10
SELECT EmployeeCode
FROM Employee
ORDER BY CAST(SUBSTRING(EmployeeCode, 4, LENGTH(EmployeeCode)) AS UNSIGNED) DESC
LIMIT 1;

SELECT * FROM Employee ORDER BY EmployeeCode LIMIT 10 OFFSET 0 ;  
select * from Employee where employeeCode like '%EMP52%' and branch='Hà Nội' ORDER BY EmployeeCode LIMIT 10 OFFSET 0;

SELECT 
    CASE 
        WHEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) < 30 THEN 'Dưới 30'
        WHEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) BETWEEN 30 AND 40 THEN 'Từ 30 đến 40'
        ELSE 'Trên 40'
    END AS AgeGroup,
    COUNT(*) AS EmployeeCount
FROM 
    Employee
GROUP BY 
    AgeGroup
ORDER BY 
    AgeGroup;

create view employee_statistics_by_age_view as
SELECT 
    CASE 
        WHEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) < 30 THEN 'Dưới 30'
        WHEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) BETWEEN 30 AND 40 THEN 'Từ 30 đến 40'
        ELSE 'Trên 40'
    END AS AgeGroup,
    COUNT(*) AS EmployeeCount
FROM 
    Employee
GROUP BY 
    AgeGroup
ORDER BY 
    AgeGroup;

select * from employee_statistics_by_age_view;

create table position (
	id int auto_increment primary key,
    positionCode varchar(50) unique,
    name varchar(100)
);

insert into position (positionCode, name) values
 ('POS1', 'Intern'), 
 ('POS2', 'Fresher'), 
 ('POS3', 'Junior'),
 ('POS4', 'Senior'), 
 ('POS5', 'Product Manager');
 
 create table department (
	id int auto_increment primary key,
    departmentCode varchar(50) unique,
    name varchar(255)
 );
 
 insert into department (departmentCode, name) 
 values ('DPM1', 'Sản xuất'),
 ('DPM2', 'Kinh doanh'),
 ('DPM3', 'Nhân sự');
 