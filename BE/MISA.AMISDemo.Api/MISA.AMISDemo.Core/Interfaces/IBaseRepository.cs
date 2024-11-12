using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Interfaces
{
    public interface IBaseRepository<T> where T : class
    {
        /// <summary>
        /// Lấy một danh sách đối tượng của loại T
        /// Phương thức này trả về tất cả các phần tử có trong nguồn dữ liệu.
        /// </summary>
        /// <returns>
        /// Một tập hợp các đối tượng kiểu T.
        /// </returns>
        IEnumerable<T> Get();
        /// <summary>
        /// Lấy danh sách đối tượng của loại T dựa trên giá trị của một cột cụ thể
        /// Phương thức này trả về tất cả các phần tử có giá trị trong cột trùng với giá trị đầu vào
        /// </summary>
        /// <param name="column">Tên cột cần tìm kiếm dữ liệu</param>
        /// <param name="value">Giá trị cần tìm trong cột chỉ định</param>
        /// <returns>
        /// Một tập hợp các đối tượng kiểu T mà cột chỉ định có giá trị trùng với giá trị đầu vào
        /// </returns>
        IEnumerable<T> Get(string column, string value);

        /// <summary>
        /// Tạo câu lệnh SQL dạng 'Insert' dựa trên đối tượng truyền vào
        /// Phương thức này xây dựng câu lệnh SQL để chèn dữ liệu từ đối tượng 'dto'
        /// và trả về các tham số động tương ứng
        /// </summary>
        /// <typeparam name="K">Kiểu dữ liệu của đối tượng dto chứa thông tin cần chèn</typeparam>
        /// <param name="dto">Đối tượng chứa dữ liệu cần chèn vào cơ sở dữ liệu</param>
        /// <param name="parameters">
        /// Đối tượng `DynamicParameters` chứa các tham số tương ứng với câu lệnh SQL
        /// Được trả về dưới dạng out và có thể là null nếu không có tham số
        /// </param>
        /// <returns>
        /// Chuỗi SQL dạng 'INSERT' để chèn dữ liệu dto vào cơ sở dữ liệu
        /// </returns>
        string GenerateInsertSql<K>(K dto, out DynamicParameters? parameters);

        /// <summary>
        /// Tạo câu lệnh SQL dạng 'UPDATE' dựa trên đối tượng truyền vào
        /// Phương thức này xây dựng câu lệnh SQL để sửa dữ liệu từ đối tượng 'obj'
        /// xác định bản ghi cần cập nhật thông qua cột khóa chính 
        /// và trả về các tham số động tương ứng
        /// </summary>
        /// <typeparam name="K">Kiểu dữ liệu của đối tượng obj chứa thông tin cần sửa</typeparam>
        /// <param name="obj">Đối tượng chứa dữ liệu cần sửa</param>
        /// <param name="primaryKeyColumn">Tên cột khóa chính dùng để xác định bản ghi cần cập nhật</param>
        /// <param name="parameters">
        /// Đối tượng 'DynamicParameters' chứa các tham số tương ứng với câu lệnh SQL
        /// Được trả về dưới dạng out và có thể là null nếu không có tham số
        /// </param>
        /// <returns>
        /// Chuỗi SQL dạng 'UPDATE' để cập nhật dữ liệu từ 'obj' vào cơ sở dữ liệu
        /// </returns>
        string GenerateUpdateSql<K>(K obj, string primaryKeyColumn, out DynamicParameters? parameters);
       
        /// <summary>
        /// Lấy tổng số bản trong cơ sở dữ liệu
        /// </summary>
        /// <returns>Hàm trả về tổng số bản ghi</returns>
        int? GetSumRow ();

        /// <summary>
        /// Phương thức này thực hiện việc chèn đối tượng `entity` vào cơ sở dữ liệu
        /// </summary>
        /// <param name="entity">Đối tượng chứa dữ liệu cần chèn</param>
        /// <returns>
        /// Trả về số dòng bị ảnh hưởng bởi câu lệnh SQL `INSERT`. Nếu thêm thành công, giá trị trả về là 1.
        /// Ngược lại nếu thất bại sẽ trả về 0
        /// </returns>
        int Insert(T entity);

        /// <summary>
        /// Phương thức này thực hiện việc cập nhật dữ liệu của một đối tượng dựa trên khóa chính 'primaryKey'
        /// </summary>
        /// <param name="entity">Đối tượng cần cập nhật thông tin</param>
        /// <param name="primaryKey">Giá trị của khóa chính dùng để xác định đối tượng cần cập nhật</param>
        /// <returns>
        /// Trả về số dòng bị ảnh hưởng bởi câu lệnh SQL `UPDATE`. Nếu cập nhật thành công, giá trị trả về là 1.
        /// Ngược lại nếu thất bại sẽ trả về 0
        /// </returns>
        int Update(T entity, string primaryKey);

        /// <summary>
        /// Phương thức này thực hiện việc xóa một đối tượng dựa trên mã id
        /// </summary>
        /// <param name="id">Giá trị để xác định đối tượng cần xóa</param>
        /// <returns>
        /// Trả về số dòng bị ảnh hưởng bởi câu lệnh SQL `DELETE`. Nếu xóa thành công, giá trị trả về là 1
        /// Ngược lại nếu thất bại sẽ trả về 0
        /// </returns>
        int Delete(string id);

        /// <summary>
        /// Xóa nhiều đối tượng dựa trên danh sách id
        /// </summary>
        /// <param name="ids">Mảng giá trị xác định các đối tượng cần xóa</param>
        /// <returns>
        /// Trả về tổng số lượng đối tượng đã xóa thành công
        /// Ngược lại trả về 0 nếu thất bại
        /// </returns>
        int DeleteAny (string[] ids);

        /// <summary>
        /// Kiểm tra xem một giá trị cụ thể có tồn tại trong một cột của bảng tương ứng với kiểu T trong cơ sở dữ liệu.
        /// Nếu có, trả về giá trị của cột được chỉ định.
        /// </summary>
        /// <typeparam name="T">Kiểu đối tượng tương ứng với bảng trong cơ sở dữ liệu.</typeparam>
        /// <param name="column">Tên cột cần kiểm tra giá trị tồn tại.</param>
        /// <param name="value">Giá trị cần kiểm tra xem có tồn tại hay không.</param>
        /// <param name="returnColumn">Tên cột có giá trị sẽ được trả về nếu tìm thấy bản ghi.
        /// Nếu để `null`, trả về toàn bộ bản ghi.</param>
        /// <returns>
        /// Trả về giá trị của `returnColumn` nếu tồn tại bản ghi thỏa mãn, 
        /// nếu không, trả về `null`.
        /// </returns>
        object? CheckExists(string column, string value, string? returnValue);
    }
}
