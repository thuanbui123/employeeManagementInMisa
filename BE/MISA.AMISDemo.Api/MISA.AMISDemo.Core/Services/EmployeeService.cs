using Microsoft.AspNetCore.Http;
using MISA.AMISDemo.Core.DTOs;
using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Exceptions;
using MISA.AMISDemo.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Services
{
    public class EmployeeService : BaseService<Employee>, IEmployeeService
    {
        private IEmployeeRepository _employeeRepository;
        public EmployeeService(IEmployeeRepository repository):base(repository) 
        {
            _employeeRepository = repository;
        }
        public object ImportService(IFormFile excelFile)
        {
            throw new NotImplementedException();
        }

        public MISAServiceResult InsertService(Employee? item, EmployeeDTO? dto)
        {
            if (item != null) ValidateObject(item);
            string? MaxCode = _employeeRepository.GetMaxCode();

            return new MISAServiceResult
            {
                Susscess = true,
                Data = MaxCode
            };

        }

        protected override void ValidateObject(Employee entity)
        {
            var isDuplicate = _employeeRepository.CheckDuplicateCode(entity.EmployeeCode);
            if (isDuplicate )
            {
                throw new MISAValidateException("Mã nhân viên đã tồn tại trong hệ thống!");
            }
        }

        public IEnumerable<Employee>? Search(string query)
        {
            IEnumerable<Employee> result = _employeeRepository.Get("employeeCode", query);
            if (result == null || result.Count() == 0)
            {
                result = _employeeRepository.Get("fullName", query);
            }
            return result;
        }
    }
}
