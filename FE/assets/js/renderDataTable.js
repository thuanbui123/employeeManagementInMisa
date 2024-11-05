let Data = []
let currentPage = 0;
let limit = 10;

/**
 * Hàm hiển thị footer cho bảng dữ liệu nhân viên
 * @param {*} sumRows tổng số bản ghi hiện có để hiển thị trong footer
 */
function createRowFooter (sumRows) {
    const rowFooter = document.createElement("tr");
    rowFooter.innerHTML = ''
    rowFooter.innerHTML = `
        <td colspan="7">
            <div class="footer__content">
                <div class="footer__left">
                    <span>Tổng: </span>
                    <span>${sumRows}</span>
                </div>
                <div class="footer__right">
                    <span>Số bản ghi/trang</span>
                    <select id="rowsPerPage">
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                    <div class="change-page">
                        <button class='prev-page'>
                            <i class="icofont-simple-left"></i>
                        </button>
                        <button class='next-page'>
                            <i class="icofont-simple-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </td>
    `
    
    const tableFooter = document.querySelector('.table__footer');
    tableFooter.innerHTML=''
    tableFooter.appendChild(rowFooter);
    const prevPage = document.getElementsByClassName('prev-page')[0];
    const updateApiWithParams = (baseUrl, branch, offset, limit) => {
        const url = new URL(baseUrl);
        url.searchParams.set('branch', branch); 
        url.searchParams.set('offset', offset);    // Thay đổi giá trị offset
        url.searchParams.set('limit', limit);      // Thay đổi giá trị limit
        return url.toString();
    };

    prevPage.addEventListener('click', function () {
        currentPage--;
        if (currentPage >= 0) {
            var offset = currentPage * limit;
            const updatedApi = updateApiWithParams('https://localhost:7004/api/v1/employees/paginate', branch, offset, limit);
            paginate(updatedApi);
        } else {
            currentPage = 0;
        }
    });
    
    // Xử lý khi bấm nút 'Next'
    document.querySelector('.next-page').addEventListener('click', function () {
        var totalPage = Math.ceil(sumRows / limit);
        currentPage++;
        if (currentPage < totalPage) {
            var offset = currentPage * limit;
            const updatedApi = updateApiWithParams('https://localhost:7004/api/v1/employees/paginate', branch, offset, limit);
            paginate(updatedApi);
        } else {
            currentPage = totalPage - 1;
        }
    });

    const rowsPerPage = document.querySelector('#rowsPerPage');

    const savedLimit = Cookies.get('rowsPerPageLimit');
    if (savedLimit) {
        limit = parseInt(savedLimit);
    }

    // Thiết lập giá trị cho select dựa trên cookie
    rowsPerPage.value = limit;

    rowsPerPage.addEventListener('change', function() {
        limit = rowsPerPage.value;
        Cookies.set('rowsPerPageLimit', limit, { expires: 7 }); // Lưu vào cookie với thời gian hết hạn là 7 ngày
        // localStorage.setItem('rowsPerPageLimit', limit);
        var offset = (currentPage)*limit;
        const updatedApi = updateApiWithParams('https://localhost:7004/api/v1/employees/paginate', branch, offset, limit);
        paginate(updatedApi)
    })
}

/**
 * Hàm hiển thị dữ liệu được lấy từ backend ra để hiển thị trên bảng
 * @param {*} data Dữ liệu về danh sách nhân viên cần hiển thị
 */
function renderTable(data) {

    const tableBody = document.querySelector('.table__body');
    tableBody.innerHTML = '';

    data.forEach((employee, index) => {
        const row = document.createElement('tr');
        row.classList.add('row');
        row.innerHTML = `
            <td>${index + 1}</td> 
            <td>${employee.employeeCode}</td> 
            <td>${employee.fullName}</td> 
            <td>${employee.gender}</td> 
            <td>${new Date(employee.dateOfBirth).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td> 
            <td>${employee.email}</td> 
            <td class="actions">
                <span class="${(employee.address !== 'null' && employee.address !== null) ? '' : 'empty-address'}">
                    ${(employee.address !== 'null' && employee.address !== null) ? employee.address : ''}
                </span>
                <div class ='act'>
                    <button class="edit-btn" style="display: none;" data-tooltip="Ctrl + F2">
                        <img src="./assets/icon/info-48.png"/>
                    </button>
                    <button class="delete-btn" style="display: none;" data-tooltip="delete">
                        <img src="./assets/icon/delete-48.png"/>
                    </button>
                </div>
            </td> 
            
               `;
        row.addEventListener('click', () => myFunction(index))
        row.ondblclick = function () {
            showPopup(Data[index])    
        }
        tableBody.appendChild(row);
    });
}

/**
 * Xử lý các hành động cho hàng trong bảng dựa trên chỉ số hàng đã cho
 * Hiển thị nút chỉnh sửa và xóa cho hàng đã chọn, đồng thời ẩn các nút cho các hàng khác
 * Đánh dấu hàng đang được chọn và thiết lập sự kiện cho các nút
 * Để thực hiện hành động sửa hoặc xóa
 * @param {*} index 
 */
function myFunction(index) {
    const rows = document.getElementsByClassName('row');
    
    const actionEdits = document.querySelectorAll('.actions .edit-btn');
    actionEdits.forEach(action => {
        action.style.display = 'none';
    });

    const currentRow = rows[index];
    const currentActionEdit = currentRow.querySelector('.actions .edit-btn');
    if (currentActionEdit) {
        currentActionEdit.style.display = 'block';
    }

    const actionDeletes = document.querySelectorAll('.actions .delete-btn');
    actionDeletes.forEach(action => {
        action.style.display = 'none';
    });

    const currentActionDelete = currentRow.querySelector('.actions .delete-btn');
    if (currentActionDelete) {
        currentActionDelete.style.display = 'block';
    }

    for (let i = 0; i < rows.length; i++) {
        rows[i].classList.remove('active');
    }

    currentRow.classList.add('active');
    const editBtn = document.getElementsByClassName('edit-btn')[index];

    editBtn.addEventListener('click', function() {
        showPopup(Data[index])
    })

    const deleteBtn = document.getElementsByClassName('delete-btn')[index];
    deleteBtn.addEventListener('click', function() {
        showDialog({title: 'Xác nhận xóa?', description: `Bạn có chắc chắn muốn xóa nhân viên ${Data[index].employeeCode} không?`}, index);
    });

    document.onkeydown = function(e) {
        if (e.ctrlKey && e.keyCode === 113) {
            e.preventDefault();
            showPopup(Data[index])
        } else if (e.ctrlKey && e.keyCode === 46) {
            e.preventDefault();
            showDialog({title: 'Xác nhận xóa?', description: `Xóa nhân viên ${Data[index].employeeCode} ra khỏi hệ thống?`} ,index);
        } else if (e.ctrlKey && e.keyCode === 118) {
            const popup = document.querySelector('.popup');
            popup.classList.remove('open');
            const dialogArea = document.querySelector(".dialog-area");
            dialogArea.classList.remove('open');
        }
    }
}
