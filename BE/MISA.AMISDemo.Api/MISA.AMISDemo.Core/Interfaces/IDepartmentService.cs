using MISA.AMISDemo.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Interfaces
{
    public interface IDepartmentService : IBaseService<Department>
    {
        /// <summary>
        /// Thêm mới nhân viên vào cơ sở dữ liệu
        /// </summary>
        /// <param name="department">Đối tượng chứa thông tin phòng ban cần thêm mới</param>
        /// <returns>
        /// Số bản ghi được thêm vào cơ sở dữ liệu
        /// </returns>
        int Insert(Department department);

        /// <summary>
        /// Sinh mã phòng ban mới
        /// </summary>
        /// <returns>Mã phòng ban mới chưa tồn tại trong cơ sở dữ liệu</returns>
        string GenerateCode();

        /// <summary>
        /// Cập nhật thông tin phòng ban dựa trên đối tượng Department
        /// </summary>
        /// <param name="department">Đối tượng chứa thông tin cần cập nhật</param>
        /// <param name="primaryKey">Tên cột để xác định đối tượng cần cập nhật</param>
        /// <param name="primaryValue">Giá trị để xác định đối tượng cần cập nhật</param>
        /// <returns>
        /// 1 - nếu cập nhật thành công
        /// Ngược lại, trả về 0
        /// </returns>
        int Update(Department department, string primaryKey, string primaryValue);

        /// <summary>
        /// Xóa thông tin phòng ban dựa trên mã phòng ban
        /// </summary>
        /// <param name="code">Giá trị để xác định đối tượng cần xóa</param>
        /// <returns>
        /// 1 - nếu xóa thông tin thành công
        /// Ngược lại, trả về 0;
        /// </returns>
        int Delete(string code);

        /// <summary>
        /// Tìm kiếm nhân viên danh sách nhân viên
        /// </summary>
        /// <param name="key">Giá trị cần tìm kiếm</param>
        /// <returns>
        /// Danh sách nhân viên phù hợp với tiêu chí chỉ định
        /// </returns>
        IEnumerable<Department> Search(string key);
    }
}
