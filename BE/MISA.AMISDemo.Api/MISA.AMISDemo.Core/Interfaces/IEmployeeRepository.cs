using MISA.AMISDemo.Core.DTOs;
using MISA.AMISDemo.Core.Entities;

namespace MISA.AMISDemo.Core.Interfaces
{
    public interface IEmployeeRepository:IBaseRepository<Employee>
    {

        /// <summary>
        /// Hàm kiểm tra mã trùng
        /// </summary>
        /// <param name="code">Mã cần kiểm tra</param>
        /// <returns>true - là đã trùng; false - mã chưa có trong hệ thống</returns>
        /// Created by: BVThuan(16/10/2024)
        bool CheckDuplicateCode(string code);

        /// <summary>
        /// Hàm kiểm tra xem mã nhân viên đã tồn tại trong hệ thống hay chưa
        /// </summary>
        /// <param name="code">Mã nhân viên cần kiểm tra</param>
        /// <param name="codes">Danh sách mã nhân viên đã tồn tại trong hệ thống</param>
        /// <returns>
        ///     true - mã nhân viên đã tồn tại trong hệ thống
        ///     false - mã nhân viên chưa có trong hệ thống
        /// </returns>
        bool CheckDuplicateCode(string code, List<string> codes);

        /// <summary>
        /// Lọc nhân viên theo chi nhánh
        /// </summary>
        /// <param name="branch">chi nhánh cần lọc</param>
        /// <param name="limit">Số bản ghi cần lấy</param>
        /// <param name="offset">Lấy từ vị trí offset</param>
        /// <returns>Trả về tổng nhân viên của chi nhánh đó và số bản ghi nhân viên từ vị trí offset</returns>
        /// Created by: BVThuan (24/10/2024)
        EmployeeListResponseDTO<EmployeeResponseDTO>? FilterByBranch(string branch, int limit, int offset);

        /// <summary>
        /// Hàm kiểm tra đối tượng có tồn tại trong hệ thống hay không
        /// </summary>
        /// <typeparam name="T">Dối tượng cần kiểm tra</typeparam>
        /// <param name="code">Mã của đối tượng cần kiểm tra</param>
        /// <returns>true là đã có; false là chưa có</returns>
        /// Created by: BVThuan(18/10/2024)
        bool ExistsByCode(string code);
        
        /// <summary>
        /// Lấy mã code có giá trị lớn nhất
        /// </summary>
        /// <returns>
        /// Trả về mã có giá trị lớn nhất dưới dạng chuỗi
        /// </returns>
        string GetMaxCode();
        
        /// <summary>
        /// Phân trang danh sách nhân viên theo chi nhánh, số lượng bản ghi, vị trí offset và thứ tự sắp xếp
        /// </summary>
        /// <param name="branch">Tên chi nhánh muốn lọc</param>
        /// <param name="limit">Số lượng bản ghi mỗi trang</param>
        /// <param name="offset">Vị trí bắt đầu lấy dữ liệu</param>
        /// <param name="isDesc">Xác định thứ tự sắp xếp giảm dần nếu là true</param>
        /// <returns>
        /// Danh sách nhân viên được phân trang dưới dạng EmployeeListResponseDTO
        /// </returns>
        EmployeeListResponseDTO<EmployeeResponseDTO> Paginate(string? branch, int limit, int offset, bool isDesc);

        /// <summary>
        /// Chèn thông tin nhân viên vào cơ sở dữ liệu
        /// </summary>
        /// <param name="dto">Đối tượng dto chứa thông tin nhân viên cần chèn</param>
        /// <returns>Số lượng bản ghi được chèn</returns>
        int InsertByDTO(EmployeeDTO dto);

        /// <summary>
        /// Cập nhật thông tin nhân viên vào cơ sở dữ liệu dựa trên dto và khóa chính
        /// </summary>
        /// <param name="dto">Đối tượng dto chứa thông tin nhân viên cần cập nhật</param>
        /// <param name="primaryKey">Khóa chính của nhân viên cần cập nhật</param>
        /// <returns>
        /// Số lượng bản ghi được cập nhật
        /// </returns>
        int UpdateByDTO(EmployeeDTO dto, string primaryKey);

        /// <summary>
        /// Tìm kiếm danh sách nhân viên theo cột giá trị cụ thể, lọc theo chi nhánh và phân trang
        /// </summary>
        /// <param name="column">Tên cột cần tìm kiếm</param>
        /// <param name="value">Giá trị cần tìm kiếm trong cột</param>
        /// <param name="branchValue">Chi nhánh cần lọc</param>
        /// <param name="limit">Số lượng bản ghi mỗi trang</param>
        /// <param name="offset">Vị trí bắt đầu lấy dữ liệu</param>
        /// <returns>
        /// Danh sách nhân viên phù hợp với điều kiện tìm kiếm dưới dạng EmployeeListResponseDTO
        /// </returns>
        EmployeeListResponseDTO<EmployeeResponseDTO> Search(string column, string value, string branchValue, int limit, int offset);

        /// <summary>
        /// Lấy danh sách nhân viên theo chi nhánh
        /// </summary>
        /// <param name="branch">Chi nhánh cần lọc</param>
        /// <returns>IEnumerable chứa danh sách nhân viên theo chi nhánh</returns>
        IEnumerable<Employee> GetEmployeeByBranch(string branch);

        /// <summary>
        /// Lấy danh sách nhân viên theo chi nhánh dưới dạng EmployeeResponseDTO
        /// </summary>
        /// <param name="branch">Chi nhánh cần lọc</param>
        /// <returns>IEnumerable chứa danh sách nhân viên theo chi nhánh</returns>
        IEnumerable<EmployeeResponseDTO> GetEmployeeResponseByBranch(string branch);

        /// <summary>
        /// Lọc danh sách nhân viên dựa trên điều kiện và giá trị
        /// </summary>
        /// <param name="filterBy">Tên cột muốn lọc</param>
        /// <param name="filterCondition">Điều kiện lọc</param>
        /// <param name="value">Giá trị cần lọc theo điều kiện</param>
        /// <param name="limit">Số lượng bản ghi của một trang</param>
        /// <param name="offset">Vị trí bắt đầu lấy dữ liệu</param>
        /// <param name="isDesc">Xác định thứ tự sắp xếp giảm dần nếu là true</param>
        /// <param name="branch">Tên chi nhánh cần lọc</param>
        /// <returns>IEnumerable chứa danh sách nhân viên đáp ứng được cách điều kiện lọc dưới dạng EmployeeResponseDTO</returns>
        EmployeeListResponseDTO<EmployeeResponseDTO>? FilterEmployeeResponse(string filterBy, string filterCondition, string branch, string value, int limit, int offset, bool isDesc);

        /// <summary>
        /// Lấy danh sách mã code của nhân viên
        /// </summary>
        /// <returns>Danh sách các mã code dưới dạng list</returns>
        List<string> GetListCode ();

        /// <summary>
        /// Lấy một đối tượng dựa trên mã code
        /// </summary>
        /// <param name="code">Mã của đối tượng cần lấy</param>
        /// <returns>
        /// Trả về đối tượng hoặc null nếu không tìm thấy
        /// </returns>
        EmployeeResponseDTO? GetOne(string code);

        /// <summary>
        /// Thống kê nhân viên theo độ tuổi
        /// </summary>
        /// <returns>IEnumerable chứa thông tin thống kê danh sách nhân viên theo độ tuổi dưới dạng EmployeeStatisticsByAgeDTO</returns>
        IEnumerable<EmployeeStatisticsByAgeDTO> GetEmployeeStatisticsByAge();
    }
}
