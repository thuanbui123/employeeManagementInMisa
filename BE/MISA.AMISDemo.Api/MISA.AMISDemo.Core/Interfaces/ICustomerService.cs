﻿using MISA.AMISDemo.Core.DTOs;
using MISA.AMISDemo.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Interfaces
{
    public interface ICustomerService:IBaseService<Customer>
    {
        MISAServiceResult InsertService(Customer customer);
    }
}