using Microsoft.AspNetCore.Http;
using MISA.AMISDemo.Core.DTOs;
using OfficeOpenXml;

namespace MISA.AMISDemo.Core.Interfaces
{
    public interface IBaseService<T> where T : class
    {
        /// <summary>
        /// Thực hiện thêm mới một đối tượng vào cơ sở dữ liệu
        /// </summary>
        /// <param name="entity">Đối tượng cần thêm vào cơ sở dữ liệu</param>
        /// <returns>
        ///     Kết quả của quá trình thêm, được đóng gói trong đối tượng MISAServiceResult
        /// </returns>
        MISAServiceResult InsertService(T entity);

        /// <summary>
        /// Chuyển đổi một chuỗi ngày thành đối tượng DateTime
        /// </summary>
        /// <param name="dateString">Chuỗi chứa ngày tháng cần chuyển đổi</param>
        /// <returns>
        /// Trả về đối tượng DateTime nếu chuyển đổi thành công
        /// Nếu param dateString null hoặc chuyển đổi không thành công thì trả về null
        /// </returns>
        DateTime? ProcessDate(string? dateString);

        /// <summary>
        /// Lấy giá trị từ ô trong bảng tính excel, loại bỏ khoảng trắng ở đầu và cuối
        /// </summary>
        /// <param name="worksheet">Đối tượng Worksheet đại diện cho bảng tính excel</param>
        /// <param name="row">Số hàng của ô cần lấy giá trị</param>
        /// <param name="column">Số cột của ô cần lấy giá trị</param>
        /// <returns>
        ///     Giá trị của ô dưới dạng chuỗi đã loại bỏ khoảng trắng hoặc null nếu ô không có giá trị
        /// </returns>
        string? GetCellValue(ExcelWorksheet worksheet, int row, int column);

        /// <summary>
        /// Tạo file Excel dưới dạng mảng byte chứa thông tin lỗi cho các dòng không hợp lệ trong file nhập khẩu
        /// Dữ liệu gốc từ file nhập sẽ được sao chép vào file lỗi, các dòng bị lỗi sẽ được đánh dấu màu đỏ và hiển thị thông báo lỗi
        /// </summary>
        /// <param name="fileImport">File nhập khẩu dạng IFormFile cần kiểm tra và xuất thông tin lỗi</param>
        /// <param name="errorList">Danh sách lỗi, bao gồm số dòng và thông báo lỗi tương ứng</param>
        /// <returns></returns>
        byte[] WriteErrorLogToExcel(IFormFile fileImport, List<(int RowNumber, string ErrorMessage)> errorList);

        /// <summary>
        /// Xuất dữ liệu từ một danh sách đối tượng thành tệp excel
        /// </summary>
        /// <param name="headers">Danh sách tiêu đề của các cột cho sheet excel</param>
        /// <param name="datas">Danh sách các đối tượng dữ liệu để xuất</param>
        /// <param name="nameSheet">Tên của sheet trong tệp excel</param>
        /// <returns>Trả về mảng byte[] của tệp excel hoặc null nếu không có dữ liệu</returns>
        byte[]? ExportExcel<K>(List<string> headers, IEnumerable<K> datas, string nameSheet) where K : class;
    }
}
