using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using MySqlConnector;
using System.Data;

namespace MISA.AMISDemo.Infrastructure.Repository
{
    public class CustomerRepository : MISADbContext<Customer>, ICustomerRepository, IDisposable
    {
        public int Delete(Customer item)
        {
            throw new NotImplementedException();
        }

        public void Dispose()
        {
            connection.Dispose();
        }

        public bool ExistsByCode(string code)
        {
            throw new NotImplementedException();
        }

        public int Insert(Customer item)
        {
            throw new NotImplementedException();
        }

        public int Update(Customer item)
        {
            throw new NotImplementedException();
        }

    }
}
