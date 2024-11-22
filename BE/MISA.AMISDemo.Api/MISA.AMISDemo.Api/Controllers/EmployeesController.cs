using Microsoft.AspNetCore.Mvc;
using MISA.AMISDemo.Core.Const;
using MISA.AMISDemo.Core.DTOs;
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

        /// <summary>
        /// Xử lý yêu cầu HTTP GET lấy danh sách nhân viên 
        /// </summary>
        /// <returns>
        /// IActionResult có mã trạng thái HTTP 200 và danh sách nhân viên 
        /// </returns>
        [HttpGet]
        public IActionResult Get()
        {
            var data = _employeeRepository.Get();
            return StatusCode(200, data);
        }

        /// <summary>
        /// Xử lý yêu cầu HTTP GET để lấy một nhân viên cụ thể dựa trên mã nhân viên
        /// </summary>
        /// <param name="code">Mã nhân viên để xác định đối tượng cần lấy</param>
        /// <returns>
        /// IActionResult có mã trạng thái HTTP 200 và đối tượng nhân viên có mã tương ứng
        /// </returns>
        [HttpGet("get-one-by-code")]
        public IActionResult GetOne([FromQuery(Name = "code")] string code) 
        {
            var data = _employeeRepository.GetOne(code);
            return StatusCode(200, data);
        }

        /// <summary>
        /// Xử lý yêu cầu HTTP GET tìm kiếm nhân viên dựa trên các tiêu chí đã chỉ định
        /// </summary>
        /// <param name="value">Giá trị tìm kiếm</param>
        /// <param name="branch">Tìm kiếm ở chi nhánh</param>
        /// <param name="limit">Giới hạn số bản ghi nhân viên trả về</param>
        /// <param name="offset">Lấy bản ghi từ vị trí bao nhiêu</param>
        /// <returns>
        /// IActionResult với mã trạng thái HTTP 200 và danh sách nhân viên phù hợp với tiêu chí tìm kiếm
        /// </returns>
        [HttpGet("search")]
        public IActionResult Get([FromQuery(Name ="value")] string value, [FromQuery(Name = "branch")] string branch, [FromQuery(Name = "limit")] int limit, [FromQuery(Name = "offset")] int offset)
        {
            var data = _employeeService.Search(value, branch, limit, offset);
            return StatusCode(200, data);
        }

        /// <summary>
        /// Xử lý yêu cầu HTTP GET để lấy mã nhân viên mới chưa có trong cơ sở dữ liệu
        /// </summary>
        /// <returns>
        /// IActionResult với mã trạng thái HTTP 200 và mã nhân viên mới
        /// </returns>
        [HttpGet("generate-code")]
        public IActionResult GenerateCode()
        {
            var res = _employeeService.GenerateNewCode();
            return StatusCode(200, res);
        }

        /// <summary>
        /// Xử lý HTTP GET để lấy tổng số bản ghi trong cơ sở dữ liệu
        /// </summary>
        /// <returns>
        /// IActionResult với mã trạng thái HTTP 200 và tổng số bản ghi
        /// </returns>
        [HttpGet("sum-rows")]
        public IActionResult GetSumRows()
        {
            var res = _employeeRepository.GetSumRow();
            return StatusCode(200, res);
        }

        /// <summary>
        /// Xử lý HTTP GET để lọc danh sách nhân viên theo các tiêu chí chỉ định
        /// </summary>
        /// <param name="branch">Chi nhánh cần lọc</param>
        /// <param name="limit">Giới hạn số bản ghi nhân viên trả về</param>
        /// <param name="offset">Lấy bản ghi từ vị trí số bao nhiêu</param>
        /// <returns>
        /// IActionResult với mã trạng thái HTTP 200 và danh sách nhân viên phù hợp với các tiêu chí lọc
        /// </returns>
        [HttpGet("filter-by-branch")]
        public IActionResult FilterByBranch([FromQuery(Name = "branch")]string branch, [FromQuery(Name = "limit")] int limit, [FromQuery(Name ="offset")] int offset)
        {
            var res = _employeeRepository.FilterByBranch(branch, limit, offset);
            return StatusCode(200, res);
        }

        /// <summary>
        /// Xử lý yêu cầu HTTP GET để phân trang danh sách nhân viên bằng cách sắp xếp và lọc tùy chọn.
        /// </summary>
        /// <param name="branch">Chi nhánh cần lọc</param>
        /// <param name="limit">Giới hạn số bản ghi nhân viên trả về</param>
        /// <param name="offset">Lấy bản ghi từ vị trí số bao nhiêu</param>
        /// <returns>
        /// IActionResult với mã trạng thái HTTP 200 và danh sách nhân viên phù hợp với các tiêu chí
        /// </returns>
        [HttpGet("paginate")]
        public IActionResult Paginate([FromQuery(Name = "branch")] string? branch, 
            [FromQuery(Name ="limit")]int limit, 
            [FromQuery(Name = "offset")]int offset, 
            [FromQuery(Name = "is-desc")] bool isDesc = false)
        {
            var res = _employeeRepository.Paginate(branch, limit, offset, isDesc);
            return StatusCode(200, res);
        }

        /// <summary>
        /// Xử lý HTTP GET để thống kê danh sách nhân viên theo độ tuổi
        /// </summary>
        /// <returns>
        /// IActionResult với mã trạng thái 200 và danh sách số lượng nhân viên theo:
        /// - Dưới 30 tuổi
        /// - Từ 30 đến 40 tuổi
        /// - Trên 40 tuổi
        /// </returns>
        [HttpGet("employee-statistics-by-age")]
        public IActionResult EmployeeStatisticsByAge()
        {
            var res = _employeeRepository.GetEmployeeStatisticsByAge();
            return StatusCode(200, res);
        }

        /// <summary>
        /// Xử lý yêu cầu HTTP POST để kiểm tra dữ liệu trong file Excel trước khi nhập khẩu
        /// </summary>
        /// <param name="file">File excel chứa danh sách nhân viên cần kiểm tra</param>
        /// <returns>
        /// Trả về IActionResult với 
        /// - Nếu có lỗi trong tệp, server trả về tệp lỗi định dạng Excel với nội dung lỗi.
        /// - Nếu không có lỗi, trả về trạng thái 204, nghĩa là không có nội dung.
        /// </returns>
        [HttpPost("check-file-import")]
        public IActionResult CheckFileImport (IFormFile file)
        {
            object? errorLogFile = _employeeService.CheckFileImport(file);

            if (errorLogFile is byte[] fileBytes)
            {
                return File(fileBytes, "application/octet-stream", "LogError.xlsx");
            } else
            {
                return StatusCode(204);
            }
        }

        /// <summary>
        /// Xử lý HTTP GET để xuất danh sách nhân viên ra file excel
        /// </summary>
        /// <param name="branch">Tên chi nhánh muốn xuất danh sách nhân viên</param>
        /// <returns>Trả về file Excel dưới dạng byte array để tải xuống</returns>
        [HttpGet("export-excel")]
        public IActionResult ExportExcel([FromQuery(Name = "branch")]string branch)
        {
            var res = _employeeService.ExportExcelFile(branch);

            if (res == null)
            {
                return NotFound(MISAConst.NOT_FOUND_DATA);
            }

            // Trả về byte array dưới dạng file download
            // MIME type là "application/octet-stream"
            // MIME type này giúp trình duyệt hiểu rằng đây là một luồng dữ liệu nhị phân
            return File(res, "application/octet-stream", "ExportedData.xlsx");
        }

        /// <summary>
        /// Xử lý HTTP POST để thêm mới nhân viên
        /// </summary>
        /// <param name="employee">Đối tượng chứa thông tin nhân viên cần thêm mới (EmployeeDTO)</param>
        /// <returns>
        /// IActionResult với mã trạng thái HTTP 201 và số nhân viên được thêm mới
        /// </returns>
        [HttpPost]
        public IActionResult Insert(EmployeeDTO employee)
        {
            var res = _employeeService.InsertByDTO(employee);
            return StatusCode(201, res);
        }

        /// <summary>
        /// Xử lý yêu cầu HTTP PUT để cập nhật thông tin nhân viên
        /// </summary>
        /// <param name="employeeCode">Mã nhân viên để xác định đối tượng cần cập nhật</param>
        /// <param name="employee">Đối tượng chứa thông tin nhân viên cần sửa đổi (EmployeeDTO)</param>
        /// <returns>
        /// IActionResult với mã trạng thái HTTP 200 và số lượng bản ghi được cập nhật
        /// </returns>
        [HttpPut("{employeeCode}")]
        public IActionResult Update([FromRoute] string employeeCode, [FromBody]EmployeeDTO employee)
        {
            var res = _employeeService.UpdateByDTO(employee, "EmployeeCode", employeeCode);
            return StatusCode(200, res);
        }

        /// <summary>
        /// Xử lý yêu cầu HTTP DELETE để xóa thông tin nhân viên
        /// </summary>
        /// <param name="code">Mã nhân viên để xóa thông tin</param>
        /// <returns>IActionResult với mã trạng thái HTTP 200 và số lượng bản ghi bị xóa</returns>
        [HttpDelete("{code}")]
        public IActionResult Delete(string code)
        {
            var res = _employeeService.DeleteByCode(code);
            return StatusCode(200, res);
        }

        /// <summary>
        /// Xử lý HTTP POST để nhập khẩu nhân viên
        /// </summary>
        /// <returns>
        /// IActionResult với mã trạng thái HTTP 200 và true nếu nhập khẩu thành công ngược lại trả về false nếu nhập khẩu thất bại
        /// </returns>
        [HttpPost("import")]
        public IActionResult Import([FromQuery(Name ="key-code")]string keyCode)
        {
            var res = _employeeService.ImportService(keyCode);
            return StatusCode(200, res);
        }

        /// <summary>
        /// Xử lý HTTP GET để lọc danh sách nhân viên theo các tiêu chí
        /// </summary>
        /// <param name="filterBy">Tên cột muốn lọc</param>
        /// <param name="filterCondition">Điều kiện lọc</param>
        /// <param name="value">Giá trị cần lọc theo điều kiện</param>
        /// <param name="branch">Tên chi nhánh cần lọc nhân viên</param>
        /// <param name="limit">Số lượng bản ghi của một trang</param>
        /// <param name="offset">Vị trí bắt đầu lấy dữ liệu</param>
        /// <param name="isDesc">Xác định thứ tự sắp xếp giảm dần nếu isDesc = true</param>
        /// <returns>
        /// IAcitonResult với mã trạng thái HTTP 200 và danh sách nhân viên phù hợp với các tiêu chí chỉ định
        /// </returns>
        [HttpGet("filter")]
        public IActionResult Get(
            [FromQuery(Name ="filter-by")]string filterBy, 
            [FromQuery(Name ="filter-condition")]string filterCondition, 
            [FromQuery(Name ="value")]string value,
            [FromQuery(Name ="limit")]int limit,
            [FromQuery(Name ="offset")]int offset,
            [FromQuery(Name ="is-desc")] bool isDesc,
            [FromQuery(Name ="branch")] string branch
            )
        {
            var res = _employeeRepository.FilterEmployeeResponse(filterBy, filterCondition, branch, value, limit, offset, isDesc);
            return StatusCode(200, res);
        }
    }
}
