import { showDialog } from "./dialogDepartment.js";
import { showPopup } from "./popupDepartment.js";

let data = [];

/**
 * Cập nhật giá trị của data
 * @param {*} value Giá trị mới cần cập nhật cho data
 */
function setData(value) {
    data = value;
}

/**
 * Lấy danh sách phòng ban
 * @returns Danh sách dữ liệu phòng ban
 */
export function getData() {
    return data;
}

/**
 * Hàm hiển thị dữ liệu được lấy từ backend ra để hiển thị trên bảng
 * @param {*} data Dữ liệu về danh sách nhân viên cần hiển thị
 */
export function renderDepartmentTable(data) {
    setData(data)
    const TABLEBODY = document.querySelector('.table__body');
    TABLEBODY.innerHTML = '';
    data.forEach((department, index) => {
        const ROW = document.createElement('tr');
        ROW.classList.add('row');
        
        ROW.innerHTML = `
                        <td style='width: 5%;'>${index + 1}</td> 
                        <td style='width: 35%;' class="departmentcode">${department.departmentCode}</td>
                        <td style='width: 60%;' class="departmentName">${department.name}</td>
                        <div class='actions'>
                            <div class="act">
                                <button class="edit-btn" style="display: none;" title="ctrl + F2">
                                    <img src="./assets/icon/info-48.png"/>
                                </button>
                                <button class="delete-btn" style="display: none;" title="delete">
                                    <img src="./assets/icon/delete-48.png"/>
                                </button>
                            </div>
                        </div>
                    `;
        ROW.addEventListener('click', () => myFunction(index))
        ROW.ondblclick = function () {
            showPopup(data[index].departmentCode)
        }
        TABLEBODY.appendChild(ROW);

        document.addEventListener('keyup', function (e) {
            if (e.keyCode === 45) {
                e.preventDefault();
                showPopup(null);
            } else if (e.ctrlKey && e.keyCode === 114) {
                document.querySelector('#search').focus();
            }
        });
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
        showPopup(data[index].departmentCode)
    })

    const DELETEBTN = document.getElementsByClassName('delete-btn')[index];
    DELETEBTN.addEventListener('click', function() {
        showDialog({title: 'Xác nhận xóa?', description: `Bạn có chắc chắn muốn xóa phòng ban ${data[index].departmentCode} không?`}, index);
    });

    document.addEventListener('keyup', function(e) {
        if (e.keyCode === 113) {
            e.preventDefault();
            showPopup(data[index].departmentCode);
        } else if (e.keyCode === 46) {
            e.preventDefault();
            showDialog({title: 'Xác nhận xóa?', description: `Xóa phòng ban ${data[index].departmentCode} ra khỏi hệ thống?`} ,index);
        } else if (e.keyCode === 120 || e.keyCode === 27) {
            e.preventDefault();
            const POPUP = document.querySelector('.popup');
            POPUP.classList.remove('open');
            const DIALOGAREA = document.querySelector(".dialog-area");
            DIALOGAREA.classList.remove('open');
        }
    });
}
