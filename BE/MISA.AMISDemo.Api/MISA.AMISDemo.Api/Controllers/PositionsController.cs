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

        /// <summary>
        /// Xử lý yêu cầu HTTP GET để lấy danh sách nhân viên
        /// </summary>
        /// <returns>
        /// IActionResult với mã trạng thái HTTP 200 và danh sách chức vụ
        /// </returns>
        [HttpGet]        
        public IActionResult Get()
        {
            var res = _repository.Get();
            return StatusCode(200, res);
        }
        
    }
}
