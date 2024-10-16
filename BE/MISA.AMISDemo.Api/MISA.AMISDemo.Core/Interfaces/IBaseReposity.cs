using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Interfaces
{
    public interface IBaseReposity<T> where T : class
    {
        IEnumerable<T> Get();
        IEnumerable<T> Get(string column, string value);
        bool ExistsByCode(string code);
        string? GetMaxCode ();
        int Insert(T entity);
        int Insert <K>(T? entity, K? dto ) where K : class;
        int Update(T entity);
        int Delete(String id);
        int DeleteAny (string[] ids);
    }
}
