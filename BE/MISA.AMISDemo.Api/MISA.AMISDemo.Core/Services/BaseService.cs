using Microsoft.AspNetCore.Http;
using MISA.AMISDemo.Core.DTOs;
using MISA.AMISDemo.Core.Exceptions;
using MISA.AMISDemo.Core.Interfaces;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Services
{
    public class BaseService<T> : IBaseService<T> where T : class
    {
        protected IBaseRepository<T> reposity;
        public BaseService(IBaseRepository<T> reposity)
        {
            this.reposity = reposity;   
        }

        public MISAServiceResult InsertService(T entity)
        {
            //Tự sinh id mới cho đối tượng
            SetNewId(entity);
            ValidateObject(entity);

            var res = reposity.Insert(entity);
            return new MISAServiceResult();
        }

        private void SetNewId (T entity)
        {
            var className = typeof(T).Name;
            var prop = typeof(T).GetProperty($"{className}Id");
            if (prop != null && (prop.PropertyType == typeof(Guid) || prop.PropertyType == typeof(Guid?)))
            {
                prop.SetValue(entity, Guid.NewGuid());
            }
        }

        // virtual cho phép class con có thể viết lại
        protected virtual void ValidateObject(T entity)
        {

        }

        public DateTime? ProcessDate(string? dateString)
        {
            if (dateString != null)
            {
                DateTime dateValue;
                if (DateTime.TryParse(dateString, out dateValue))
                {
                    return dateValue;
                }
            }
            return null;
        }

        public string? GetCellValue(ExcelWorksheet worksheet, int row, int column)
        {
            return worksheet.Cells[row, column]?.Value?.ToString()?.Trim();
        }

        public byte[] WriteErrorLogToExcel(IFormFile fileImport, List<(int RowNumber, string ErrorMessage)> errorList)
        {
            // Tạo bộ nhớ đệm để sao chép dữ liệu từ file nhập
            using (var stream = new MemoryStream())
            {
                fileImport.CopyTo(stream); // Copy dữ liệu file vào stream

                using (var package = new ExcelPackage(stream)) //Mở file nhập dưới dạng ExcelPackage
                    using (var outputPackage = new ExcelPackage()) //Tạo file excel mới để xuất lỗi
                {
                    var worksheet = package.Workbook.Worksheets[0]; //Lấy sheet đầu tiên của file nhập
                    var outputWorksheet = outputPackage.Workbook.Worksheets.Add("Nhật ký lỗi"); //Tạo sheet mới cho file lỗi

                    var rowCount = worksheet.Dimension.Rows; // Số dòng của sheet gốc
                    var colCount = worksheet.Dimension.Columns; //Số cột của sheet gốc

                    //Sao chép dữ liệu gốc từ file nhập sang file lỗi
                    for(int row = 1; row <= rowCount; row++)
                    {
                        for(int col = 1; col <= colCount; col++)
                        {
                            if (worksheet.Cells[row, col].Value is DateTime dateValue)
                            {
                                outputWorksheet.Cells[row, col].Value = dateValue.ToString("dd/MM/yyyy");
                            }
                            else
                            {
                                outputWorksheet.Cells[row, col].Value = worksheet.Cells[row, col].Value;
                            }
                        }
                    }

                    //Đánh dấu lỗi cho từng dòng bị lỗi trong danh sách lỗi
                    foreach(var error in errorList)
                    {
                        // Đánh dấu cả dòng bị lỗi bằng màu nền đỏ
                        for (int col = 1; col <= colCount; col++)
                        {
                            outputWorksheet.Cells[error.RowNumber, col].Style.Fill.PatternType = ExcelFillStyle.Solid;
                            outputWorksheet.Cells[error.RowNumber, col].Style.Fill.BackgroundColor.SetColor(Color.Red); // Đặt màu đỏ cho toàn bộ dòng lỗi
                        }
                        outputWorksheet.Cells[error.RowNumber, colCount + 1].Value = error.ErrorMessage; // Thêm thông báo lỗi vào cột cuối
                        outputWorksheet.Cells[error.RowNumber, colCount + 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        outputWorksheet.Cells[error.RowNumber, colCount + 1].Style.Fill.BackgroundColor.SetColor(Color.Red);// Đặt màu đỏ cho ô chứa thông báo lỗi
                    }
                    return outputPackage.GetAsByteArray();
                }
            }
        }

        public byte[]? ExportExcel<K>(List<string> headers, IEnumerable<K> datas, string nameSheet) where K : class
        {
            // Thiết lập ngữ cảnh giấy phép cho ExcelPackage là không thương mại
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            // Tạo một gói Excel mới
            using (var package = new ExcelPackage())
            {
                // Thêm một worksheet mới với tên được cung cấp
                var worksheet = package.Workbook.Worksheets.Add(nameSheet);
                
                //Đặt tên tiêu đề cho các cột
                for(int i = 0; i < headers.Count; i++)
                {
                    worksheet.Cells[1, i + 1].Value = headers[i];
                }

                int row = 2;

                // Lấy phần tử đầu tiên từ danh sách dữ liệu để kiểm tra xem danh sách có rỗng không
                var firstItem = datas.FirstOrDefault();
                if (firstItem == null)
                {
                    return null;
                }

                // Lấy thông tin các thuộc tính của đối tượng đầu tiên
                PropertyInfo[] properties = firstItem.GetType().GetProperties();
                foreach (var data in datas)
                {
                    for(int i = 0; i < properties.Length; i++)
                    {

                        var property = properties[i];
                        var value = property.GetValue(data);

                        // Kiểm tra kiểu DateTime để định dạng lại
                        if (value is DateTime dateValue)
                        {
                            worksheet.Cells[row, i + 1].Value = dateValue.ToString("dd/MM/yyyy");
                        } else
                        {
                            worksheet.Cells[row, i + 1].Value = value;
                        }
                    }
                    row++;
                }

                return package.GetAsByteArray();
            }
        }
    }
}
