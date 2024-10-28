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

        [HttpGet("search")]
        public IActionResult Get([FromQuery(Name ="value")] string value, [FromQuery(Name = "branch")] string branch, [FromQuery(Name = "limit")] int limit, [FromQuery(Name = "offset")] int offset)
        {
            var data = _employeeService.Search(value, branch, limit, offset);
            return StatusCode(200, data);
        }

        [HttpGet("generate-code")]
        public IActionResult GenerateCode()
        {
            var res = _employeeService.GenerateNewCode();
            return StatusCode(200, res);
        }

        [HttpGet("sum-rows")]
        public IActionResult GetSumRows()
        {
            var res = _employeeRepository.GetSumRow();
            return StatusCode(200, res);
        }

        [HttpGet("filter-by-branch")]
        public IActionResult FilterByBranch([FromQuery(Name = "branch")]string branch, [FromQuery(Name = "limit")] int limit, [FromQuery(Name ="offset")] int offset)
        {
            var res = _employeeRepository.FilterByBranch(branch, limit, offset);
            return StatusCode(200, res);
        }

        [HttpGet("paginate")]
        public IActionResult Paginate([FromQuery(Name = "branch")] string? branch, [FromQuery(Name ="limit")]int limit, [FromQuery(Name = "offset")]int offset)
        {
            var res = _employeeRepository.Paginate(branch, limit, offset);
            return StatusCode(200, res);
        }

        [HttpPost("check-file-import")]
        public IActionResult CheckFileImport (IFormFile file)
        {
            var employees = new List<Employee>();
            bool isCheck = _employeeService.CheckFileImport(file);
            return StatusCode(200, isCheck);
        }

        [HttpPost]
        public IActionResult Insert(EmployeeDTO employee)
        {
            var res = _employeeService.InsertByDTO(employee);
            return StatusCode(201, res);
        }

        [HttpPut]
        public IActionResult Update(EmployeeDTO employee)
        {
            var res = _employeeService.UpdateByDTO(employee, "EmployeeCode");
            return StatusCode(200, res);
        }

        [HttpDelete("{code}")]
        public IActionResult Delete(string code)
        {
            var res = _employeeService.DeleteByCode(code);
            return StatusCode(200, res);
        }

        [HttpPost("import")]
        public IActionResult Import()
        {
            var res = _employeeService.ImportService();
            return StatusCode(200, res);
        }
    }
}
