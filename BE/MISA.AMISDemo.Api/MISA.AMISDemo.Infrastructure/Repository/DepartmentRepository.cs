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

        public IEnumerable<string> GetListCode()
        {
            var sql = "SELECT DepartmentCode FROM Department";
            return _dbContext.Connection.Query<string>(sql);
        }

        public string GetMaxCode()
        {
            var sql = "SELECT DepartmentCode FROM Department ORDER BY CAST(SUBSTRING(DepartmentCode, 4, LENGTH(DepartmentCode)) AS UNSIGNED) DESC LIMIT 1;";
            var res = _dbContext.Connection.QueryFirstOrDefault<string>(sql);
            return res;
        }

        public Department GetByCode (string code)
        {
            var sql = "SELECT * FROM Department WHERE DepartmentCode = @DepartmentCode";
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@DepartmentCode", code);
            return _dbContext.Connection.QueryFirstOrDefault<Department>(sql, param: parameters);
        }

        public bool ExistsByCode(string code)
        {
            var sql = $"SELECT * from Department where DepartmentCode = '@Code'";
            var parametes = new DynamicParameters();
            parametes.Add("@Code", code);
            var data = _dbContext.Connection.Query(sql, param: parametes);
            return data != null;
        }

        public int UpdateByEntity(Department department, string primaryKey, string primaryValue)
        {
            var sqlQuery = GenerateUpdateSql(department, primaryKey, primaryValue, out DynamicParameters? parameters);
            var res = _dbContext.Connection.Execute(sqlQuery, param: parameters);
            return res;
        }

        public int DeleteByCode(string code)
        {
            var sql = "DELETE FROM Department where DepartmentCode = '@Code'";
            DynamicParameters? parameters = new DynamicParameters();
            parameters.Add("@Code", code);
            return _dbContext.Connection.Execute(sql, param: parameters);
        }

        public IEnumerable<Department> Search(string column, string key)
        {
            var sql = $"SELECT * FROM Department WHERE {column} like @key";

            var parameters = new DynamicParameters();
            parameters.Add("@key", $"%{key}%");

            return _dbContext.Connection.Query<Department>(sql, param: parameters);
        }
    }
}
