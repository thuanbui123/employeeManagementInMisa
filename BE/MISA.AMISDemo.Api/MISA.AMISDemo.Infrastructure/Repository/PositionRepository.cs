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

        public string? CheckExists(string name)
        {
            var sql = "SELECT * FROM position Where name = @Name";
            var parameters = new DynamicParameters();
            parameters.Add("@Name", name);
            var res = _dbContext.Connection.QueryFirstOrDefault<Position>(sql, param: parameters);
            return res?.PositionCode;
        }
    }
}
