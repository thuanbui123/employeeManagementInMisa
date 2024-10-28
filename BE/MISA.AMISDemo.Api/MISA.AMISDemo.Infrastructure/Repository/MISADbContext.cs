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
    public class MISADbContext<T> : IBaseRepository<T>, IDisposable where T : class
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
            _dbContext.Connection.Close();
        }

        public IEnumerable<T> Get()
        {
            return _dbContext.Get<T>();
        }

        public IEnumerable<T> Get(string column, string value)
        {
            return _dbContext.Get<T>(column, value);
        }

        public int? GetSumRow()
        {
            return _dbContext.GetSumRow<T>();
        }

        public int Insert(T entity)
        {
            var res = _dbContext.Insert(entity);
            return res;
        }

        public int Delete(string id)
        {
            return _dbContext.Delete<T>(id);
        }

        public int DeleteAny(string[] ids)
        {
            return _dbContext.DeleteAny<T>(ids);
        }

        public string GenerateInsertSql<K>(K entity, out DynamicParameters? parameters)
        {
            return _dbContext.GenerateInsertSql<K>(entity, out parameters);
        }

        public string GenerateUpdateSql<K>(K obj, string primaryKeyColumn, out DynamicParameters? parameters)
        {
            return _dbContext.GenerateUpdateSql<K>(obj, primaryKeyColumn, out parameters);
        }

        public int Update(T entity, string primaryKey)
        {
            _dbContext.Connection.Open();
            _dbContext.Transaction = _dbContext.Connection.BeginTransaction();
            var transaction = _dbContext.Connection.BeginTransaction();
            var res = _dbContext.Update(entity, primaryKey);
            _dbContext.Transaction.Commit();
            return res;
        }

        public int Import(T entity)
        {
            var res = _dbContext.Insert(entity);
            return res;
        }
    }
}
