using MISA.AMISDemo.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Interfaces
{
    public interface IEmployeeRepository:IBaseReposity<Employee>
    {

        /// <summary>
        /// Hàm kiểm tra mã trùng
        /// </summary>
        /// <param name="code">Mã cần kiểm tra</param>
        /// <returns>true - là đã trùng; false - mã chưa có trong hệ thống</returns>
        /// Create by: BVThuan(16/10/2024)
        bool CheckDuplicateCode(string code);
    }
}
