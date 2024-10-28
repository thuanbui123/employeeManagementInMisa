using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Interfaces
{
    public interface IBaseRepository<T> where T : class
    {
        IEnumerable<T> Get();
        IEnumerable<T> Get(string column, string value);
        string GenerateInsertSql<K>(K dto, out DynamicParameters? parameters);
        string GenerateUpdateSql<K>(K obj, string primaryKeyColumn, out DynamicParameters? parameters);
        int? GetSumRow ();
        int Insert(T entity);
        int Update(T entity, string primaryKey);
        int Delete(String id);
        int DeleteAny (string[] ids);
        int Import(T entity);
    }
}
