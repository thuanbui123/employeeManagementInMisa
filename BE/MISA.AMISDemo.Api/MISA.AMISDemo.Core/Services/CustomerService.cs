using MISA.AMISDemo.Core.DTOs;
using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Services
{
    public class CustomerService : BaseService<Customer>, ICustomerService
    {
        ICustomerRepository _customerRepository;

        public CustomerService(ICustomerRepository repository):base(repository) 
        {
            _customerRepository = repository;
        }
        public MISAServiceResult InsertService(Customer item)
        {
            //Xử lý nghiệp vụ:
            //...Check email...
            //Check mã khách hàng đã tồn tại hay chưa?
            //...
            //Sau khi hợp lệ thì thêm mới vào database
            var res = _customerRepository.Insert(item);
            if (res == 1)
            {
                return new MISAServiceResult
                {
                    Susscess = true,
                    Data = res
                };
            }
            return new MISAServiceResult
            {
                Susscess = false,
                Data = res
            };
        }
    }
}
