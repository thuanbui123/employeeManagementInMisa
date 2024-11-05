let previousApi = null;

/**
 * Hàm phân trang để lấy dữ liệu từ api và cập nhật giao diện
 * @param {*} api Địa chỉ api để lấy dữ liệu
 */
const paginate = (api) => {
    if (api !== previousApi) {
        previousApi = api;
        fetch(api)
            .then(response => response.json())
            .then(data => {
                Data = data.employees;
                renderTable(data.employees);
                createRowFooter(data.sumRows);
                sumRows = data.sumRows; // Cập nhật tổng số hàng
            })
            .catch(error => {
                console.log(error);
            });
    }
};

/**
 * Mảng chí các phần tử trong bộ lọc chi nhánh
 */
const branchOptions = [
    {
        value: 'Hà Nội'
    },
    {
        value: 'TP. Hồ Chí Minh'
    },
    {
        value: 'find-all'
    }
]

//Lưu các các phần tử chi nhánh vào localStorage
localStorage.setItem('branches', JSON.stringify(branchOptions));

