using MISA.AMISDemo.Core.Const;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Entities
{
    public class Department
    {
        public int Id { get; set; }

        [Required(ErrorMessage = MISAConst.ERROR_DEPARTMENTCODE_EMPTY)]
        public string? DepartmentCode { get; set; }

        [Required(ErrorMessage = MISAConst.ERROR_DEPARTMENTNAME_EMPTY)]
        public string? Name { get; set; }
    }
}
