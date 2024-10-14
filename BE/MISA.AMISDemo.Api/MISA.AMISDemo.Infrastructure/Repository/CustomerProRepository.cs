using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Infrastructure.Repository
{
    public class CustomerProRepository : MISADbContext<Customer>, ICustomerRepository
    {
        public int Delete(Customer item)
        {
            throw new NotImplementedException();
        }

        public Customer Get(string id)
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
