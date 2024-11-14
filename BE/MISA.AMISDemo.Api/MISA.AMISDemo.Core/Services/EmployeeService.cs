using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using MISA.AMISDemo.Core.Const;
using MISA.AMISDemo.Core.DTOs;
using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Exceptions;
using MISA.AMISDemo.Core.Interfaces;
using MISA.AMISDemo.Core.MISAEnum;
using OfficeOpenXml;
using System.Text.RegularExpressions;

namespace MISA.AMISDemo.Core.Services
{
    public class EmployeeService : BaseService<Employee>, IEmployeeService
    {
        private ICacheManager _cache;
        private IEmployeeRepository _employeeRepository;
        private IPositionRepository _positionRepository;
        private IDepartmentRepository _departmentRepository;
        private IUnitOfWork _unitOfWork;
        public EmployeeService(ICacheManager cache, IDepartmentRepository departmentRepository, IPositionRepository positionRepository, IEmployeeRepository employeeRepository, IUnitOfWork unitOfWork):base(reposity: employeeRepository)
        {
            _cache = cache;
            _employeeRepository = employeeRepository;
            _positionRepository = positionRepository;
            _departmentRepository = departmentRepository;
            _unitOfWork = unitOfWork;
        }

        public bool ImportService(string keyCache)
        {
            var cachedData = _cache.GetFromCache(keyCache) as IEnumerable<Employee>;
            if (cachedData != null)
            {
                _unitOfWork.BeginTransaction();
                foreach (var employee in cachedData)
                {
                    _unitOfWork.EmployeeRepository.Insert(employee);
                }
                _unitOfWork.Commit();
                _unitOfWork.Dispose();
                _cache.RemoveFromCache(keyCache);
            }
            return cachedData != null;
        }

        private bool IsValidEmail(string email)
        {
            // Sử dụng biểu thức chính quy để xác thực email
            return !string.IsNullOrWhiteSpace(email) &&
                   Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.IgnoreCase);
        }

        /// <summary>
        /// Hàm kiểm tra tính hợp lệ của số điện thoại
        /// Số điện thoại được coi là hợp lệ khi nó khác chuỗi rỗng, không chứa khoảng trắng và thỏa mãn điều kiện sau
        /// - Các đầu số điện thoại hợp lệ: 03, 05, 07, 08, 09, 012, 016, 018, 019
        /// và đảm bảo phần tiếp theo là 8 chữ số bất kỳ từ 0-9
        /// </summary>
        /// <param name="phoneNumber">Số điện thoại cần kiểm tra tính hợp lệ</param>
        /// <returns>
        /// true - khi số điện thoại hợp lệ.
        /// Ngược lại trả về false
        /// </returns>
        private bool IsValidPhoneNumber (string phoneNumber)
        {
            return !string.IsNullOrWhiteSpace(phoneNumber) &&
                Regex.IsMatch(phoneNumber, @"(03|05|07|08|09)+([0-9]{8})$", RegexOptions.IgnoreCase);  
        }

        /// <summary>
        /// Kiểm tra tính hợp lệ của số điện thoại bàn
        /// </summary>
        /// <param name="landline">Số điện thoại bàn cần kiểm tra</param>
        /// <returns>
        /// true - nếu số điện thoại là null, rỗng hoặc khớp với định dạng hợp lệ
        /// Ngược lại trả về false
        /// </returns>
        private bool IsValidLandLine(string landline)
        {
            return string.IsNullOrEmpty(landline) ||
                Regex.IsMatch(landline, @"(03|05|07|08|09)+([0-9]{8})$", RegexOptions.IgnoreCase);
        }

