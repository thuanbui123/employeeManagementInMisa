using Dapper;
using MISA.AMISDemo.Core.DTOs;
using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Exceptions;
using MISA.AMISDemo.Core.Interfaces;
using MISA.AMISDemo.Infrastructure.Interface;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Dapper.SqlMapper;

namespace MISA.AMISDemo.Infrastructure.Repository
{
    public class EmployeeRepository : MISADbContext<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(IMISADbContext context):base(context)
        {
            
        }

        public int InsertByDTO(EmployeeDTO dto)
        {

            var sqlQuery = GenerateInsertSql(dto, out DynamicParameters? parameters);
            var res = _dbContext.Connection.Execute(sqlQuery, param: parameters);
            return res;
        }

        public int UpdateByDTO(EmployeeDTO dto, string primaryKey)
        {
            var sqlQuery = GenerateUpdateSql(dto, primaryKey, out DynamicParameters? parameters);
            var res = _dbContext.Connection.Execute(sqlQuery, param: parameters);
            return res;
        }

        public bool ExistsByCode(string code)
        {
            var sql = $"SELECT * from Employee where EmployeeCode = '@Code'";
            var parametes = new DynamicParameters();
            parametes.Add("@Code", code);
            var data = _dbContext.Connection.Query(sql, param: parametes);
            return data != null;
        }

        public bool CheckDuplicateCode(string code)
        {
            var sqlCheck = "SELECT EmployeeCode FROM Employee e WHERE e.EmployeeCode = @Code";
            var parameters = new DynamicParameters();
            parameters.Add("@Code", code);
            var res = _dbContext.Connection.QueryFirstOrDefault<string>(sqlCheck, param: parameters);
            return res != null; 
        }

        public bool CheckDuplicateCode(string code, IDbTransaction transaction)
        {
            var sqlCheck = "SELECT EmployeeCode FROM Employee e WHERE e.EmployeeCode = @Code";
            var parameters = new DynamicParameters();
            parameters.Add("@Code", code);
            var res = _dbContext.Connection.QueryFirstOrDefault<string>(sqlCheck, param: parameters, transaction: transaction);
            return res != null;
        }

        public EmployeeListResponseDTO FilterByBranch(string branch, int limit, int offset)
        {
            var sql = "SELECT * FROM Employee e WHERE e.Branch = @Branch ORDER BY EmployeeCode LIMIT @Limit OFFSET @Offset";
            var parameters = new DynamicParameters();
            parameters.Add("@Branch", branch);
            parameters.Add("@Limit", limit);
            parameters.Add("@Offset", offset);
            var res = _dbContext.Connection.Query<Employee>(sql, param: parameters);
            EmployeeListResponseDTO filter = new EmployeeListResponseDTO();
            filter.Employees = res;
            filter.SumRows = res.ToList().Count();
            return filter;
        }

        public string GetMaxCode ()
        {
            var sql = "SELECT EmployeeCode FROM Employee ORDER BY CAST(SUBSTRING(EmployeeCode, 4, LENGTH(EmployeeCode)) AS UNSIGNED) DESC LIMIT 1;";
            var res = _dbContext.Connection.QueryFirstOrDefault<string> (sql);
            return res;
        }

        public EmployeeListResponseDTO Paginate(string? branch, int limit, int offset)
        {
            var sql = "";
            var sqlSumrows = "";
            if (branch == null || string.IsNullOrWhiteSpace(branch) || branch == "find-all")
            {
                sql = $"SELECT * FROM Employee ORDER BY EmployeeCode LIMIT @Limit OFFSET @Offset;";
                sqlSumrows = $"Select count(*) from employee";
            } else
            {
                sql = sql = $"SELECT * FROM Employee where branch = @Branch ORDER BY EmployeeCode LIMIT @Limit OFFSET @Offset;";
                sqlSumrows = $"Select count(*) from employee where branch = @Branch";
            }
            var parameters = new DynamicParameters();
            parameters.Add("@Limit", limit);
            parameters.Add("@Offset", offset);
            if (branch != null && !string.IsNullOrWhiteSpace(branch) && branch != "find-all")
            {
                parameters.Add("@Branch", branch);
            }
            var res = _dbContext.Connection.Query<Employee>(sql, parameters);
            EmployeeListResponseDTO responseDTO = new EmployeeListResponseDTO();
            responseDTO.Employees = res;
            int sumRows = _dbContext.Connection.QueryFirstOrDefault<int> (sqlSumrows, param: parameters);
            responseDTO.SumRows = sumRows;
            return responseDTO;
        }

        public EmployeeListResponseDTO Search(string column, string value, string branchValue, int limit, int offset)
        {
            var sql = $"SELECT * FROM Employee WHERE {column} LIKE @value AND branch = @branchValue ORDER BY EmployeeCode LIMIT @Limit OFFSET @Offset;";
            var sqlSumrows = $"Select count(*) from employee where branch = @branchValue";
            var parameters = new DynamicParameters();
            parameters.Add("@value", $"%{value}%");
            parameters.Add("@branchValue", branchValue);
            parameters.Add("@Limit", limit);
            parameters.Add("@Offset", offset);

            var data = _dbContext.Connection.Query<Employee>(sql, parameters);
            int sumRows = _dbContext.Connection.QueryFirstOrDefault<int>(sqlSumrows, param: parameters);
            EmployeeListResponseDTO responseDTO = new EmployeeListResponseDTO();
            responseDTO.Employees = data;
            responseDTO.SumRows = sumRows;
            return responseDTO;
        }
    }
}
