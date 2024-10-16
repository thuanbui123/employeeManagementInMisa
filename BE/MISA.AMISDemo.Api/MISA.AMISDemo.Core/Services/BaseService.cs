using MISA.AMISDemo.Core.DTOs;
using MISA.AMISDemo.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Services
{
    public class BaseService<T> : IBaseService<T> where T : class
    {
        protected IBaseReposity<T> reposity;
        public BaseService(IBaseReposity<T> reposity)
        {
            this.reposity = reposity;   
        }

        public MISAServiceResult InsertService(T entity)
        {
            ValidateObject(entity);

            var res = reposity.Insert(entity);
            return new MISAServiceResult();
        }

        // virtual cho phép class con có thể viết lại
        protected virtual void ValidateObject(T entity)
        {

        }
    }
}
