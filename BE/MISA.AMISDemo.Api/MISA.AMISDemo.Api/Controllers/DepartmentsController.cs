using Microsoft.AspNetCore.Mvc;
using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Interfaces;

namespace MISA.AMISDemo.Api.Controllers
{
    [Route("api/v1/departments")]
    [ApiController]
    public class DepartmentsController : Controller
    {
        private IDepartmentRepository _repository;
        private IDepartmentService _service;

        public DepartmentsController(IDepartmentRepository repository, IDepartmentService service)
        {
            _service = service;
            _repository = repository;
        }

        /// <summary>
        /// Xử lý yêu cầu HTTP GET để truy xuất danh sách phòng ban trong cơ sở dữ liệu
        /// </summary>
        /// <returns>
        /// IActionResult có mã trạng thái HTTP 200 và dữ liệu được truy xuất từ cơ sở dữ liệu
        /// </returns>
        [HttpGet]
        public IActionResult Get()
        {
            var res = _repository.Get();
            return StatusCode(200, res);
        }

        /// <summary>
        /// Xử lý yêu cầu HTTP POST để thêm mới thông tin phòng ban
        /// </summary>
        /// <param name="department">Đối tượng chứa dữ liệu cần thêm</param>
        /// <returns>
        /// IActionResult có mã HTTP 201 và số bản ghi được thêm mới
        /// </returns>
        [HttpPost]
        public IActionResult Insert([FromBody] Department department)
        {
            var res = _service.Insert(department);
            return StatusCode(201, res);
        }

        /// <summary>
        /// Xử lý yêu cầu HTTP GET để tạo mã phòng ban mới
        /// </summary>
        /// <returns>
        /// IActionResult có mã HTTP 200 và mã phòng ban mới
        /// </returns>
        [HttpGet("generate-code")]
        public IActionResult GenerateCode()
        {
            var res = _service.GenerateCode();
            return StatusCode(200, res);
        }

        /// <summary>
        /// Xử lý yêu cầu HTTP GET để tìm kiếm danh sách phòng ban thỏa mãn điều kiện tìm kiếm
        /// </summary>
        /// <param name="key">Giá trị phòng ban cần tìm kiếm</param>
        /// <returns>
        /// IActionResult với mã trạng thái HTTP 200 và danh sách phòng ban phù hợp
        /// </returns>
        [HttpGet("search")]
        public IActionResult Search([FromQuery(Name ="key")] string key)
        {
            var res = _service.Search(key);
            return StatusCode(200, res);
        }

        /// <summary>
        /// Xử lý yêu cầu HTTP GET để lấy phòng ban dựa trên mã phòng ban
        /// </summary>
        /// <param name="code">Mã phòng ban để xác định đối tượng cần lấy</param>
        /// <returns>IActionResult với mã trạng thái HTTP 200 và phòng ban có mã tương ứng</returns>
        [HttpGet("get-by-code")]
        public IActionResult GetByCode([FromQuery(Name = "code")] string code)
        {
            var res = _repository.GetByCode(code);
            return StatusCode(200, res);
        }

        /// <summary>
        /// Xử lý yêu cầu HTTP PUT để cập nhật thông tin phòng ban
        /// </summary>
        /// <param name="departmentCode">Mã phòng ban để xác định đối tượng cần cập nhật</param>
        /// <param name="department">Đối tượng chứa thông tin phòng ban cần cập nhật</param>
        /// <returns>
        /// IActionResult với mã trạng thái HTTP 200 và số lượng bản ghi được cập nhật
        /// </returns>
        [HttpPut("{departmentCode}")]
        public IActionResult Update ([FromRoute] string departmentCode, [FromBody] Department department)
        {
            var res = _service.Update(department, "DepartmentCode", departmentCode);
            return StatusCode(200, res);
        }

        /// <summary>
        /// Xử lý yêu cầu HTTP DELETE để xóa thông tin phòng ban
        /// </summary>
        /// <param name="code">Mã phòng ban để xác định đối tượng cần xóa</param>
        /// <returns>
        /// IActionResult với mã trạng thái HTTP 200 và số lượng bản bị xóa
        /// </returns>
        [HttpDelete("{code}")]
        public IActionResult Delete([FromRoute] string code)
        {
            var res = _service.Delete(code);
            return StatusCode(200, res);
        }
    }
}
