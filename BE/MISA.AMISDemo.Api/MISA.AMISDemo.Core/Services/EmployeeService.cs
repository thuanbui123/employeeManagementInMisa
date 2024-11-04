using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using MISA.AMISDemo.Core.DTOs;
using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Exceptions;
using MISA.AMISDemo.Core.Interfaces;
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

        private bool IsValidPhoneNumber (string phoneNumber)
        {
            return !string.IsNullOrWhiteSpace(phoneNumber) &&
                Regex.IsMatch(phoneNumber, @"^(0(1[0-9]|9[0-9]|8[0-9]|7[0-9]|6[0-9]|5[0-9]|4[0-9]|3[0-9]|2[0-9]))\d{7}$", RegexOptions.IgnoreCase);  
        }

        private bool IsValidLandLine(string landline)
        {
            return string.IsNullOrEmpty(landline) ||
                Regex.IsMatch(landline, @"^(0(1[0-9]|9[0-9]|8[0-9]|7[0-9]|6[0-9]|5[0-9]|4[0-9]|3[0-9]|2[0-9]))\d{7}$", RegexOptions.IgnoreCase);
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

        private string? IsValidPosition (string  position)
        {
            var isCheck = _positionRepository.CheckExists(position);
            return isCheck;
        }

        private bool IsValidBranch (string branch)
        {
            if (branch == null || (branch != "Hà Nội" && branch != "TP. Hồ Chí Minh"))
            {
                return false;
            }
            return true;
        }

        private string? IsValidDepartment (string name)
        {
            var isCheck = _departmentRepository.CheckExists (name);
            return isCheck;
        }

        private bool IsValidGender (string gender)
        {
            if (gender == null || (gender.ToLower() != "nam" && gender.ToLower() != "nữ" && gender.ToLower() != "khác")) {
                return false;
            }
            return true;
        }

        protected override void ValidateObject(Employee entity)
        {
            var isDuplicate = _employeeRepository.CheckDuplicateCode(entity.EmployeeCode);
            if (isDuplicate )
            {
                throw new MISAValidateException(MISA.AMISDemo.Core.Resource.Resource.ValidateMsg_Employee_EmployeeCode_Empty);
            }
        }

        public EmployeeListResponseDTO? Search(string query, string branch, int limit, int offset)
        {
            EmployeeListResponseDTO result = _employeeRepository.Search("employeeCode", query, branch, limit, offset);
            if (result == null || result.Employees.Count() == 0)
            {
                result = _employeeRepository.Search("fullName", query, branch, limit, offset);
            }   
            return result;
        }

        public int InsertByDTO(EmployeeDTO dto)
        {
            dto.EmployeeID = Guid.NewGuid();
            var res = _employeeRepository.InsertByDTO(dto);
            return res;
        }

        public string GenerateNewCode ()
        {

            string? maxCode = _employeeRepository.GetMaxCode();
            var number = maxCode.Substring(3);
            var newNumber = Int32.Parse(number)+1;
            return "EMP" + newNumber;
        }

        public int UpdateByDTO(EmployeeDTO dto, String primaryKey)
        {
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
                            errorList.Add((0, "Không đọc được file excel trống!"));
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
                                    var departmentCode = department;
                                    var positionCode = position;
                                    decimal? parsedSalary = null;
                                    // Thực hiện các kiểm tra và trả về false nếu gặp lỗi
                                    if (employeeCode == null)
                                    {
                                        errorList.Add((row, "Mã nhân viên không được để trống!"));
                                    } else if (_employeeRepository.CheckDuplicateCode(employeeCode, codes))
                                    {
                                        errorList.Add((row, "Mã nhân viên đã tồn tại trong hệ thống!"));
                                    }
                                    if (fullName == null)
                                    {
                                        errorList.Add((row, "Họ và tên không được để trống!"));
                                    }
                                    if (!IsValidEmail(email?.Trim()))
                                    {
                                        errorList.Add((row, "Email không đúng định dạng!"));
                                    }
                                    if (!IsValidIdentityNumber(identityNumber))
                                    {
                                        errorList.Add((row, "Số CCCD không đúng định dạng!"));
                                    }
                                    if (!IsValidPhoneNumber(phoneNumber))
                                    {
                                        errorList.Add((row, "Số điện thoại di động không đúng định dạng!"));
                                    }
                                    if (!IsValidLandLine(landline))
                                    {
                                        errorList.Add((row, "Số điện thoại bàn không đúng định dạng!"));
                                    }
                                    if (!string.IsNullOrEmpty(salary))
                                    {
                                        if (decimal.TryParse(salary, out var result) && result >= 0)
                                        {
                                            parsedSalary = result;
                                        }
                                        else
                                        {
                                            errorList.Add((row, "Tiền lương không đúng định dạng hoặc là số âm!"));
                                        }
                                    }
                                    DateTime? dateOfBirth = ProcessDate(dob);
                                    DateTime? identityDateTime = ProcessDate(identityDate);
                                    if (dateOfBirth != null)
                                    {
                                        if (dateOfBirth >= DateTime.Now || (DateTime.Now.Year - dateOfBirth.Value.Year) < 18)
                                        {
                                            errorList.Add((row, "Ngày sinh không đúng định dạng!"));
                                        }
                                    }
                                    if (identityDate != null)
                                    {
                                        if (identityDateTime >= DateTime.Now)
                                        {
                                            errorList.Add((row, "Ngày cấp CCCD không đúng định dạng!"));
                                        }
                                    }
                                    if (!IsValidBankAccount(bankAccount))
                                    {
                                        errorList.Add((row, "Tài khoản ngân hàng không đúng định dạng!"));
                                    }
                                    if (!IsValidBranch(branch))
                                    {
                                        errorList.Add((row, "Tên chi nhánh không tồn tại!"));
                                    }
                                    if (!IsValidGender(gender))
                                    {
                                        errorList.Add((row, "Giới tính không tồn tại!"));
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
                                        PositionCode = positionCode,
                                        IdentityNumber = identityNumber,
                                        IdentityDate = identityDateTime,
                                        DepartmentCode = departmentCode,
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
