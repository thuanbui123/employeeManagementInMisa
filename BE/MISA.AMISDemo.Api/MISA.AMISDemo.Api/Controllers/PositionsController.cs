using Microsoft.AspNetCore.Mvc;
using MISA.AMISDemo.Core.Interfaces;

namespace MISA.AMISDemo.Api.Controllers
{
    [Route("api/v1/positions")]
    [ApiController]
    public class PositionsController : Controller
    {
        private IPositionRepository _repository;

        public PositionsController(IPositionRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]        
        public IActionResult Get()
        {
            var res = _repository.Get();
            return StatusCode(200, res);
        }
        
    }
}
