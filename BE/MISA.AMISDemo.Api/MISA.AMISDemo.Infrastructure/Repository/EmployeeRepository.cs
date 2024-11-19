using Dapper;
using MISA.AMISDemo.Core.DTOs;
using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Interfaces;
using MISA.AMISDemo.Infrastructure.Interface;
using System.Data;
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

        public bool CheckDuplicateCode(string code, List<string>codes)
        {
            if (codes == null)
            {
                return false;
            }
            codes.Sort();
            int index = codes.BinarySearch(code);
            return index >= 0;
        }

        public EmployeeListResponseDTO<EmployeeResponseDTO>? FilterByBranch(string branch, int limit, int offset)
        {
            var sql = $"SELECT e.EmployeeCode, e.FullName, e.DateOfBirth, e.Gender, e.Email, e.Address, e.PhoneNumber, " +
                $"e.Landline, e.IdentityNumber, e.IdentityPlace, e.IdentityDate, e.Salary, " +
                $"e.BankAccount, e.BankName, e.Branch, d.name as Department, p.name as Position " +
                $"FROM Employee e " +
                $"LEFT JOIN department d ON e.departmentCode = d.departmentcode " +
                $"LEFT JOIN  position p on e.positionCode = p.positioncode " +
                "WHERE e.Branch = @Branch " +
                "ORDER BY CAST(SUBSTRING(EmployeeCode, 4, LENGTH(EmployeeCode)) AS UNSIGNED) LIMIT @Limit OFFSET @Offset";
            var parameters = new DynamicParameters();
            parameters.Add("@Branch", branch);
            parameters.Add("@Limit", limit);
            parameters.Add("@Offset", offset);
            var res = _dbContext.Connection.Query<EmployeeResponseDTO>(sql, param: parameters);
            EmployeeListResponseDTO<EmployeeResponseDTO> filter = new EmployeeListResponseDTO<EmployeeResponseDTO>();
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

        public EmployeeListResponseDTO<EmployeeResponseDTO> Paginate(string? branch, int limit, int offset, bool isDesc)
        {
            var sql = "";
            var sqlSumrows = "";
            bool isBranchEmptyOrFindAll = branch == null || string.IsNullOrWhiteSpace(branch) || branch == "find-all";
            if (isBranchEmptyOrFindAll && !isDesc)
            {
                sql = $"SELECT e.EmployeeCode, e.FullName, e.DateOfBirth, e.Gender, e.Email, e.Address, e.PhoneNumber, " +
                    $"e.Landline, e.IdentityNumber, e.IdentityPlace, e.IdentityDate, e.Salary, " +
                    $"e.BankAccount, e.BankName, e.Branch, d.name as Department, p.name as Position " +
                    $"FROM Employee e " +
                    $"LEFT JOIN department d ON e.departmentCode = d.departmentcode " +
                    $"LEFT JOIN  position p on e.positionCode = p.positioncode " +
                    $"ORDER BY Cast(SUBSTRING(EmployeeCode, 4, LENGTH(EmployeeCode)) AS UNSIGNED) LIMIT @Limit OFFSET @Offset;";
                sqlSumrows = $"Select count(*) from employee";
            }
            else if (isBranchEmptyOrFindAll && isDesc) 
            {
                sql = $"SELECT e.EmployeeCode, e.FullName, e.DateOfBirth, e.Gender, e.Email, e.Address, e.PhoneNumber, " +
                    $"e.Landline, e.IdentityNumber, e.IdentityPlace, e.IdentityDate, e.Salary, " +
                    $"e.BankAccount, e.BankName, e.Branch, d.name as Department, p.name as Position " +
                    $"FROM Employee e " +
                    $"LEFT JOIN department d ON e.departmentCode = d.departmentcode " +
                    $"LEFT JOIN  position p on e.positionCode = p.positioncode " +
                    $"ORDER BY Cast(SUBSTRING(EmployeeCode, 4, LENGTH(EmployeeCode)) AS UNSIGNED) DESC LIMIT @Limit OFFSET @Offset;";
                sqlSumrows = $"Select count(*) from employee";
            }
            else if (!isBranchEmptyOrFindAll && !isDesc)
            {
                sql = sql = $"SELECT e.EmployeeCode, e.FullName, e.DateOfBirth, e.Gender, e.Email, e.Address, e.PhoneNumber, " +
                    $"e.Landline, e.IdentityNumber, e.IdentityPlace, e.IdentityDate, e.Salary, " +
                    $"e.BankAccount, e.BankName, e.Branch, d.name as Department, p.name as Position " +
                    $"FROM Employee e " +
                    $"LEFT JOIN department d ON e.departmentCode = d.departmentcode " +
                    $"LEFT JOIN  position p on e.positionCode = p.positioncode " +
                    $"where branch = @Branch " +
                    $"ORDER BY Cast(SUBSTRING(EmployeeCode, 4, LENGTH(EmployeeCode)) AS UNSIGNED) LIMIT @Limit OFFSET @Offset;";
                sqlSumrows = $"Select count(*) from employee where branch = @Branch";
            } else
            {
                sql = sql = $"SELECT e.EmployeeCode, e.FullName, e.DateOfBirth, e.Gender, e.Email, e.Address, e.PhoneNumber, " +
                    $"e.Landline, e.IdentityNumber, e.IdentityPlace, e.IdentityDate, e.Salary, " +
                    $"e.BankAccount, e.BankName, e.Branch, d.name as Department, p.name as Position " +
                    $"FROM Employee e " +
                    $"LEFT JOIN department d ON e.departmentCode = d.departmentcode " +
                    $"LEFT JOIN  position p on e.positionCode = p.positioncode " +
                    $"where branch = @Branch " +
                    $"ORDER BY Cast(SUBSTRING(EmployeeCode, 4, LENGTH(EmployeeCode)) AS UNSIGNED) DESC LIMIT @Limit OFFSET @Offset;";
                sqlSumrows = $"Select count(*) from employee where branch = @Branch";
            }
            var parameters = new DynamicParameters();
            parameters.Add("@Limit", limit);
            parameters.Add("@Offset", offset);
            if (branch != null && !string.IsNullOrWhiteSpace(branch) && branch != "find-all")
            {
                parameters.Add("@Branch", branch);
            }
            var res = _dbContext.Connection.Query<EmployeeResponseDTO>(sql, parameters);
            EmployeeListResponseDTO<EmployeeResponseDTO> responseDTO = new EmployeeListResponseDTO<EmployeeResponseDTO>();
            responseDTO.Employees = res;
            int sumRows = _dbContext.Connection.QueryFirstOrDefault<int> (sqlSumrows, param: parameters);
            responseDTO.SumRows = sumRows;
            return responseDTO;
        }

        public EmployeeListResponseDTO<EmployeeResponseDTO> Search(string column, string value, string branchValue, int limit, int offset)
        {
            var sql = $"SELECT e.EmployeeCode, e.FullName, e.DateOfBirth, e.Gender, e.Email, e.Address, e.PhoneNumber, " +
                $"e.Landline, e.IdentityNumber, e.IdentityPlace, e.IdentityDate, e.Salary, " +
                $"e.BankAccount, e.BankName, e.Branch, d.name as Department, p.name as Position " +
                $"FROM Employee e " +
                $"LEFT JOIN department d ON e.departmentCode = d.departmentcode " +
                $"LEFT JOIN  position p on e.positionCode = p.positioncode " + 
                $"WHERE {column} LIKE @value AND branch = @branchValue " +
                $"ORDER BY CAST(SUBSTRING(EmployeeCode, 4, LENGTH(EmployeeCode)) AS UNSIGNED) LIMIT @Limit OFFSET @Offset;";
            var sqlSumrows = $"Select count(*) from employee where branch = @branchValue";
            if (branchValue == "find-all")
            {
                sql = $"SELECT e.EmployeeCode, e.FullName, e.DateOfBirth, e.Gender, e.Email, e.Address, e.PhoneNumber, " +
                    $"e.Landline, e.IdentityNumber, e.IdentityPlace, e.IdentityDate, e.Salary, " +
                    $"e.BankAccount, e.BankName, e.Branch, d.name as Department, p.name as Position " +
                    $"FROM Employee e " +
                    $"LEFT JOIN department d ON e.departmentCode = d.departmentcode " +
                    $"LEFT JOIN  position p on e.positionCode = p.positioncode " +
                    $"WHERE {column} LIKE @value " +
                    $"ORDER BY CAST(SUBSTRING(EmployeeCode, 4, LENGTH(EmployeeCode)) AS UNSIGNED) LIMIT @Limit OFFSET @Offset;";
                sqlSumrows = $"Select count(*) from employee";
            }
            var parameters = new DynamicParameters();
            parameters.Add("@value", $"%{value}%");
            parameters.Add("@branchValue", branchValue);
            parameters.Add("@Limit", limit);
            parameters.Add("@Offset", offset);

            var data = _dbContext.Connection.Query<EmployeeResponseDTO>(sql, parameters);
            int sumRows = _dbContext.Connection.QueryFirstOrDefault<int>(sqlSumrows, param: parameters);
            EmployeeListResponseDTO<EmployeeResponseDTO> responseDTO = new EmployeeListResponseDTO<EmployeeResponseDTO>();
            responseDTO.Employees = data;
            responseDTO.SumRows = sumRows;
            return responseDTO;
        }

        public IEnumerable<Employee> GetEmployeeByBranch(string branch)
        {
            var sql = $"SELECT * FROM Employee WHERE branch = @branchValue ORDER BY CAST(SUBSTRING(EmployeeCode, 4, LENGTH(EmployeeCode)) AS UNSIGNED)";
            if (branch == "find-all")
            {
                sql = $"SELECT * FROM Employee ORDER BY CAST(SUBSTRING(EmployeeCode, 4, LENGTH(EmployeeCode)) AS UNSIGNED)";
            }
            var parameters = new DynamicParameters();
            parameters.Add("@branchValue", branch);
            var data = _dbContext.Connection.Query<Employee>(sql, parameters);
            return data;
        }

        public IEnumerable<EmployeeResponseDTO> GetEmployeeResponseByBranch(string branch)
        {
            var sql = $"SELECT e.EmployeeCode, e.FullName, e.DateOfBirth, e.Gender, e.Email, e.Address, e.PhoneNumber, " +
                $"e.Landline, e.IdentityNumber, e.IdentityPlace, e.IdentityDate, e.Salary, " +
                $"e.BankAccount, e.BankName, e.Branch, d.name as Department, p.name as Position " +
                $"FROM Employee e " +
                $"LEFT JOIN department d ON e.departmentCode = d.departmentcode " +
                $"LEFT JOIN  position p on e.positionCode = p.positioncode " +
                $"where e.branch = @Branch " +
                $"ORDER BY CAST(SUBSTRING(EmployeeCode, 4, LENGTH(EmployeeCode)) AS UNSIGNED)";
            if (branch == "find-all")
            {
                sql = $"SELECT e.EmployeeCode, e.FullName, e.DateOfBirth, e.Gender, e.Email, e.Address, e.PhoneNumber, " +
                $"e.Landline, e.IdentityNumber, e.IdentityPlace, e.IdentityDate, e.Salary, " +
                $"e.BankAccount, e.BankName, e.Branch, d.name as Department, p.name as Position " +
                $"FROM Employee e " +
                $"LEFT JOIN department d ON e.departmentCode = d.departmentcode " +
                $"LEFT JOIN  position p on e.positionCode = p.positioncode " +
                $"ORDER BY CAST(SUBSTRING(EmployeeCode, 4, LENGTH(EmployeeCode)) AS UNSIGNED)";
            }
            var parameters = new DynamicParameters();
            parameters.Add("@Branch", branch);
            var data = _dbContext.Connection.Query<EmployeeResponseDTO>(sql, parameters);
            return data;
        }

        public List<string> GetListCode ()
        {
            var sql = "SELECT EmployeeCode FROM Employee";
            var data = _dbContext.Connection.Query<string>(sql);
            return data.ToList();
        }

        public IEnumerable<EmployeeStatisticsByAgeDTO> GetEmployeeStatisticsByAge()
        {
            var sql = "select * from employee_statistics_by_age_view;";
            var data = _dbContext.Connection.Query<EmployeeStatisticsByAgeDTO>(sql);
            return data;
        }

        public EmployeeListResponseDTO<EmployeeResponseDTO>? FilterEmployeeResponse
            (string filterBy, string filterCondition, string branch, string value, int limit, int offset, bool isDesc)
        {
            var parameters = new DynamicParameters();
            var filterColumn = "";
            var sort = isDesc ? "DESC" : "";
            if (filterBy == "department")
            {
                filterColumn = "d.name";
            }
            else if (filterBy == "position")
            {
                filterColumn = "p.name";
            }
            else
            {
                return null;
            }

            if (filterCondition == "contain")
            {
                parameters.Add("@FilterByValue", $"%{value}%");
            }
            else if (filterCondition == "start-with")
            {
                parameters.Add("@FilterByValue", $"{value}%");
            }
            else if (filterCondition == "end-with")
            {
                parameters.Add("@FilterByValue", $"%{value}");
            }
            else
            {
                return null;
            }

            var sql = $"SELECT e.EmployeeCode, e.FullName, e.DateOfBirth, e.Gender, e.Email, e.Address, e.PhoneNumber, " +
                $"e.Landline, e.IdentityNumber, e.IdentityPlace, e.IdentityDate, e.Salary, " +
                $"e.BankAccount, e.BankName, e.Branch, d.name as Department, p.name as Position " +
                $"FROM Employee e " +
                $"LEFT JOIN department d ON e.departmentCode = d.departmentcode " +
                $"LEFT JOIN  position p on e.positionCode = p.positioncode " +
                $"where {filterColumn} like @FilterByValue and branch = @Branch " +
                $"ORDER BY CAST(SUBSTRING(EmployeeCode, 4, LENGTH(EmployeeCode)) AS UNSIGNED) {sort} " +
                $"LIMIT @Limit OFFSET @Offset";
            var sqlSumrows = $"Select count(*) from employee e " +
                $"LEFT JOIN department d ON e.departmentCode = d.departmentcode " +
                $"LEFT JOIN  position p on e.positionCode = p.positioncode " +
                $" where {filterColumn} like @FilterByValue and branch = @Branch";
            parameters.Add("@Limit", limit);
            parameters.Add("@Offset", offset);
            parameters.Add("@Branch", $"{branch}");
            var res = _dbContext.Connection.Query < EmployeeResponseDTO>(sql, parameters);
            EmployeeListResponseDTO<EmployeeResponseDTO> responseDTO = new EmployeeListResponseDTO<EmployeeResponseDTO>();
            responseDTO.Employees = res;
            int sumRows = _dbContext.Connection.QueryFirstOrDefault<int>(sqlSumrows, param: parameters);
            responseDTO.SumRows = sumRows;
            return responseDTO;
        }

        public EmployeeResponseDTO? GetOne(string code)
        {
            var sql = $"SELECT e.EmployeeCode, e.FullName, e.DateOfBirth, e.Gender, e.Email, e.Address, e.PhoneNumber, " +
                $"e.Landline, e.IdentityNumber, e.IdentityPlace, e.IdentityDate, e.Salary, " +
                $"e.BankAccount, e.BankName, e.Branch, d.name as Department, p.name as Position " +
                $"FROM Employee e " +
                $"LEFT JOIN department d ON e.departmentCode = d.departmentcode " +
                $"LEFT JOIN  position p on e.positionCode = p.positioncode " +
                $"where e.employeeCode = @Code ";
            var parameters = new DynamicParameters();
            parameters.Add("@Code", $"{code}");
            var res = _dbContext.Connection.QueryFirstOrDefault<EmployeeResponseDTO>(sql, parameters);
            return res;
        }
    }
}
