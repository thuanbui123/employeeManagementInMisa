using Dapper;
using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Interfaces;
using MISA.AMISDemo.Infrastructure.Interface;

namespace MISA.AMISDemo.Infrastructure.Repository
{
    public class DepartmentRepository : MISADbContext<Department>, IDepartmentRepository
    {
        public DepartmentRepository(IMISADbContext context) : base(context) 
        {
            
        }
    }
}
