using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Interfaces;
using MISA.AMISDemo.Infrastructure.Interface;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Infrastructure.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        public IMISADbContext DbContext { get; }

        public UnitOfWork(IMISADbContext dbContext, IBaseRepository<Employee> employeeRepository)
        {
            DbContext = dbContext;
            EmployeeRepository = employeeRepository;
        }

        public IBaseRepository<Employee> EmployeeRepository { get; }

        public IDbTransaction Transaction => DbContext.Transaction;

        public void BeginTransaction()
        {
            if (DbContext.Connection.State == ConnectionState.Closed)
            {
                DbContext.Connection.Open();
            }

            // Kiểm tra xem có giao dịch nào đang diễn ra không trước khi bắt đầu giao dịch mới
            if (DbContext.Transaction == null || DbContext.Transaction.Connection == null)
            {
                DbContext.Transaction = DbContext.Connection.BeginTransaction();
            }
        }

        public void Commit()
        {
            DbContext.Transaction.Commit();
        }

        public void Dispose()
        {
            // Đóng kết nối nếu nó đang mở
            if (DbContext.Connection.State == ConnectionState.Open)
            {
                DbContext.Connection.Close();
            }

            DbContext.Connection.Dispose();
        }

        public void Rollback()
        {
            DbContext.Transaction?.Rollback();
        }
    }
}
