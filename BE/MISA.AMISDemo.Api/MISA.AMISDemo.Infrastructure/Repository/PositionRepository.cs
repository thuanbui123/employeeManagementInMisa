using Dapper;
using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Interfaces;
using MISA.AMISDemo.Infrastructure.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Infrastructure.Repository
{
    public class PositionRepository : MISADbContext<Position>, IPositionRepository
    {
        public PositionRepository(IMISADbContext context):base(context) 
        {
            
        }
    }
}
