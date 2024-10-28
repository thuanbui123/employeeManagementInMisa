using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Infrastructure.Interface
{
    public interface IMISADbContext
    {
        IDbConnection Connection { get; }
        IDbTransaction Transaction { get; set; }
        IEnumerable<T> Get<T>();
        IEnumerable<T> Get<T>(string column, string value);
        int? GetSumRow<T>();
        string GenerateInsertSql<T>(T obj, out DynamicParameters? parameters);
        string GenerateUpdateSql<T>(T obj, string primaryKey,  out DynamicParameters? parameters);
        int Insert<T>(T entity);
        int Update<T>(T entity, string primaryKey);
        int Delete<T>(String id);
        int DeleteAny<T>(string[] ids);
    }
}
