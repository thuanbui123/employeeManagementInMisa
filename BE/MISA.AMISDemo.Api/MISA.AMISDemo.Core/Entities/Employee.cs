using System;
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
        public DateTime? DateOfBirth { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        //Số chứng minh thư
        public string IndentityNumber { get; set; }
        public string IndentityPlace { get; set; }
        public DateTime? IndentityDate { get; set; }
        public decimal Salary { get; set; }
    }
}
