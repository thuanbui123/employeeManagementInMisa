using Dapper;
using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Interfaces;
using MISA.AMISDemo.Infrastructure.Interface;

namespace MISA.AMISDemo.Infrastructure.Repository
{
    public class DepartmentRepository : MISADbContext<Department>, IDepartmentRepository
    {
        public DepartmentRepository(IMISADbContext context) : base(context) 
        {
            
        }

        public string? CheckExists(string name)
        {
            var sql = "SELECT * FROM department Where name = @Name";
            var parameters = new DynamicParameters();
            parameters.Add("@Name", name);
            var res = _dbContext.Connection.QueryFirstOrDefault<Department>(sql, param: parameters);
            return res?.DepartmentCode;
        }
    }
}
