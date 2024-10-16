using Dapper;
using Microsoft.Extensions.Configuration;
using MISA.AMISDemo.Core;
using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Interfaces;
using MISA.AMISDemo.Infrastructure.Interface;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
//Thư viện cho phép truy cập các thông tin về các thuộc tính và phương thức của các class trong runtime
using System.Reflection;
//Thư viện hỗ trợ việc xây dựng chuỗi (string) hiệu quả hơn với StringBuilder
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Infrastructure.Repository
{
    public class MISADbContext<T> : IBaseReposity<T>, IDisposable where T : class
    {
        protected IMISADbContext _dbContext;
        protected string _className;
        public MISADbContext(IMISADbContext context)
        {
            _dbContext = context;
            _className = typeof(T).Name;
        }

        public void Dispose()
        {
            _dbContext.Connection.Dispose();
        }

        public IEnumerable<T> Get()
        {
            return _dbContext.Get<T>();
        }

        public IEnumerable<T> Get(string column, string value)
        {
            return _dbContext.Get<T>(column, value);
        }

        public bool ExistsByCode(string code)
        {
            return _dbContext.ExistsByCode<T>(code);
        }

        public string? GetMaxCode()
        {
            return _dbContext.GetMaxCode<T>();
        }

        public int Insert(T entity)
        {
            return _dbContext.Insert(entity);
        }

        public int Insert<K>(T? entity, K? dto) where K : class
        {
            return _dbContext.Insert<T, K>(entity, dto);
        }

        public int Update(T entity)
        {
            return _dbContext.Update(entity);
        }

        public int Delete(string id)
        {
            return _dbContext.Delete<T>(id);
        }

        public int DeleteAny(string[] ids)
        {
            return _dbContext.DeleteAny<T>(ids);
        }
    }
}
