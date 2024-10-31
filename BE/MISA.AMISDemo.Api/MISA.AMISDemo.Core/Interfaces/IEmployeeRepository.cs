using MISA.AMISDemo.Core.DTOs;
using MISA.AMISDemo.Core.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        bool CheckDuplicateCode(string code, List<string> codes);

        /// <summary>
        /// Lọc nhân viên theo chi nhánh
        /// </summary>
        /// <param name="branch">chi nhánh cần lọc</param>
        /// <param name="limit">Số bản ghi cần lấy</param>
        /// <param name="offset">Lấy từ vị trí offset</param>
        /// <returns>Trả về tổng nhân viên của chi nhánh đó và số bản ghi nhân viên từ vị trí offset</returns>
        /// Created by: 24/10/2024
        EmployeeListResponseDTO FilterByBranch(string branch, int limit, int offset);

        /// <summary>
        /// Hàm kiểm tra đối tượng có tồn tại trong hệ thống hay không
        /// </summary>
        /// <typeparam name="T">Dối tượng cần kiểm tra</typeparam>
        /// <param name="code">Mã của đối tượng cần kiểm tra</param>
        /// <returns>true là đã có; false là chưa có</returns>
        /// Created by: BVThuan(18/10/2024)
        bool ExistsByCode(string code);
        string GetMaxCode();
        EmployeeListResponseDTO Paginate(string? branch, int limit, int offset);
        int InsertByDTO(EmployeeDTO dto);
        int UpdateByDTO(EmployeeDTO dto, string primaryKey);
        EmployeeListResponseDTO Search(string column, string value, string branchValue, int limit, int offset);
        IEnumerable<Employee> GetEmployeeByBranch(string branch);
        IEnumerable<EmployeeResponseDTO> GetEmployeeResponseByBranch(string branch);
        List<string> GetListCode ();
        IEnumerable<EmployeeStatisticsByAgeDTO> GetEmployeeStatisticsByAge();
    }
}
