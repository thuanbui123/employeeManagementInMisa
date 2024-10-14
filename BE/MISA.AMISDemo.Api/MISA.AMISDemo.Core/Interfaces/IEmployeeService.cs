using Microsoft.AspNetCore.Http;
using MISA.AMISDemo.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Interfaces
{
    public interface IEmployeeService:IBaseService<Employee>
    {
        object ImportService(IFormFile excelFile);
    }
}
