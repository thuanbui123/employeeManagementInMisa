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
        bool ImportService();

        EmployeeListResponseDTO? Search(string query, string branch, int limit, int offset);

        int InsertByDTO(EmployeeDTO dto);

        int UpdateByDTO(EmployeeDTO dto, string primaryKey);

        int DeleteByCode(string code);

        string GenerateNewCode ();
        /// <summary>
        /// Kiểm tra và xử lý dữ liệu từ file excel để nhập khẩu nhân viên
        /// </summary>
        /// <param name="fileImport">File excel chứa danh sách nhân viên cần kiểm tra</param>
        /// <returns>
        /// Trả về mảng byte[] chứa file nhật ký lưu lỗi
        /// Trả về null nếu dữ liệu trong file nhập khẩu đúng định dạng
        /// </returns>
        byte[]? CheckFileImport(IFormFile fileImport);

        byte[]? ExportExcelFile (string branch); 
    }
}
