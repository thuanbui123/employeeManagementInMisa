using Dapper;
using MISA.AMISDemo.Core.Entities;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
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
    }
}
