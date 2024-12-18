﻿using MISA.AMISDemo.Core.Const;
using MISA.AMISDemo.Core.CustomValidation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.DTOs
{
    public class EmployeeDTO
    {
        public Guid? EmployeeID { get; set; }

        [Required(ErrorMessage = MISAConst.ERROR_EMPLOYEECODE_EMPTY)]
        public string? EmployeeCode { get; set; }

        [Required(ErrorMessage = MISAConst.ERROR_EMPLOYEENAME_EMPTY)]
        public string? FullName { get; set; }

        public string? Gender { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public string? DepartmentCode { get; set; }

        public string? PositionCode { get; set; }

        public string? Address { get; set; }

        public decimal? Salary { get; set; } = null;

        [Required(ErrorMessage = MISAConst.ERROR_EMPLOYEEIDENTITYNUMBER_EMPTY)]
        public string? IdentityNumber { get; set; }

        public DateTime? IdentityDate { get; set; }

        public string? IdentityPlace { get; set; }

        [Required(ErrorMessage = MISAConst.ERROR_EMPLOYEEPHONENUMBER_EMPTY)]
        public string? PhoneNumber { get; set; }

        public string? Landline { get; set; }

        [Required(ErrorMessage = MISAConst.ERROR_EMPLOYEEEMAIL_EMPTY)]
        public string? Email { get; set; }

        public string? BankAccount { get; set; }

        public string? BankName { get; set; }

        public string? Branch { get; set; }
    }
}
