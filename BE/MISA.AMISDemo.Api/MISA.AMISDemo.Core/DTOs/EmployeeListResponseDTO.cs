using MISA.AMISDemo.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.DTOs
{
    public class EmployeeListResponseDTO<T>
    {
        public int SumRows { get; set; }
        public IEnumerable<T>? Employees { get; set; }
    }
}
