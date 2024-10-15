use misa_cukcuk_demo;

create table Employee (
	EmployeeId char(36) primary key,
    EmployeeCode varchar(36),
    FullName varchar(100),
    DateOfBirth datetime,
    Sex varchar(5),
    Email varchar(255),
    Address varchar(255),
    Department varchar(255),
    Position varchar(255),
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

INSERT INTO Employee (
    EmployeeId, 
    EmployeeCode, 
    FullName, 
    DateOfBirth, 
    Sex, 
    Email, 
    Address, 
    Department, 
    Position, 
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
('9c68f144-7eb7-44e2-9911-efb09f7ec9e2', 'EMP001', 'Nguyễn Văn A', '1990-01-01 00:00:00', 'Nam', 'nguyenvana@example.com', 'Hà Nội', 'Nhân sự', 'Intern', '0123456789', '0212345678', '123456789', 'Thành phố H', '2015-01-01 00:00:00', 10000000, '123456789012345', 'Ngân hàng ABC', 'Chi nhánh H'),
('a53d6b2c-2cf1-4bb5-9476-abbf8e9f0b47', 'EMP002', 'Trần Thị B', '1992-03-15 00:00:00', 'Nữ', 'tranthib@example.com', 'Thái Bình', 'Kinh doanh', 'Fresher', '0987654321', '0223456789', '234567890', 'Thành phố H', '2016-03-01 00:00:00', 12000000, '987654321012345', 'Ngân hàng XYZ', 'Chi nhánh H')

select * from employee