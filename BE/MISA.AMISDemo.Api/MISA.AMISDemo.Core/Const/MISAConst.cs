using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Const
{
    public static class MISAConst
    {
        public const string ERROR_EMPLOYEECODE_EMPTY = "Mã nhân viên không được phép để trống!";
        public const string ERROR_EMPLOYEECODE_ALREADY_EXISTS = "Mã nhân viên đã tồn tại trong hệ thống!";
        public const string ERROR_INVALID_EMAIL = "Email không hợp lệ!";
        public const string ERROR_INVALID_IDENTITY_NUMBER = "Số căn cước công dân không hợp lệ!";
        public const string ERROR_INVALID_PHONENUMBER = "Số điện thoại di động không hợp lệ!";
        public const string ERROR_INVALID_LANDLINE = "Số điện thoại bàn không hợp lệ!";
        public const string ERROR_INVALID_SALARY = "Tiền lương không hợp lệ!";
        public const string ERROR_INVALID_DATEOFBIRTH = "Ngày sinh không hợp lệ!";
        public const string ERROR_INVALID_IDENTITYDATE = "Ngày cấp căn cước công dân không hợp lệ!";
        public const string ERROR_INVALID_BANKACCOUNT = "Tài khoản ngân hàng không hợp lệ!";
        public const string ERROR_BRANCHNAME_NOT_EXISTS = "Tên chi nhánh không tồn tại!";
        public const string ERROR_GENDER_NOT_EXISTS = "Giới tính không tồn tại!";
        public const string ERROR_DEPARTMENT_NOT_EXISTS = "Phòng ban không tồn tại!";
        public const string ERROR_POSITION_NOT_EXISTS = "Chức vụ không tồn tại!";
        public const string ERROR_EMPLOYEENAME_EMPTY = "Tên nhân viên không được phép để trống!";
        public const string ERROR_EMPLOYEEDATEOFBIRTH_GREATERTHANTODAY = "Ngày sinh phải nhỏ hơn ngày hiện tại!";
        public const string ERROR_EMPLOYEEDATEOFBIRTH_EMPTY = "Ngày sinh không được để trống!";
        public const string ERROR_EMPLOYEEGENDER_EMPTY = "Giới tính không được để trống!";
        public const string ERROR_EMPLOYEEDEPARTMENT_EMPTY = "Phòng ban không được để trống!";
        public const string ERROR_EMPLOYEEPOSITION_EMPTY = "Chức vụ không được để trống!";
        public const string ERROR_EMPLOYEEPHONENUMBER_EMPTY = "Số điện thoại di động không được để trống!";
        public const string ERROR_EMPLOYEEEMAIL_EMPTY = "Địa chỉ email không được để trống!";
        public const string ERROR_EMPLOYEEIDENTITYNUMBER_EMPTY = "Số chứng minh thư nhân dân không được để trống!";
        public const string ERROR_CANNOT_READ_EMPTY_FILE = "Không đọc được file excel trống!";

        public const string NOT_FOUND_DATA = "Không tìm thấy dữ liệu!";
    }
}
