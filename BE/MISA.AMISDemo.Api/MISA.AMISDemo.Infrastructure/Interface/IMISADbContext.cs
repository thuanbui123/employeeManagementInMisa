using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Infrastructure.Interface
{
    public interface IMISADbContext
    {
        IDbConnection Connection { get; }
        IDbTransaction Transaction { get; set; }

        /// <summary>
        /// Lấy toàn bộ danh sách bản ghi từ cơ sở dữ liệu.
        /// </summary>
        /// <typeparam name="T">Kiểu đối tượng tương ứng với bảng trong cơ sở dữ liệu.</typeparam>
        /// <returns>Danh sách các bản ghi.</returns>
        IEnumerable<T> Get<T>();

        /// <summary>
        /// Lấy danh sách các bản ghi từ cơ sở dữ liệu với điều kiện của thể
        /// </summary>
        /// <typeparam name="T">Kiểu đối tượng tương tự với bảng trong cơ sở dữ liệu</typeparam>
        /// <param name="column">
        /// Tên cột cần lọc
        /// </param>
        /// <param name="value">Giá trị của cột cần lọc</param>
        /// <returns>
        /// Danh sách các bảng ghi thỏa mãn điều kiện
        /// </returns>
        IEnumerable<T> Get<T>(string column, string value);

        /// <summary>
        /// Lấy tổng số bản ghi của một bảng trong cơ sở dữ liệu
        /// </summary>
        /// <typeparam name="T">Kiểu đối tượng tự bảng trong cơ sở dữ liệu</typeparam>
        /// <returns>Tổng số bản ghi</returns>
        int? GetSumRow<T>();

        /// <summary>
        /// Sinh câu lệnh SQL để chèn bản ghi mới vào cơ sở dữ liệu
        /// </summary>
        /// <typeparam name="T">Kiểu dữ liệu của đối tượng obj chứa thông tin cần thêm mới</typeparam>
        /// <param name="obj">Đối tượng chứa dữ liệu cần thêm vào cơ sở dữ liệu</param>
        /// <param name="parameters">Đối tượng 'DynamicParameters' chứa các tham số tương ứng với câu lệnh SQL
        /// Được trả về dưới dạng out và có thể là null nếu không có tham số
        /// </param>
        /// <returns>
        /// Câu lệnh SQL insert
        /// </returns>
        string GenerateInsertSql<T>(T obj, out DynamicParameters? parameters);

        /// <summary>
        /// Sinh câu lệnh để cập nhật dữ liệu của một bảng ghi trong cơ sở dữ liệu
        /// </summary>
        /// <typeparam name="T">Kiểu dữ liệu của đối tượng obj chứa thông tin cần sửa</typeparam>
        /// <param name="obj">Đối tượng chứa dữ liệu cần sửa</param>
        /// <param name="primaryKey">Tên cột khóa chính được dùng để xác định bảng ghi cần sửa</param>
        /// <param name="parameters">Đối tượng 'DynamicParameters' chứa các tham số tương ứng với câu lệnh SQL
        /// Được trả về dưới dạng out và có thể là null nếu không có tham số
        /// </param>
        /// <returns>Chuỗi SQL dạng 'UPDATE' để cập nhật dữ liệu từ 'obj' vào cơ sở dữ liệu</returns>
        string GenerateUpdateSql<T>(T obj, string primaryKey,  out DynamicParameters? parameters);

        /// <summary>
        /// Chèn đối tượng entity vào cơ sở dữ liệu
        /// </summary>
        /// <typeparam name="T">Kiểu dữ liệu của đối tượng cần chèn</typeparam>
        /// <param name="entity">Đối tượng chứa dữ liệu cần chèn</param>
        /// <returns>
        /// 1 - nếu chèn thành công.
        /// Ngược lại, trả về 0
        /// </returns>
        int Insert<T>(T entity);

        /// <summary>
        /// Cập nhật bảng ghi trong cơ sở dữ liệu
        /// </summary>
        /// <typeparam name="T">Kiểu dữ liệu của đối tượng cần cập nhật</typeparam>
        /// <param name="entity">Đối tượng chứa dữ liệu cần cập nhật</param>
        /// <param name="primaryKey">Giá trị để xác định đối tượng cần cập nhật</param>
        /// <returns>
        /// 1 - nếu cập nhật thành công.
        /// Ngược lại, trả về 0
        /// </returns>
        int Update<T>(T entity, string primaryKey);

        /// <summary>
        /// Thực hiện xóa một bảng ghi trong cơ sở dữ liệu
        /// </summary>
        /// <typeparam name="T">Kiểu dữ liệu của đối tượng cần xóa</typeparam>
        /// <param name="id">Giá trị xác định đối tượng cần xóa</param>
        /// <returns>
        /// 1- nếu xóa thành công.
        /// Ngược lại, trả về 0.
        /// </returns>
        int Delete<T>(String id);

        /// <summary>
        /// Thực hiện xóa một mảng đối tượng trong cơ sở dữ liệu
        /// </summary>
        /// <typeparam name="T">Kiểu dữ liệu của đối tượng cần xóa</typeparam>
        /// <param name="ids">Mảng chứa giá trị xác định đối tượng cần xóa</param>
        /// <returns>
        /// Trả về số bảng ghi bị xóa
        /// </returns>
        int DeleteAny<T>(string[] ids);
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
        object? CheckExists<T>(string column, string value, string? returnColumn);
    }
}