        /// <summary>
        /// Hàm kiểm tra định dạng số căn cước công dân
        /// </summary>
        /// <param name="identityNumber">Số căn cước công dân cần kiểm tra</param>
        /// <returns>
        /// true: Số CCCD đầu vào hợp lệ
        /// false: Số CCCD đầu vào không hợp lệ
        /// </returns>
        /// created-by: BVThuan (23/10/2024)
        private bool IsValidIdentityNumber (string  identityNumber)
        {
            return !string.IsNullOrWhiteSpace(identityNumber) &&
                Regex.IsMatch(identityNumber, @"^\d{12}$|^(0[1-9]{1}[0-9]{0,3}[0-9]{5})$|^(0[1-9]{1}[0-9]{0,3}[0-9]{9})$", RegexOptions.IgnoreCase);
        }

        /// <summary>
        /// Hàm kiểm tra định dạng tài khoản ngân hàng
        /// </summary>
        /// <param name="bankAccount">Tài khoản ngân hàng cần kiểm tra</param>
        /// <returns>
        /// true - chuỗi đầu vào đúng định dạng
        /// false - chuỗi đầu vào không hợp lệ
        /// </returns>
        /// created-by: BVThuan (23/10/2024)
        private bool IsValidBankAccount(string bankAccount)
        {
            return string.IsNullOrWhiteSpace(bankAccount) ||
                Regex.IsMatch(bankAccount, @"^\d{8,15}$", RegexOptions.IgnoreCase);
        }

        /// <summary>
        /// Kiểm tra tính hợp lệ của tên chi nhánh
        /// </summary>
        /// <param name="branch">Tên chi nhánh cần kiểm tra</param>
        /// <returns>
        /// true - tên chi nhánh có trong hệ thống.
        /// Ngược lại trả về false
        /// </returns>
        private bool IsValidBranch (string branch)
        {
            if (branch == null || (branch != "Hà Nội" && branch != "TP. Hồ Chí Minh"))
            {
                return false;
            }
            return true;
        }

        /// <summary>
        /// Kiểm tra tính hợp lệ của giới tính
        /// </summary>
        /// <param name="gender">Giới tính cần kiểm tra</param>
        /// <returns>
        /// true - giới tính hợp lệ.
        /// Ngược lại trả về false
        /// </returns>
        private bool IsValidGender (string gender)
        {
            if (gender == null || (gender.ToLower() != "nam" && gender.ToLower() != "nữ" && gender.ToLower() != "khác")) {
                return false;
            }
            return true;
        }

        /// <summary>
        /// Kiểm tra tính hợp lệ của đối tượng nhân viên
        /// Kiểm tra xem mã nhân viên đã tồn tại trong hệ thống hay chưa
        /// </summary>
        /// <param name="entity">Đối tượng nhân viên cần kiểm tra</param>
        /// <exception cref="MISAValidateException">
        /// Ném ra một ngoại lệ nếu mã nhân viên tồn tại 
        /// </exception>
        protected override void ValidateObject(Employee entity)
        {
            var isDuplicate = _employeeRepository.CheckDuplicateCode(entity.EmployeeCode);
            if (isDuplicate )
            {
                throw new MISAValidateException(MISA.AMISDemo.Core.Resource.Resource.ValidateMsg_Employee_EmployeeCode_Empty);
            }
        }

        public EmployeeListResponseDTO<EmployeeResponseDTO>? Search(string query, string branch, int limit, int offset)
        {
            EmployeeListResponseDTO<EmployeeResponseDTO> result = _employeeRepository.Search("employeeCode", query, branch, limit, offset);
            if (result == null || result.Employees.Count() == 0)
            {
                result = _employeeRepository.Search("fullName", query, branch, limit, offset);
            }   
            return result;
        }

        public int InsertByDTO(EmployeeDTO dto)
        {

            if (_employeeRepository.CheckDuplicateCode(dto.EmployeeCode))
            {
                throw new MISAValidateException(MISAConst.ERROR_EMPLOYEECODE_ALREADY_EXISTS);
            }

            ValidateInput(dto);
            dto.EmployeeID = Guid.NewGuid();
            var res = _employeeRepository.InsertByDTO(dto);
            return res;
        }

