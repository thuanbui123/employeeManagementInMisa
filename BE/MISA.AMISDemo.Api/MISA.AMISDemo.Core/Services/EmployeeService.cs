using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using MISA.AMISDemo.Core.DTOs;
using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Exceptions;
using MISA.AMISDemo.Core.Interfaces;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Services
{
    public class EmployeeService : BaseService<Employee>, IEmployeeService
    {
        private readonly IMemoryCache _cache;
        private IEmployeeRepository _employeeRepository;
        private IUnitOfWork _unitOfWork;
        public EmployeeService(IMemoryCache cache, IEmployeeRepository employeeRepository, IUnitOfWork unitOfWork):base(reposity: employeeRepository)
        {
            _cache = cache;
            _employeeRepository = employeeRepository;
            _unitOfWork = unitOfWork;
        }
        public IEnumerable<Employee>? ImportService()
        {
            var cachedData = GetCachedEmployees();
            if (cachedData != null && cachedData.Count > 0)
            {
                foreach (var employee in cachedData)
                {
                    _employeeRepository.Insert(employee);

                }
            }
            return cachedData;
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
            return !string.IsNullOrWhiteSpace(bankAccount) &&
                Regex.IsMatch(bankAccount, @"^\d{8,15}$", RegexOptions.IgnoreCase);
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

        public List<Employee> GetCachedEmployees()
        {
            // Kiểm tra xem cache có dữ liệu không
            if (_cache.TryGetValue("employees", out List<Employee> employees))
            {
                return employees; // Nếu có dữ liệu, trả về
            }

            // Nếu không có dữ liệu trong cache, trả về null
            return null; // Trả về null nếu cache không có dữ liệu
        }

        public bool CheckFileImport(IFormFile fileImport)
        {
            var employees = new List<Employee>();
            var fileExtension = Path.GetExtension(fileImport.FileName).ToLower();
            var fileSizeInBytes = fileImport.Length;
            var maxFileSizeInBytes = 2 * 1024 * 1024; // 2MB
            if (fileExtension != ".xlsx" && fileExtension != ".xls" || fileSizeInBytes > maxFileSizeInBytes)
            {
                return false;
            }
            using (var stream = new MemoryStream())
            {
                fileImport.CopyTo(stream);

                using (var package = new ExcelPackage(stream))
                {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                    if (worksheet == null)
                    {
                        return false; // Không thể đọc sheet
                    }

                    var rowCount = worksheet.Dimension.Rows;

                    for (int row = 4; row <= rowCount; row++)
                    {
                        var dob = worksheet.Cells[row, 5]?.Value?.ToString()?.Trim();
                        var identityDate = worksheet.Cells[row, 10]?.Value?.ToString()?.Trim();

                        // Thực hiện các kiểm tra và trả về false nếu gặp lỗi
                        if (_employeeRepository.CheckDuplicateCode(worksheet.Cells[row, 2]?.Value?.ToString()?.Trim(), _unitOfWork.Transaction))
                        {
                            return false;
                        }
                        if (!IsValidEmail(worksheet.Cells[row, 4]?.Value?.ToString()?.Trim()))
                        {
                            return false;
                        }
                        if (!IsValidPhoneNumber(worksheet.Cells[row, 14]?.Value?.ToString()?.Trim()))
                        {
                            return false;
                        }
                        if (!IsValidPhoneNumber(worksheet.Cells[row, 15]?.Value?.ToString()?.Trim()))
                        {
                            return false;
                        }
                        if (decimal.Parse(worksheet.Cells[row, 13]?.Value?.ToString().Trim()) < 0)
                        {
                            return false;
                        }
                        DateTime? dateOfBirth = ProcessDate(dob);
                        DateTime? identityDateTime = ProcessDate(identityDate);
                        if (dateOfBirth == null || dateOfBirth >= DateTime.Now || (DateTime.Now.Year - dateOfBirth.Value.Year) < 18)
                        {
                            return false;
                        }
                        if (identityDateTime == null || identityDateTime >= DateTime.Now)
                        {
                            return false;
                        }
                        if (!IsValidIdentityNumber(worksheet.Cells[row, 9]?.Value?.ToString()?.Trim()))
                        {
                            return false;
                        }
                        if (!IsValidBankAccount(worksheet.Cells[row, 16]?.Value?.ToString()?.Trim()))
                        {
                            return false;
                        }

                        // Nếu tất cả kiểm tra đều hợp lệ, tạo đối tượng Employee
                        var employee = new Employee
                        {
                            EmployeeId = Guid.NewGuid(),
                            EmployeeCode = worksheet.Cells[row, 2]?.Value?.ToString()?.Trim(),
                            FullName = worksheet.Cells[row, 3]?.Value?.ToString()?.Trim(),
                            Email = worksheet.Cells[row, 4]?.Value?.ToString()?.Trim(),
                            DateOfBirth = dateOfBirth,
                            Gender = worksheet.Cells[row, 6]?.Value?.ToString()?.Trim(),
                            Address = worksheet.Cells[row, 7]?.Value?.ToString()?.Trim(),
                            Position = worksheet.Cells[row, 8]?.Value?.ToString()?.Trim(),
                            IdentityNumber = worksheet.Cells[row, 9]?.Value?.ToString()?.Trim(),
                            IdentityDate = identityDateTime,
                            Department = worksheet.Cells[row, 11]?.Value?.ToString()?.Trim(),
                            IdentityPlace = worksheet.Cells[row, 12]?.Value?.ToString()?.Trim(),
                            Salary = decimal.Parse(worksheet.Cells[row, 13]?.Value?.ToString().Trim()),
                            PhoneNumber = worksheet.Cells[row, 14]?.Value?.ToString()?.Trim(),
                            Landline = worksheet.Cells[row, 15]?.Value?.ToString()?.Trim(),
                            BankAccount = worksheet.Cells[row, 16]?.Value?.ToString()?.Trim(),
                            BankName = worksheet.Cells[row, 17]?.Value?.ToString()?.Trim(),
                            Branch = worksheet.Cells[row, 18]?.Value?.ToString()?.Trim(),
                        };

                        // Thêm employee vào danh sách kết quả
                        employees.Add(employee);
                    }
                }
            }

            // Nếu không có lỗi, lưu danh sách employees vào cache và trả về true
            _cache.Set("employees", employees, TimeSpan.FromHours(1));
            return true;
        }
    }
}
