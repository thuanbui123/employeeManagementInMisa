using Microsoft.AspNetCore.Http;
using MISA.AMISDemo.Core.DTOs;
using MISA.AMISDemo.Core.Exceptions;
using MISA.AMISDemo.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Services
{
    public class BaseService<T> : IBaseService<T> where T : class
    {
        protected IBaseRepository<T> reposity;
        public BaseService(IBaseRepository<T> reposity)
        {
            this.reposity = reposity;   
        }

        public MISAServiceResult InsertService(T entity)
        {
            //Tự sinh id mới cho đối tượng
            SetNewId(entity);
            ValidateObject(entity);

            var res = reposity.Insert(entity);
            return new MISAServiceResult();
        }

        private void SetNewId (T entity)
        {
            var className = typeof(T).Name;
            var prop = typeof(T).GetProperty($"{className}Id");
            if (prop != null && (prop.PropertyType == typeof(Guid) || prop.PropertyType == typeof(Guid?)))
            {
                prop.SetValue(entity, Guid.NewGuid());
            }
        }

        // virtual cho phép class con có thể viết lại
        protected virtual void ValidateObject(T entity)
        {

        }

        public DateTime? ProcessDate(string? dateString)
        {
            if (dateString != null)
            {
                DateTime dateValue;
                if (DateTime.TryParse(dateString, out dateValue))
                {
                    return dateValue;
                }
            }
            return null;
        }
    }
}
