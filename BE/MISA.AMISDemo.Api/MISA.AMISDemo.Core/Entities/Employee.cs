﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Entities
{
    public class Employee
    {
        public Guid EmployeeId { get; set; }
        public string EmployeeCode { get; set; }
        public string FullName { get; set; }
        public string Sex { get; set; }
        public string Department { get; set; }
        public string Position { get; set; }
        public string Landline { get; set; }
        public string BankAccount { get; set; }
        public string BankName { get; set; }
        public string BankBranch { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        //Số chứng minh thư
        public string IdentityNumber { get; set; }
        public string IdentityPlace { get; set; }
        public DateTime? IdentityDate { get; set; }
        public decimal Salary { get; set; }
    }
}
