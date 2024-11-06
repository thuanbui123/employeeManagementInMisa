using MISA.AMISDemo.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Interfaces
{
    public interface IPositionRepository: IBaseRepository<Position>
    {
        /// <summary>
        /// Kiểm tra xem chức vụ có tồn tại trong hệ thống hay không
        /// </summary>
        /// <param name="name">Tên chức vụ cần kiểm tra</param>
        /// <returns>
        /// Tên chức vụ nếu chức vụ đó tồn tại trong hệ thống.
        /// Ngược lại trả về null
        /// </returns>
        string? CheckExists(string name);
    }
}
