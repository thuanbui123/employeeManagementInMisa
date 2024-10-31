using MISA.AMISDemo.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Interfaces
{
    public interface IDepartmentRepository : IBaseRepository<Department>
    {
        string? CheckExists(string name);
    }
}
