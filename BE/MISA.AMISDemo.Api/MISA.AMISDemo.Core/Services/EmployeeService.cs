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
        private IEmployeeRepository _employeeRepository;
        public EmployeeService(IEmployeeRepository repository)
        {
            _employeeRepository = repository;
        }
        public object ImportService(IFormFile excelFile)
        {
            throw new NotImplementedException();
        }

        public MISAServiceResult InsertService(Employee? item, EmployeeDTO? dto)
        {
            string MaxCode = _employeeRepository.GetMaxCode();
            return new MISAServiceResult
            {
                Susscess = true,
                Data = MaxCode
            };

        }

        public List<Employee> Search(string query)
        {
            List<Employee> Result = _employeeRepository.Get("employeeCode", query);
            if (Result == null || Result.Count == 0)
            {
                Result = _employeeRepository.Get("fullName", query);
            }
            return Result;
        }
    }
}
