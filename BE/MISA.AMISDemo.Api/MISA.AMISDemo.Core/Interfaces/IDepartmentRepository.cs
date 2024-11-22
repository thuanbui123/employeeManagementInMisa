using MISA.AMISDemo.Core.Entities;

namespace MISA.AMISDemo.Core.Interfaces
{
    public interface IDepartmentRepository : IBaseRepository<Department>
    {
        /// <summary>
        /// Lấy tất cả mã phòng ban trong cơ sở dữ liệu
        /// </summary>
        /// <returns>
        /// IEnumerable chứa danh danh sách mã phòng ban
        /// </returns>
        IEnumerable<string> GetListCode();

        /// <summary>
        /// Lấy ra mã phòng ban có giá trị lớn nhất
        /// </summary>
        /// <returns>Trả về mã có giá trị lớn nhất dưới dạng chuỗi</returns>
        string GetMaxCode();

        /// <summary>
        /// Lấy phòng ban theo mã
        /// </summary>
        /// <param name="code">Mã phòng ban cần lấy</param>
        /// <returns>
        /// Phòng ban có mã code tương ứng
        /// </returns>
        Department GetByCode(string code);

        /// <summary>
        /// Kiểm tra một đối tượng có tồn tại hay không dựa trên mã code
        /// </summary>
        /// <param name="code">Mã phòng ban cần kiểm tra</param>
        /// <returns>
        /// true - là đã có
        /// false - không tồn tại
        /// </returns>
        bool ExistsByCode(string code);

        /// <summary>
        /// Cập nhật thông tin phòng ban vào cơ sở dữ liệu
        /// </summary>
        /// <param name="department">Đối tượng chứa thông tin cần kiểm tra</param>
        /// <param name="primaryKey">Khóa chính của phòng ban cần cập nhật</param>
        /// <param name="primaryValue">Giá trị của khóa chính để xác định đối tượng cần cập nhật</param>
        /// <returns>
        /// Số lượng bản ghi được cập nhật trong cơ sở dữ liệu
        /// </returns>
        int UpdateByEntity(Department department, string primaryKey, string primaryValue);

        /// <summary>
        /// Xóa thông tin phòng ban dựa trên mã phòng ban
        /// </summary>
        /// <param name="code">Mã phòng ban của đối tượng cần xóa</param>
        /// <returns>
        /// Số lượng bản ghi bị xóa trong cơ sở dữ liệu
        /// </returns>
        int DeleteByCode (string code);

        /// <summary>
        /// Tìm kiếm phòng ban theo cột giá trị cụ thể
        /// </summary>
        /// <param name="column">Tên cột cần tìm kiếm</param>
        /// <param name="key">Giá trị tìm kiếm</param>
        /// <returns>
        /// Danh sách phòng ban phù hợp với tiêu chí tìm kiếm
        /// </returns>
        IEnumerable<Department> Search(string column, string key);
    }
}
