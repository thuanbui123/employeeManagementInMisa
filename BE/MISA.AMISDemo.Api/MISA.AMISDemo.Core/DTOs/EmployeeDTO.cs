using MISA.AMISDemo.Core.Const;
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
        public string? EmployeeCode { get; set; }

        [Required(ErrorMessage = MISAConst.ERROR_EMPLOYEENAME_EMPTY)]
        public string? FullName { get; set; }

        [Required(ErrorMessage =MISAConst.ERROR_EMPLOYEEGENDER_EMPTY)]
        public string? Gender { get; set; }

        [DateLessThanToday(ErrorMessage = MISAConst.ERROR_EMPLOYEEDATEOFBIRTH_GREATERTHANTODAY)]
        [Required(ErrorMessage = MISAConst.ERROR_EMPLOYEEDATEOFBIRTH_EMPTY)]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = MISAConst.ERROR_EMPLOYEEDEPARTMENT_EMPTY)]
        public string? DepartmentCode { get; set; }

        [Required(ErrorMessage = MISAConst.ERROR_EMPLOYEEPOSITION_EMPTY)]
        public string? PositionCode { get; set; }

        [Required(ErrorMessage = MISAConst.ERROR_EMPLOYEEADDRESS_EMPTY)]
        public string? Address { get; set; }

        [Required(ErrorMessage =MISAConst.ERROR_EMPLOYEESALARY_EMPTY)]
        public decimal Salary { get; set; }

        public string? IdentityNumber { get; set; }

        public string? IdentityDate { get; set; }

        public string? IdentityPlace { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Landline { get; set; }

        public string? Email { get; set; }

        public string? BankAccount { get; set; }

        public string? BankName { get; set; }

        public string? Branch { get; set; }
    }
}
