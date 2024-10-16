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
using MISA.AMISDemo.Infrastructure.Interface;

namespace MISA.AMISDemo.Infrastructure.Repository
{
    public class CustomerRepository : MISADbContext<Customer>, ICustomerRepository
    {
        public CustomerRepository(IMISADbContext context) : base(context) 
        {
            
        }
        public int Delete(Customer item)
        {
            throw new NotImplementedException();
        }
    }
}
