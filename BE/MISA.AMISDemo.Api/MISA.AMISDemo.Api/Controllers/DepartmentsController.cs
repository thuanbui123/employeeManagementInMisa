using Microsoft.AspNetCore.Mvc;
using MISA.AMISDemo.Core.Interfaces;

namespace MISA.AMISDemo.Api.Controllers
{
    [Route("api/v1/departments")]
    [ApiController]
    public class DepartmentsController : Controller
    {
        private IDepartmentRepository _repository;

        public DepartmentsController(IDepartmentRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IActionResult Get ()
        {
            var res = _repository.Get();
            return StatusCode(200, res);
        }
    }
}
