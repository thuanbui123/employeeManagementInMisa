using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Const
{
    public static class MISAConst
    {
        public const string ERROR_EMPLOYEECODE_EMPTY = "Mã nhân viên không được phép để trống";
        public const string ERROR_EMPLOYEENAME_EMPTY = "Tên nhân viên không được phép để trống";
        public const string ERROR_EMPLOYEEDATEOFBIRTH_GREATERTHANTODAY = "Ngày sinh phải nhỏ hơn ngày hiện tại!";
        public const string ERROR_EMPLOYEEDATEOFBIRTH_EMPTY = "Ngày sinh không được để trống";
        public const string ERROR_EMPLOYEEGENDER_EMPTY = "Giới tính không được để trống";
        public const string ERROR_EMPLOYEEDEPARTMENT_EMPTY = "Phòng ban không được để trống";
        public const string ERROR_EMPLOYEEPOSITION_EMPTY = "Chức vụ không được để trống";
        public const string ERROR_EMPLOYEEADDRESS_EMPTY = "Địa chỉ không được để trống";
        public const string ERROR_EMPLOYEESALARY_EMPTY = "Lương không được để trống";
    }
}
