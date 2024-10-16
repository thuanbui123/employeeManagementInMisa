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
        IEnumerable<T> Get<T>();
        IEnumerable<T> Get<T>(string column, string value);
        bool ExistsByCode<T>(string code);
        string? GetMaxCode<T>();
        int Insert<T>(T entity);
        int Insert<T, K>(T? entity, K? dto)where K : class;
        int Update<T>(T entity);
        int Delete<T>(String id);
        int DeleteAny<T>(string[] ids);
    }
}
