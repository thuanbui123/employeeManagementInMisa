using Dapper;
using MISA.AMISDemo.Core.Entities;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
//Thư viện cho phép truy cập các thông tin về các thuộc tính và phương thức của các class trong runtime
using System.Reflection;
//Thư viện hỗ trợ việc xây dựng chuỗi (string) hiệu quả hơn với StringBuilder
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Infrastructure.Repository
{
    public class MISADbContext<T> where T : class
    {
        string ConnectString = "Host = localhost; " +
                "Port = 3306; " +
                "Database=MISA_CUkCuk_Demo; " +
                "User Id = root; " +
                "Password = Thuan0101#";
        protected IDbConnection connection;
        public MISADbContext()
        {
            connection = new MySqlConnection(ConnectString);
        }

        public List<T> Get()
        {
            var className = typeof(T).Name;
            var sql = $"select * from {className}";
            var data = connection.Query<T>(sql).ToList();
            return data;
        }

        public List<T> Get(string column, string value)
        {
            var className = typeof(T).Name;
            var sql = $"select * from {className} where {column} like @value";
            var parametes = new DynamicParameters();
            parametes.Add("@value", $"%{value}%");
            var data = connection.Query<T>(sql, param:parametes).ToList();
            return data;
        }

        public string GetMaxCode()
        {
            var className = typeof(T).Name;
            var sql = $"SELECT EmployeeCode FROM Employee ORDER BY EmployeeCode DESC LIMIT 1";
            var data = connection.QueryFirst(sql);
            return data.EmployeeCode as string;
        }

        public static string GenerateInsertSql<U>(T? obj, out DynamicParameters? parameters, U? dto) where U : class
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

        public int Insert<U> (T? entity, U? dto) where U : class
        {
            string sqlQuery = GenerateInsertSql(entity, out DynamicParameters? parameters, dto);
            if (!string.IsNullOrEmpty(sqlQuery))
            {
                try
                {
                    return connection.Execute(sqlQuery, parameters);
                } catch (Exception ex)
                {
                    Console.WriteLine("Error inserting data: " + ex.Message);
                    return 0;
                }
            }
            return 0;
        }
    }
}
