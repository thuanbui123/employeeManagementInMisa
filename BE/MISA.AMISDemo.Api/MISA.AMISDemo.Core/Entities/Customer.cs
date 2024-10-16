﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Entities
{
    public class Customer
    {
        public Guid? CustomerId { get; set; }

        [Required(ErrorMessage = "Không được để trống!")]
        [MaxLength(15, ErrorMessage ="Độ dài không được quá 100!")]
        public string CustomerCode { get; set; }
        public string FullName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        [EmailAddress(ErrorMessage ="Email không đúng định dạng!")]
        public string Email { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string IdentityNumber { get; set; }
        public string IdentityPlace { get; set; }
        public DateTime? IdentityDate { get; set; }
    }
}