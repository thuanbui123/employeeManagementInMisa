using Microsoft.AspNetCore.Http;
using MISA.AMISDemo.Core.DTOs;
using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Services
{
    public class EmployeeService : IEmployeeService
    {
        public object ImportService(IFormFile excelFile)
        {
            throw new NotImplementedException();
        }

        public MISAServiceResult InsertService(Employee item)
        {
            throw new NotImplementedException();
        }
    }
}
