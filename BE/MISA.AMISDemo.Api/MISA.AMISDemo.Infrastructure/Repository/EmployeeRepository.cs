using Dapper;
using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Interfaces;
using MISA.AMISDemo.Infrastructure.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Infrastructure.Repository
{
    public class EmployeeRepository : MISADbContext<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(IMISADbContext context):base(context)
        {
            
        }
        public bool CheckDuplicateCode(string code)
        {
            var sqlCheck = "SELECT EmployeeCode FROM Employee e WHERE e.EmployeeCode = @Code";
            var parameters = new DynamicParameters();
            parameters.Add("@Code", code);
            var res = _dbContext.Connection.QueryFirstOrDefault<string>(sqlCheck, param: parameters);
            return res != null;
        }
    }
}
