using MISA.AMISDemo.Core.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Interfaces
{
    public interface IUnitOfWork: IDisposable
    {
        IBaseRepository<Employee> EmployeeRepository { get; }
        void BeginTransaction();
        void Commit();
        void Rollback();

        IDbTransaction Transaction { get; }
    }
}