        public void ValidateInput (EmployeeDTO dto)
        {
            if (!IsValidEmail(dto.Email))
            {
                throw new MISAValidateException(MISAConst.ERROR_INVALID_EMAIL);
            }

            if (!IsValidIdentityNumber(dto.IdentityNumber))
            {
                throw new MISAValidateException(MISAConst.ERROR_INVALID_IDENTITY_NUMBER);
            }

            if (!IsValidPhoneNumber(dto.PhoneNumber))
            {
                throw new MISAValidateException(MISAConst.ERROR_INVALID_PHONENUMBER);
            }

            if (!IsValidLandLine(dto.Landline))
            {
                throw new MISAValidateException(MISAConst.ERROR_INVALID_LANDLINE);
            }

            if (!string.IsNullOrEmpty(dto.Salary.ToString()))
            {
                if (decimal.TryParse(dto.Salary.ToString(), out var result) && result >= 0)
                {
                    dto.Salary = result;
                }
                else
                {
                    throw new MISAValidateException(MISAConst.ERROR_INVALID_SALARY);
                }
            }

            if (dto.DateOfBirth != null)
            {
                if (dto.DateOfBirth >= DateTime.Now || (DateTime.Now.Year - dto.DateOfBirth.Value.Year) < 18)
                {
                    throw new MISAValidateException(MISAConst.ERROR_INVALID_DATEOFBIRTH);
                }
            }

            if (dto.IdentityDate != null)
            {
                if (dto.IdentityDate >= DateTime.Now)
                {
                    throw new MISAValidateException (MISAConst.ERROR_INVALID_IDENTITYDATE);
                }
            }

            if (!IsValidBankAccount(dto.BankAccount))
            {
                throw new MISAValidateException (MISAConst.ERROR_INVALID_BANKACCOUNT);
            }

            if (!string.IsNullOrEmpty(dto.Branch))
            {
                if (!IsValidBranch(dto.Branch))
                {
                    throw new MISAValidateException(MISAConst.ERROR_BRANCHNAME_NOT_EXISTS);
                }
            }

            if (!string.IsNullOrEmpty(dto.Gender))
            {
                if (!IsValidGender(dto.Gender))
                {
                    throw new MISAValidateException(MISAConst.ERROR_GENDER_NOT_EXISTS);
                }
            }

            if (dto.DepartmentCode != null && _departmentRepository.CheckExists("departmentCode", dto.DepartmentCode, null) == null)
            {
                throw new MISAValidateException (MISAConst.ERROR_DEPARTMENT_NOT_EXISTS);
            }

            if (dto.PositionCode != null && _positionRepository.CheckExists("positionCode", dto.PositionCode, null) == null)
            {
                throw new MISAValidateException (MISAConst.ERROR_POSITION_NOT_EXISTS);
            }
        }

        public string GenerateNewCode ()
        {

            string? maxCode = _employeeRepository.GetMaxCode();
            var number = maxCode.Substring(3);
            var newNumber = Int32.Parse(number)+1;
            return "EMP" + newNumber;
        }

        public int UpdateByDTO(EmployeeDTO dto, string primaryKey)
        {
            ValidateInput(dto);
            bool isExistsEmployee = _employeeRepository.ExistsByCode(dto.EmployeeCode);
            if (!isExistsEmployee)
            {
                throw new MISAValidateException(MISA.AMISDemo.Core.Resource.Resource.ValidateMsg_Employee_NotExists);
            }
            var res = _employeeRepository.UpdateByDTO(dto, primaryKey);
            return res;
        }

        public int DeleteByCode(string code)
        {
            bool isExistsEmployee = _employeeRepository.ExistsByCode(code);
            if (!isExistsEmployee)
            {
                throw new MISAValidateException(MISA.AMISDemo.Core.Resource.Resource.ValidateMsg_Employee_NotExists);
            }
            var res = _employeeRepository.Delete(code);
            return res;
        }

