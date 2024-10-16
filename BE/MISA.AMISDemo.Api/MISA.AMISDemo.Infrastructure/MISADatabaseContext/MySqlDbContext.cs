using Dapper;
using Microsoft.Extensions.Configuration;
using MISA.AMISDemo.Infrastructure.Interface;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Infrastructure.MISADatabaseContext
{
    public class MySqlDbContext : IMISADbContext
    {
        public IDbConnection Connection { get;  }

        public MySqlDbContext(IConfiguration config)
        {
            Connection = new MySqlConnection(config.GetConnectionString("Database1"));
        }

        public IEnumerable<T> Get<T>()
        {
            var _className = typeof(T).Name;
            var sql = $"select * from {_className}";
            var data = Connection.Query<T>(sql).ToList();
            return data;
        }

        public IEnumerable<T> Get<T>(string column, string value)
        {
            var className = typeof(T).Name;
            var sql = $"select * from {className} where {column} like @value";
            var parametes = new DynamicParameters();
            parametes.Add("@value", $"%{value}%");
            var data = Connection.Query<T>(sql, param: parametes).ToList();
            return data;
        }

        public bool ExistsByCode<T>(string code)
        {
            throw new NotImplementedException();
        }

        public string? GetMaxCode<T>()
        {
            var className = typeof(T).Name;
            var sql = $"SELECT EmployeeCode FROM {className} ORDER BY {className}Code DESC LIMIT 1";
            var data = Connection.QueryFirst<string>(sql);
            return data;
        }

        public static string GenerateInsertSql<T, U>(T? obj, out DynamicParameters? parameters, U? dto) where U : class
        {
            Type? type = obj != null ? typeof(T) : typeof(U);
            if (type == null)
            {
                parameters = null;
                return string.Empty;
            }

            StringBuilder columns = new StringBuilder();
            StringBuilder values = new StringBuilder();
            PropertyInfo[] properties = type.GetProperties();
            string tableName = type.Name.Replace("DTO", string.Empty);  // Lấy tên bảng là tên của class, có thể tùy chỉnh.

            parameters = new DynamicParameters();
            foreach (var prop in properties)
            {
                var value = obj != null ? prop.GetValue(obj, null) : prop.GetValue(dto, null);
                if (prop.Name == "EmployeeID" && (value == null || value.Equals(Guid.Empty)))
                {
                    value = Guid.NewGuid(); 
                }
                if (value != null)
                {
                    string paramName = "@" + prop.Name;
                    columns.Append(prop.Name + ",");
                    values.Append(paramName + ",");

                    // Thêm giá trị vào DynamicParameters
                    parameters.Add(paramName, value);
                }
            }


            if (columns.Length > 0 && values.Length > 0)
            {
                // Xóa dấu phẩy cuối cùng
                columns.Remove(columns.Length - 1, 1);
                values.Remove(values.Length - 1, 1);

                return $"INSERT INTO {tableName} ({columns}) VALUES ({values});";
            }

            return string.Empty;
        }

        public int Insert<T, K>(T? entity, K? dto) where K : class
        {
            string sqlQuery = GenerateInsertSql(entity, out DynamicParameters? parameters, dto);
            if (!string.IsNullOrEmpty(sqlQuery))
            {
                try
                {
                    return Connection.Execute(sqlQuery, parameters);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error inserting data: " + ex.Message);
                    return 0;
                }
            }
            return 0;
        }

        public int Insert<T>(T entity)
        {
            throw new NotImplementedException();
        }

        public int Delete<T>(string id)
        {
            var _className = typeof(T).Name;
            var sql = $"DELETE FROM {_className} WHERE {_className}Code = @code";
            var parameters = new DynamicParameters();
            parameters.Add("@code", id);
            var res = Connection.Execute(sql, param: parameters);
            return res;
        }

        public int DeleteAny<T>(string[] ids)
        {
            var className = typeof(T).Name;
            var res = 0;
            var sql = $"DELETE FROM {className} WHERE {className}Code IN (@Codes)";
            var parameters = new DynamicParameters();
            var idsArray = "";
            foreach (var id in ids)
            {
                idsArray += $"{id},";
            }
            idsArray = idsArray.Substring(0, idsArray.Length - 1);
            parameters.Add("@Codes", idsArray);
            res = Connection.Execute(sql, param: parameters);
            return res;
        }

        public int Update<T>(T entity)
        {
            throw new NotImplementedException();
        }
    }
}
