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
        IEnumerable<T> Get<T>();
        IEnumerable<T> Get<T>(string column, string value);
        int? GetSumRow<T>();
        string GenerateInsertSql<T>(T obj, out DynamicParameters? parameters);
        string GenerateUpdateSql<T>(T obj, string primaryKey,  out DynamicParameters? parameters);
        int Insert<T>(T entity);
        int Update<T>(T entity, string primaryKey);
        int Delete<T>(String id);
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
