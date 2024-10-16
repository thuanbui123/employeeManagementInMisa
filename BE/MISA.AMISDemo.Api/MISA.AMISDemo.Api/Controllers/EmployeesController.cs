using Microsoft.AspNetCore.Mvc;
using MISA.AMISDemo.Core.DTOs;
using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Interfaces;

namespace MISA.AMISDemo.Api.Controllers
{
    [Route("api/v1/employees")]
    [ApiController]
    public class EmployeesController : Controller
    {
        private IEmployeeRepository _employeeRepository;
        private IEmployeeService _employeeService;
        public EmployeesController(IEmployeeRepository employeeRepository, IEmployeeService employeeService)
        {
            _employeeRepository = employeeRepository;
            _employeeService = employeeService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var data = _employeeRepository.Get();
            return StatusCode(200, data);
        }

        [HttpGet("{query}")]
        public IActionResult Get(string query)
        {
            var data = _employeeService.Search(query);
            return StatusCode(200, data);
        }

        [HttpPost]
        public IActionResult Insert(Employee employee)
        {
            var res = _employeeService.InsertService(employee, null);
            return StatusCode(200, res);
        }
    }
}
