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
        IEnumerable<Employee>? ImportService();

        EmployeeListResponseDTO? Search(string query, string branch, int limit, int offset);

        int InsertByDTO(EmployeeDTO dto);

        int UpdateByDTO(EmployeeDTO dto, string primaryKey);

        int DeleteByCode(string code);

        string GenerateNewCode ();

        bool CheckFileImport(IFormFile fileImport);
    }
}
