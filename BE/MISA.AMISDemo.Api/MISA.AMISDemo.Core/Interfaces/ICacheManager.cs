using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Interfaces
{
    public interface ICacheManager
    {
        /// <summary>
        /// Thêm dữ liệu vào cache với một key duy nhất được tạo ra từ GUID
        /// </summary>
        /// <param name="data">Dữ liệu cần lưu trữ trong cache</param>
        /// <param name="expirationMinutes">Thời gian hết hạn của mục cache, tính bàng phút. Giá trị mặc định là 30 phút</param>
        /// <returns>
        ///     Trả về key cache dưới dạng chuỗi, dùng để truy xuất lại mục cache sau này
        /// </returns>
        string AddToCache(object data, double expirationMinutes = 30);

        /// <summary>
        /// Lấy dữ liệu được lưu ở trong cache dựa trên key cache
        /// </summary>
        /// <param name="cacheKey">Key của dữ liệu lưu trong cache</param>
        /// <returns>
        ///     Trả về đối tượng được lưu trong cache. Nếu không tìm thấy trả về null
        /// </returns>
        object? GetFromCache(string cacheKey);

        /// <summary>
        /// Xóa dữ liệu được lưu trong cache dựa trên key cache
        /// </summary>
        /// <param name="cacheKey">Key cache của dữ liệu cần xóa</param>
        void RemoveFromCache (string cacheKey);
    }
}