        public object? CheckFileImport(IFormFile fileImport)
        {
            var employees = new List<Employee>();
            var errorList = new List<(int RowNumber, string ErrorMessage)>();
            
            try
            {
                using (var stream = new MemoryStream())
                {
                    fileImport.CopyTo(stream);

                    using (var package = new ExcelPackage(stream))
                    {
                        ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                        if (worksheet == null)
                        {
                            errorList.Add((0, MISAConst.ERROR_CANNOT_READ_EMPTY_FILE));
                        }
                        else
                        {
                            var rowCount = worksheet.Dimension.Rows;
                            var codes = _employeeRepository.GetListCode();
                            for (int row = 4; row <= rowCount; row++)
                            {
                                try
                                {
                                    var dob = GetCellValue(worksheet, row, 5);
                                    var identityDate = GetCellValue(worksheet, row, 10);
                                    var employeeCode = GetCellValue(worksheet, row, 2);
                                    var fullName = GetCellValue(worksheet, row, 3);
                                    var email = GetCellValue(worksheet, row, 4);
                                    var gender = GetCellValue(worksheet, row, 6);
                                    var address = GetCellValue(worksheet, row, 7);
                                    var position = GetCellValue(worksheet, row, 8);
                                    var identityNumber = GetCellValue(worksheet, row, 9);
                                    var department = GetCellValue(worksheet, row, 11);
                                    var identityPlace = GetCellValue(worksheet, row, 12);
                                    var salary = GetCellValue(worksheet, row, 13);
                                    var phoneNumber = GetCellValue(worksheet, row, 14);
                                    var landline = GetCellValue(worksheet, row, 15);
                                    var bankAccount = GetCellValue(worksheet, row, 16);
                                    var bankName = GetCellValue(worksheet, row, 17);
                                    var branch = GetCellValue(worksheet, row, 18);
                                    var departmentCode = _departmentRepository.CheckExists("name", department, "departmentCode");
                                    var positionCode = _positionRepository.CheckExists("name", position, "positionCode");
                                    decimal? parsedSalary = null;
                                    // Thực hiện các kiểm tra và trả về false nếu gặp lỗi
                                    if (employeeCode == null)
                                    {
                                        errorList.Add((row, MISAConst.ERROR_EMPLOYEECODE_EMPTY));
                                    } else if (_employeeRepository.CheckDuplicateCode(employeeCode, codes))
                                    {
                                        errorList.Add((row, MISAConst.ERROR_EMPLOYEECODE_ALREADY_EXISTS));
                                    }
                                    if (fullName == null)
                                    {
                                        errorList.Add((row, MISAConst.ERROR_EMPLOYEENAME_EMPTY));
                                    }
                                    if (!IsValidEmail(email?.Trim()))
                                    {
                                        errorList.Add((row, MISAConst.ERROR_INVALID_EMAIL));
                                    }
                                    if (!IsValidIdentityNumber(identityNumber))
                                    {
                                        errorList.Add((row, MISAConst.ERROR_INVALID_IDENTITY_NUMBER));
                                    }
                                    if (!IsValidPhoneNumber(phoneNumber))
                                    {
                                        errorList.Add((row, MISAConst.ERROR_INVALID_PHONENUMBER));
                                    }
                                    if (!IsValidLandLine(landline))
                                    {
                                        errorList.Add((row, MISAConst.ERROR_INVALID_LANDLINE));
                                    }
                                    if (!string.IsNullOrEmpty(salary))
                                    {
                                        if (decimal.TryParse(salary, out var result) && result >= 0)
                                        {
                                            parsedSalary = result;
                                        }
                                        else
                                        {
                                            errorList.Add((row, MISAConst.ERROR_INVALID_SALARY));
                                        }
                                    }
                                    DateTime? dateOfBirth = ProcessDate(dob);
                                    DateTime? identityDateTime = ProcessDate(identityDate);
                                    if (dateOfBirth != null)
                                    {
                                        if (dateOfBirth >= DateTime.Now || (DateTime.Now.Year - dateOfBirth.Value.Year) < 18)
                                        {
                                            errorList.Add((row, MISAConst.ERROR_INVALID_DATEOFBIRTH));
                                        }
                                    }
                                    if (identityDate != null)
                                    {
                                        if (identityDateTime >= DateTime.Now)
                                        {
                                            errorList.Add((row, MISAConst.ERROR_INVALID_IDENTITYDATE));
                                        }
                                    }
                                    if (!IsValidBankAccount(bankAccount))
                                    {
                                        errorList.Add((row, MISAConst.ERROR_INVALID_BANKACCOUNT));
                                    }
                                    if (!IsValidBranch(branch))
                                    {
                                        errorList.Add((row, MISAConst.ERROR_BRANCHNAME_NOT_EXISTS));
                                    }
                                    if (!IsValidGender(gender))
                                    {
                                        errorList.Add((row, MISAConst.ERROR_GENDER_NOT_EXISTS));
                                    }
                                    if (department != null && departmentCode == null)
                                    {
                                        errorList.Add((row, MISAConst.ERROR_DEPARTMENT_NOT_EXISTS));
                                    }
                                    if (position != null && positionCode == null)
                                    {
                                        errorList.Add((row, MISAConst.ERROR_POSITION_NOT_EXISTS));
                                    }
                                    // Nếu tất cả kiểm tra đều hợp lệ, tạo đối tượng Employee
                                    var employee = new Employee
                                    {
                                        EmployeeId = Guid.NewGuid(),
                                        EmployeeCode = employeeCode,
                                        FullName = fullName,
                                        Email = email,
                                        DateOfBirth = dateOfBirth,
                                        Gender = gender,
                                        Address = address,
                                        PositionCode = positionCode?.ToString(),
                                        IdentityNumber = identityNumber,
                                        IdentityDate = identityDateTime,
                                        DepartmentCode = departmentCode?.ToString(),
                                        IdentityPlace = identityPlace,
                                        Salary = parsedSalary ?? 0,
                                        PhoneNumber = phoneNumber,
                                        Landline = landline,
                                        BankAccount = bankAccount,
                                        BankName = bankName,
                                        Branch = branch,
                                    };

                                    // Thêm employee vào danh sách kết quả
                                    employees.Add(employee);
                                } catch (Exception ex)
                                {
                                    errorList.Add((row, $"Lỗi khi xử lý dòng {row}: {ex.Message}"));
                                }
                            }
                        }
                    }
                }
            } catch (Exception ex)
            {
                errorList.Add((0, $"Lỗi khi đọc file: {ex.Message}"));
            }


            if (errorList.Any())
            {
                // Nếu có lỗi, tạo file Excel chứa danh sách lỗi
                return WriteErrorLogToExcel(fileImport, errorList);
            }

            // Nếu không có lỗi, lưu danh sách employees vào cache và trả về true
            var _keyCache = _cache.AddToCache(employees);
            return _keyCache;
        }

        public byte[]? ExportExcelFile(string branch)
        {
            var headers = new List<string>
            {
                "Mã nhân viên",
                "Họ và tên",
                "Giới tính",
                "Ngày sinh",
                "Phòng ban",
                "Vị trí",
                "Địa chỉ",
                "Lương",
                "Số căn cước công dân",
                "Ngày cấp",
                "Nơi cấp",
                "Số điện thoại",
                "Điện thoại bàn",
                "Email",
                "Số tài khoản ngân hàng",
                "Tên ngân hàng",
                "Chi nhánh",
            };
            var data = _employeeRepository.GetEmployeeResponseByBranch(branch);

            var nameSheet = "Danh sách nhân viên";

            var res = ExportExcel(headers, data, nameSheet);

            return res;
        }
    }
}
