using Dapper;
using Microsoft.Extensions.Configuration;
using MISA.AMISDemo.Infrastructure.Interface;
using MySqlConnector;
using System.Data;
using System.Reflection;
using System.Text;

namespace MISA.AMISDemo.Infrastructure.MISADatabaseContext
{
    public class MySqlDbContext : IMISADbContext
    {
        public IDbConnection Connection { get;  }
        public IDbTransaction Transaction { get; set; }

        public MySqlDbContext(IConfiguration config)
        {
            Connection = new MySqlConnection(config.GetConnectionString("Database1"));
        }

        public IEnumerable<T> Get<T>()
        {
            var _className = typeof(T).Name;
            var sql = $"select * from {_className} order by {_className}Code";
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

        public int? GetSumRow<T>()
        {
            var className = typeof(T).Name;
            var sql = $"SELECT Count(EmployeeCode) FROM {className}";
            var data = Connection.QueryFirstOrDefault<int>(sql);
            return data;
        }

        public string GenerateInsertSql<T>(T obj, out DynamicParameters? parameters) 
        {
            Type type = typeof(T);
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
                var value = prop.GetValue(obj, null);
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

        public string GenerateUpdateSql<T>(T obj, string primaryKeyColumn, out DynamicParameters? parameters)
        {
            Type type = typeof(T);
            if (type == null)
            {
                parameters = null;
                return string.Empty;
            }

            StringBuilder setClause = new StringBuilder();
            PropertyInfo[] properties = type.GetProperties();
            string tableName = type.Name.Replace("DTO", string.Empty);  // Lấy tên bảng là tên của class, có thể tùy chỉnh.

            parameters = new DynamicParameters();
            object? primaryKeyValue = null;

            foreach (var prop in properties)
            {
                var value = prop.GetValue(obj, null);
                if (value != null)
                {
                    string paramName = "@" + prop.Name;

                    // Nếu là khóa chính thì bỏ qua, không cập nhật.
                    if (prop.Name.Equals(primaryKeyColumn, StringComparison.OrdinalIgnoreCase))
                    {
                        primaryKeyValue = value;
                        continue;
                    }

                    // Tạo câu lệnh SET cho từng cột
                    setClause.Append($"{prop.Name} = {paramName},");

                    // Thêm giá trị vào DynamicParameters
                    parameters.Add(paramName, value);
                }
            }

            // Đảm bảo khóa chính không null
            if (primaryKeyValue == null)
            {
                return string.Empty;
            }

            // Xóa dấu phẩy cuối cùng trong câu lệnh SET
            if (setClause.Length > 0)
            {
                setClause.Remove(setClause.Length - 1, 1);
            }

            // Thêm khóa chính vào tham số
            parameters.Add($"@{primaryKeyColumn}", primaryKeyValue);

            // Tạo câu lệnh UPDATE
            return $"UPDATE {tableName} SET {setClause} WHERE {primaryKeyColumn} = @{primaryKeyColumn};";
        }


        public int Insert<T>(T entity) 
        {
            string sqlQuery = GenerateInsertSql(entity, out DynamicParameters? parameters);
            if (!string.IsNullOrEmpty(sqlQuery))
            {
                return Connection.Execute(sqlQuery, param: parameters, transaction: Transaction);
            }
            return 0;
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

        public int Update<T>(T entity, string primaryKey)
        {
            string updateSql = GenerateUpdateSql(entity, primaryKey, out DynamicParameters? parameters);
            if (updateSql != null)
            {
                return Connection.Execute(updateSql, param: parameters);
            }
            return 0;
        }

        public object? CheckExists<T>(string column, string value, string? returnValue)
        {
            var className = typeof(T).Name;
            var sql = $"SELECT * FROM {className} Where {column} = @Name";
            var parameters = new DynamicParameters();
            parameters.Add("@Name", value);
            var res = Connection.Query(sql, param: parameters);
            if (res == null)
            {
                return null;
            }

            //Chuyển đổi res sang kiểu IDictionary<string, object> để truy cập giá trị của thuộc tính trong đó qua key
            return returnValue != null ? ((IDictionary<string, object>)res)[returnValue] : res;
        }
    }
}
