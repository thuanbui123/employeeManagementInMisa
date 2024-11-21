using Microsoft.AspNetCore.Http;
using MISA.AMISDemo.Core.DTOs;
using MISA.AMISDemo.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Interfaces
{
    public interface IEmployeeService:IBaseService<Employee>
    {
        /// <summary>
        /// Hàm thực hiện nhập khẩu nhân viên được lưu trong bộ nhớ cache vào cơ sở dữ liệu
        /// </summary>
        /// <param name="cacheKey">Key để lấy danh sách nhân viên được lưu trong cache</param>
        /// <returns>
        /// - true: nếu nhập khẩu danh sách nhân viên thành công
        /// - false: nhập khẩu danh sách nhân viên thất bại
        /// </returns>
        bool ImportService(string cacheKey);

        /// <summary>
        /// Tìm kiếm danh sách nhân viên dựa trên từ khóa tìm kiếm, chi nhánh và thông tin tìm kiếm
        /// </summary>
        /// <param name="query">Từ khóa tìm kiếm</param>
        /// <param name="branch">Tên chi nhánh để lọc nhân viên theo chi nhánh cụ thể</param>
        /// <param name="limit">Số lượng kết quả tối đa được trả về trong một lần tìm kiếm</param>
        /// <param name="offset">Vị trí bắt đầu lấy dữ liệu, dùng cho phân trang kết quả</param>
        /// <returns>
        /// Đối tượng EmployeeListResponseDTO chứa danh sách nhân viên phù hợp với tiêu chí tìm kiếm 
        /// Nếu không tìm thấy nhân viên nào phù hợp sẽ trả về null
        /// </returns>
        EmployeeListResponseDTO<EmployeeResponseDTO>? Search(string query, string branch, int limit, int offset);

        /// <summary>
        /// Thêm một nhân viên mới vào cơ sở dữ liệu dựa trên đối tượng EmployeeDTO
        /// </summary>
        /// <param name="dto">Đối tượng EmployeeDTO chứa thông tin nhân viên cần thêm vào cơ sở dữ liệu</param>
        /// <returns>
        /// 1 nếu thêm nhân viên mới thành công
        /// Ngược lại, trả về 0
        /// </returns>
        int InsertByDTO(EmployeeDTO dto);

        /// <summary>
        /// Cập nhật thông tin nhân viên dựa trên đối tượng EmployeeDTO
        /// </summary>
        /// <param name="dto">Đối tượng chứa thông tin nhân viên cần cập nhật</param>
        /// <param name="primaryKey">Tên cột để xác định đối tượng cần cập nhật</param>
        /// <param name="primaryValue">Giá trị để xác định đối tượng cần cập nhật</param>
        /// <returns>
        /// 1 - nếu cập nhật thành công
        /// Ngược lại, trả về 0
        /// </returns>
        int UpdateByDTO(EmployeeDTO dto, string primaryKey, string primaryValue);

        /// <summary>
        /// Xóa thông tin nhân viên dựa trên code
        /// </summary>
        /// <param name="code">Giá trị để xác định đối tượng cần xóa</param>
        /// <returns>
        /// 1- nếu xóa thông tin nhân viên thành công.
        /// Ngược lại trả về 0
        /// </returns>
        int DeleteByCode(string code);

        /// <summary>
        /// Tạo mã code mới với tiêu chí: 'NV'+ (Mã số nhân viên lớn nhất trong hệ thống + 1)
        /// </summary>
        /// <returns>
        /// Trả về mã mới không trùng với mã đã có trong hệ thống
        /// </returns>
        string GenerateNewCode ();

        /// <summary>
        /// Kiểm tra và xử lý dữ liệu từ file excel để nhập khẩu nhân viên
        /// </summary>
        /// <param name="fileImport">File excel chứa danh sách nhân viên cần kiểm tra</param>
        /// <returns>
        /// Trả về mảng byte[] chứa file nhật ký lưu lỗi
        /// Trả về null nếu dữ liệu trong file nhập khẩu đúng định dạng
        /// </returns>
        object? CheckFileImport(IFormFile fileImport);

        /// <summary>
        /// Xuất dữ liệu nhân viên dưới dạng tệp Excel cho một chi nhánh cụ thể
        /// </summary>
        /// <param name="branch">Tên chi nhánh để lọc dữ liệu nhân viên xuất ra tệp Excel</param>
        /// <returns>
        /// Mảng byte chứa dữ liệu nhân viên.
        /// Trả về null nếu không có dữ liệu hoặc lỗi
        /// </returns>
        byte[]? ExportExcelFile (string branch); 
    }
}
