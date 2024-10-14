using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Interfaces
{
    public interface IBaseReposity<T> where T : class
    {
        List<T> Get();
        T Get(String id);
        int Insert(T item);
        int Update(T item);
        int Delete(T item);
    }
}
