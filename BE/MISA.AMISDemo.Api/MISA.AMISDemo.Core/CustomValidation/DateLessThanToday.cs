using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.CustomValidation
{
    public class DateLessThanToday:ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null)
                return ValidationResult.Success;
            var dateValue = (DateTime)value;
            DateTime date;
            if (DateTime.TryParse(value.ToString(), out date))
            {
                var todayDate = DateTime.Now;
                if (todayDate < date)
                {
                    return new ValidationResult(ErrorMessage);
                } else
                {
                    return ValidationResult.Success;
                }
            } else
            {
                return new ValidationResult("Ngày tháng không hợp lệ!");
            }
        }
    }
}
