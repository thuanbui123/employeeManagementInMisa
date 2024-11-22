using MISA.AMISDemo.Core.Const;
using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Exceptions;
using MISA.AMISDemo.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Services
{
    public class DepartmentService : BaseService<Department>, IDepartmentService
    {
        private IDepartmentRepository _repository;
        private IEmployeeRepository _employeeRepository;
        public DepartmentService(IDepartmentRepository repository, IEmployeeRepository employeeRepository) : base(reposity: repository)
        {
            _repository = repository;
            _employeeRepository = employeeRepository;
        }

        public int Delete(string code)
        {
            List<string> listCode = (List<string>)_employeeRepository.GetDepartmentCodeInEmployee();
            listCode.Sort();
            int index = listCode.BinarySearch(code);
            if (index >= 0)
            {
                throw new MISAValidateException(MISAConst.ERROR_ASSOCIATED_DEPARTMENTCODE);
            }
            var res = _repository.Delete(code);
            return res;
        }

        public string GenerateCode()
        {
            string maxCode = _repository.GetMaxCode();
            var number = maxCode.Substring(3);
            var newNumber = Int32.Parse(number) + 1;
            return "DPM" + newNumber;
        }

        public int Insert(Department department)
        {
            ValidateInput(department);
            return _repository.Insert(department);
        }

        public IEnumerable<Department> Search(string key)
        {
            IEnumerable<Department> res = _repository.Search("departmentCode", key);
            if (res == null || res.Count() == 0)
            {
                res = _repository.Search("name", key);
            }
            return res;
        }

        public int Update(Department department, string primaryKey, string primaryValue)
        {
            bool isExists = _repository.ExistsByCode(primaryKey);
            if (!isExists)
            {
                throw new MISAValidateException(MISA.AMISDemo.Core.Resource.Resource.ValidateMsg_Department_NotExists);
            }
            var res = _repository.UpdateByEntity(department, primaryKey, primaryValue);
            return res;
        }

        /// <summary>
        /// Kiểm tra dữ liệu đầu vào 
        /// </summary>
        /// <param name="department">Đối tượng chứa dữ liệu cần kiểm tra</param>
        /// <exception cref="MISAValidateException">
        /// 
        /// </exception>
        protected void ValidateInput(Department department)
        {
            bool isDuplicateCode = CheckDuplicateCode(department.DepartmentCode);
            if (isDuplicateCode)
            {
                throw new MISAValidateException(MISAConst.ERROR_DEPARTMENTCODE_ALREADY_EXISTS);
            }
        }

        /// <summary>
        /// Kiểm tra xem mã nhân viên tồn tại hay chưa
        /// </summary>
        /// <param name="code">
        /// Mã nhân viên cần kiểm tra
        /// </param>
        /// <returns>
        /// true - nếu mã nhân viên đã tồn tại.
        /// Ngược lại trả về false
        /// </returns>
        private bool CheckDuplicateCode (string code)
        {
            List<string> listCode = (List<string>)_repository.GetListCode();
            if (listCode == null)
            {
                return false;
            }

            listCode.Sort();
            int index = listCode.BinarySearch(code);
            return index >= 0;
        }
    }
}
