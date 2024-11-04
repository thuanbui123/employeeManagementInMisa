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

        /// <summary>
        /// API lấy tất cả các nhân viên
        /// </summary>
        /// <returns>
        ///     Danh sách nhân viên trong cơ sở dữ liệu
        /// </returns>
        [HttpGet]
        public IActionResult Get()
        {
            var data = _employeeRepository.Get();
            return StatusCode(200, data);
        }

        /// <summary>
        /// API tìm kiếm nhân viên theo mã nhân viên hoặc tên nhân viên
        /// </summary>
        /// <param name="value">Giá trị tìm kiếm</param>
        /// <param name="branch">Tìm kiếm ở chi nhánh</param>
        /// <param name="limit">Giới hạn số bản ghi nhân viên trả về</param>
        /// <param name="offset">Lấy bản ghi từ vị trí bao nhiêu</param>
        /// <returns></returns>
        [HttpGet("search")]
        public IActionResult Get([FromQuery(Name ="value")] string value, [FromQuery(Name = "branch")] string branch, [FromQuery(Name = "limit")] int limit, [FromQuery(Name = "offset")] int offset)
        {
            var data = _employeeService.Search(value, branch, limit, offset);
            return StatusCode(200, data);
        }

        /// <summary>
        /// API tạo sinh ra mã nhân viên mới không bị trùng
        /// </summary>
        /// <returns>
        ///     Trả về mã nhân viên mới
        /// </returns>
        [HttpGet("generate-code")]
        public IActionResult GenerateCode()
        {
            var res = _employeeService.GenerateNewCode();
            return StatusCode(200, res);
        }

        /// <summary>
        /// API lấy tổng số bản ghi của bảng nhân viên trong cơ sở dữ liệu
        /// </summary>
        /// <returns>
        ///     Trả về số bản ghi của bảng nhân viên trong cơ sở dữ liệu
        /// </returns>
        [HttpGet("sum-rows")]
        public IActionResult GetSumRows()
        {
            var res = _employeeRepository.GetSumRow();
            return StatusCode(200, res);
        }

        /// <summary>
        /// API dùng để lọc danh sách nhân viên theo chi nhánh
        /// API này được tạo sau khi tách bảng nhân viên ra thêm bảng chức vụ và phòng ban
        /// </summary>
        /// <param name="branch">Chi nhánh cần lọc</param>
        /// <param name="limit">Giới hạn số bản ghi nhân viên trả về</param>
        /// <param name="offset">Lấy bản ghi từ vị trí số bao nhiêu</param>
        /// <returns>Trả về danh sách nhân viên của chi nhánh</returns>
        [HttpGet("filter-by-branch")]
        public IActionResult FilterByBranch([FromQuery(Name = "branch")]string branch, [FromQuery(Name = "limit")] int limit, [FromQuery(Name ="offset")] int offset)
        {
            var res = _employeeRepository.FilterByBranch(branch, limit, offset);
            return StatusCode(200, res);
        }

        /// <summary>
        /// API dùng để lọc danh sách nhân viên theo chi nhánh
        /// API này được tạo trước khi tách bảng nhân viên ra thêm bảng chức vụ và phòng ban
        /// </summary>
        /// <param name="branch">Chi nhánh cần lọc</param>
        /// <param name="limit">Giới hạn số bản ghi nhân viên trả về</param>
        /// <param name="offset">Lấy bản ghi từ vị trí số bao nhiêu</param>
        /// <returns>Trả về danh sách nhân viên của chi nhánh</returns>
        [HttpGet("paginate")]
        public IActionResult Paginate([FromQuery(Name = "branch")] string? branch, [FromQuery(Name ="limit")]int limit, [FromQuery(Name = "offset")]int offset)
        {
            var res = _employeeRepository.Paginate(branch, limit, offset);
            return StatusCode(200, res);
        }

        /// <summary>
        /// API thống kê số lượng nhân viên theo độ tuổi
        /// </summary>
        /// <returns>
        /// Trả về một danh sách thống kê nhân viên theo độ tuổi
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
        /// API kiểm tra file excel trước khi nhập khẩu nhân viên với điều kiện
        /// - dữ liệu trong file excel là đúng định dạng
        /// </summary>
        /// <param name="file">File excel chứa danh sách nhân viên cần kiểm tra</param>
        /// <returns>
        /// Mảng byte[] nếu có dòng dữ liệu bị lỗi
        /// Null khi dữ liệu trong file nhập khẩu hợp lệ
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
                return StatusCode(201, errorLogFile);
            }
        }

        /// <summary>
        /// API để xuất file excel danh sách nhân viên của một chi nhánh
        /// </summary>
        /// <param name="branch">Tên chi nhánh muốn xuất danh sách nhân viên</param>
        /// <returns>Trả về file Excel dưới dạng byte array để tải xuống</returns>
        [HttpGet("export-excel")]
        public IActionResult ExportExcel([FromQuery(Name = "branch")]string branch)
        {
            var res = _employeeService.ExportExcelFile(branch);

            if (res == null)
            {
                return NotFound("Không tìm thấy dữ liệu để xuất.");
            }

            // Trả về byte array dưới dạng file download
            // MIME type là "application/octet-stream"
            //  MIME type này giúp trình duyệt hiểu rằng đây là một luồng dữ liệu nhị phân
            return File(res, "application/octet-stream", "ExportedData.xlsx");
        }

        /// <summary>
        /// API thêm mới thông tin nhân viên
        /// </summary>
        /// <param name="employee">Đối tượng chứa thông tin nhân viên cần thêm mới (EmployeeDTO)</param>
        /// <returns>Trả về mã trạng thái 201 và số lượng bản ghi được thêm vào </returns>
        [HttpPost]
        public IActionResult Insert(EmployeeDTO employee)
        {
            var res = _employeeService.InsertByDTO(employee);
            return StatusCode(201, res);
        }

        /// <summary>
        /// API sửa thông tin nhân viên
        /// </summary>
        /// <param name="employee">Đối tượng chứa thông tin nhân viên cần sửa đổi (EmployeeDTO)</param>
        /// <returns>Trả về mã trạng thái 200 và số lượng bản ghi được cập nhật</returns>
        [HttpPut]
        public IActionResult Update(EmployeeDTO employee)
        {
            var res = _employeeService.UpdateByDTO(employee, "EmployeeCode");
            return StatusCode(200, res);
        }

        /// <summary>
        /// API xóa thông tin nhân viên
        /// </summary>
        /// <param name="code">Mã nhân viên để xóa thông tin</param>
        /// <returns>Trả về mã trạng thái 200 và số lượng bản ghi bị xóa</returns>
        [HttpDelete("{code}")]
        public IActionResult Delete(string code)
        {
            var res = _employeeService.DeleteByCode(code);
            return StatusCode(200, res);
        }

        /// <summary>
        /// API để nhập khẩu danh sách nhân viên
        /// Danh sách nhân viên được lưu trong bộ nhớ cache
        /// </summary>
        /// <returns>Trả về mã trạng thái 200 và
        /// true - nhập khẩu thành công
        /// false - nhập khẩu thất bại
        /// </returns>
        [HttpPost("import")]
        public IActionResult Import([FromQuery(Name ="key-code")]string keyCode)
        {
            var res = _employeeService.ImportService(keyCode);
            return StatusCode(200, res);
        }
    }
}
