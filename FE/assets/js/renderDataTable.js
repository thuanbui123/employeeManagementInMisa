import { showDialog } from "./dialog.js";
import { getBranch } from "./header.js";
import { showPopup } from "./popup.js";
import { paginate } from "./service.js";

let data = [];
const STATE = {
    currentPage: 0,
    sumRows: '',
}

export function setData (value) {
    data = value
}

export function getData () {
    return data;
}

export function setCurrentPage (value) {
    STATE.currentPage = value;
}

export function getCurrentPage () {
    return STATE.currentPage;
}

export function setIsDesc (value) {
    localStorage.setItem('isDesc', value);
}

export function getIsDesc () {
    return localStorage.getItem('isDesc');
}

export function setLimit (value) {
    Cookies.set('rowsPerPageLimit', value, { expires: 7 });
}

export function getLimit () {
    return Cookies.get('rowsPerPageLimit');
}

export function setSumRows (value) {
    STATE.sumRows = value;
}

export function getSumRows () {
    return STATE.sumRows;
}
/**
 * Hàm hiển thị footer cho bảng dữ liệu nhân viên
 * @param {*} sumRows tổng số bản ghi hiện có để hiển thị trong footer
 */
export function createRowFooter (sumRows) {
    const ROWFOOTER = document.createElement("tr");
    ROWFOOTER.innerHTML = ''
    ROWFOOTER.innerHTML = `
        <td colspan="7">
            <div class="footer__content">
                <div class="footer__left">
                    <span>Tổng: </span>
                    <span>${sumRows}</span>
                </div>
                <div class="footer__right">
                    <span>Số bản ghi/trang</span>
                    <select id="rowsPerPage">
                        <option ${getLimit() === 10 ? 'selected': ''} value="10">10</option>
                        <option ${getLimit() === 15 ? 'selected': ''} value="15">15</option>
                        <option ${getLimit() === 20 ? 'selected': ''} value="20">20</option>
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
    
    const TABLEFOOTER = document.querySelector('.table__footer');
    TABLEFOOTER.innerHTML=''
    TABLEFOOTER.appendChild(ROWFOOTER);
    const PREVPAGE = document.getElementsByClassName('prev-page')[0];
    let updateApiWithParams = (baseUrl, branch, offset, limit, isDesc) => {
        let url = new URL(baseUrl);
        url.searchParams.set('branch', branch); 
        url.searchParams.set('offset', offset);    
        url.searchParams.set('limit', limit);      
        url.searchParams.set('is-desc', isDesc);
        return url.toString();
    };

    PREVPAGE.addEventListener('click', function () {
        setCurrentPage(getCurrentPage() - 1);
        if (getCurrentPage() >= 0) {
            let branch = getBranch();
            let limit = getLimit();
            var offset = getCurrentPage() * limit;
            var isDesc = getIsDesc();
            const UPDATEDAPI = updateApiWithParams('https://localhost:7004/api/v1/employees/paginate', branch, offset, limit, isDesc);
            paginate(UPDATEDAPI);
        } else {
            setCurrentPage(0);
        }
    });
    
    // Xử lý khi bấm nút 'Next'
    document.querySelector('.next-page').addEventListener('click', function () {
        let branch = getBranch();
        let limit = getLimit();
        var totalPage = Math.ceil(getSumRows() / limit);
        setCurrentPage(getCurrentPage() + 1);
        if (getCurrentPage() < totalPage) {
            var offset = getCurrentPage() * limit;
            var isDesc = getIsDesc();
            const UPDATEDAPI = updateApiWithParams('https://localhost:7004/api/v1/employees/paginate', branch, offset, limit, isDesc);
            paginate(UPDATEDAPI);
        } else {
            setCurrentPage(totalPage - 1);
        }
    });

    const ROWSPERPAGE = document.querySelector('#rowsPerPage');

    // Thiết lập giá trị cho select dựa trên cookie
    ROWSPERPAGE.value = getLimit();

    ROWSPERPAGE.addEventListener('change', function() {
        let branch = getBranch();
        let limit = ROWSPERPAGE.value;
        Cookies.set('rowsPerPageLimit', limit, { expires: 7 }); // Lưu vào cookie với thời gian hết hạn là 7 ngày
        // localStorage.setItem('rowsPerPageLimit', limit);
        var offset = (getCurrentPage())*limit;
        var isDesc = getIsDesc();
        const UPDATEDAPI = updateApiWithParams('https://localhost:7004/api/v1/employees/paginate', branch, offset, limit, isDesc);
        paginate(UPDATEDAPI)
    })
}

/**
 * Hàm hiển thị dữ liệu được lấy từ backend ra để hiển thị trên bảng
 * @param {*} data Dữ liệu về danh sách nhân viên cần hiển thị
 */
export function renderTable(data) {

    const TABLEBODY = document.querySelector('.table__body');
    TABLEBODY.innerHTML = '';

    data.forEach((employee, index) => {
        const ROW = document.createElement('tr');
        ROW.classList.add('row');
        ROW.innerHTML = `
            <td>${index + 1}</td> 
            <td>${employee.employeeCode}</td> 
            <td>${employee.fullName}</td> 
            <td>${employee.gender}</td> 
            <td>${(employee.dateOfBirth !== "1970-01-01T00:00:00" && employee.dateOfBirth !== null) ? new Date(employee.dateOfBirth).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}</td> 
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
        ROW.addEventListener('click', () => myFunction(index))
        ROW.ondblclick = function () {
            showPopup(data[index])    
        }
        TABLEBODY.appendChild(ROW);
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
    const ROWS = document.getElementsByClassName('row');
    
    const ACTIONEDITS = document.querySelectorAll('.actions .edit-btn');
    ACTIONEDITS.forEach(action => {
        action.style.display = 'none';
    });

    const CURRENTROW = ROWS[index];
    const CURRENTACTIONEDIT = CURRENTROW.querySelector('.actions .edit-btn');
    if (CURRENTACTIONEDIT) {
        CURRENTACTIONEDIT.style.display = 'block';
    }

    const ACTIONDELETES = document.querySelectorAll('.actions .delete-btn');
    ACTIONDELETES.forEach(action => {
        action.style.display = 'none';
    });

    const CURRENTACTIONDELETE = CURRENTROW.querySelector('.actions .delete-btn');
    if (CURRENTACTIONDELETE) {
        CURRENTACTIONDELETE.style.display = 'block';
    }

    for (let i = 0; i < ROWS.length; i++) {
        ROWS[i].classList.remove('active');
    }

    CURRENTROW.classList.add('active');
    const EDITBTN = document.getElementsByClassName('edit-btn')[index];

    EDITBTN.addEventListener('click', function() {
        showPopup(data[index])
    })

    const DELETEBTN = document.getElementsByClassName('delete-btn')[index];
    DELETEBTN.addEventListener('click', function() {
        showDialog({title: 'Xác nhận xóa?', description: `Bạn có chắc chắn muốn xóa nhân viên ${data[index].employeeCode} không?`}, index);
    });

    document.onkeydown = function(e) {
        if (e.ctrlKey && e.keyCode === 113) {
            e.preventDefault();
            showPopup(data[index])
        } else if (e.ctrlKey && e.keyCode === 46) {
            e.preventDefault();
            showDialog({title: 'Xác nhận xóa?', description: `Xóa nhân viên ${data[index].employeeCode} ra khỏi hệ thống?`} ,index);
        } else if (e.ctrlKey && e.keyCode === 118) {
            const POPUP = document.querySelector('.popup');
            POPUP.classList.remove('open');
            const DIALOGAREA = document.querySelector(".dialog-area");
            DIALOGAREA.classList.remove('open');
        }
    }
}
