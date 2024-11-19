import { loadFilterHTML } from "./filter.js";
import { getBranch, setBranch } from "./header.js";
import { showImportEmployee } from "./importEmployeePage.js";
import { showPopup } from "./popup.js";
import { getCurrentPage, getIsDesc, getLimit, setCurrentPage, setIsDesc } from "./renderDataTable.js";
import { paginate } from "./service.js";
import { filterColumnSelected } from "./settingPage.js";

let timeoutId;

/**
 * Hàm hiển thị giao diện quản lý nhân viên, bao gồm các phần tử giao diện như
 * tiêu đề, bảng dữ liệu và các nút chức năng(Thêm mới, REFRESH, nhập khẩu, xuất khẩu nhân viên)
 * Đồng thời hàm cũng thêm các sự kiện cho các nút này để xử lý các thao tác tương ứng
 */
export function loadContainer() {
    const CONTAINERHTML = `
        <div class="sub-header">
                <p class="title">Quản lý Nhân viên</p>
                <button class="add" title ="ins">
                    <img src="./assets/icon/add.png" alt="Thêm mới"/>
                    <p>Thêm mới</p>
                </button>
        </div>
        <div class="content">
            <div class="content__header">
                <div class="header__left">
                    <input type="text" name="search" id="search" placeholder="Tìm kiếm theo mã, họ tên" title="ctrl+F3">
                    <img src="./assets/icon/search.png" alt="Tìm kiếm" />
                </div>
                <div class="header__right">
                    <button class="import">
                        <img src="./assets/icon/import.png" alt="import">
                    </button>
                    <button class="export">
                        <img src="./assets/icon/export-excel-50.png" alt="export">
                    </button>
                    <button class="filter-btn">
                        <i class="icofont-filter"></i>
                    </button>
                    <button class="refresh">
                        <img src="./assets/icon/refresh.png" alt="refresh">
                    </button>
                </div>
            </div>
            <div class="content__body">
                <table class="table">
                    <thead class="header">
                        <th>STT</th>
                        ${renderTableHeader()}
                    </thead>
                    <tbody class="table__body">
                    </tbody>
                    <tfoot class="table__footer">
                        
                    </tfoot>
                </table>
            </div>
        </div>
        <div class="popup"></div>
        <div class="dialog-area"></div>
        <div class="ie-wrapper"></div>      
    `;
    document.getElementById('container').innerHTML = '';
    document.getElementById('container').innerHTML = CONTAINERHTML;
    const REFRESH = document.getElementsByClassName('refresh')[0];
    REFRESH.addEventListener('click', function () {
        let limit;
        const SAVEDLIMIT = Cookies.get('rowsPerPageLimit');
        if (SAVEDLIMIT) {
            limit = parseInt(SAVEDLIMIT);
        }
        setCurrentPage(0);
        var offset = (getCurrentPage())*limit;
        paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${getBranch()}&limit=${limit}&offset=${offset}&is-desc=${getIsDesc()}`);
    });

    const THCODE = document.querySelector('.th-code');
    if (THCODE) {
        THCODE.addEventListener('click', function() {
            if (document.querySelector('.th-code.active')) {
                setIsDesc(false);
                THCODE.classList.remove('active');
            } else {
                setIsDesc(true);
                THCODE.classList.add('active');
            }
            var offset = getCurrentPage()*getLimit();
            paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${getBranch()}&limit=${getLimit()}&offset=${offset}&is-desc=${getIsDesc()}`);
        });
    }

    const IMPORTBTN = document.getElementsByClassName('import')[0];
    // IMPORTBTN.addEventListener('click', function() {
    //     document.getElementById('fileInput').click();
    // });

    IMPORTBTN.addEventListener('click', function () {
        showImportEmployee()
    });

    const FILTERBTN = document.getElementsByClassName('filter-btn')[0];
    FILTERBTN.addEventListener('click', function () {
        loadFilterHTML()
    });

    const EXPORTBTN = document.querySelector('.export');
    EXPORTBTN.addEventListener('click', async function () {
        try {
            const RESPONSE = await fetch(`https://localhost:7004/api/v1/employees/export-excel?branch=${getBranch()}`, {
                method: "GET",
            });
            if (RESPONSE.ok) {
                //Đọc dữ liệu dưới dạng Blob
                const BLOB = await RESPONSE.blob();

                // Tạo URL từ Blob để tải xuống
                const URL = window.URL.createObjectURL(BLOB);

                // Tạo thẻ a để tải file
                const A = document.createElement("a");
                A.href = URL;
                A.download = "ExportData.xlsx"; // Tên file
                document.body.appendChild(A);
                A.click();

                // Xóa URL và thẻ a sau khi tải xuống
                window.URL.revokeObjectURL(URL);
                document.body.removeChild(A);
            } else {
                alert("Tải file không thành công");
            }
        } catch (error) {
            alert('Lỗi: ', error);
        }
    });

    const ADDBTN = document.getElementsByClassName('add')[0];

    // showPopup(ADDBTN)
    ADDBTN.addEventListener('click', function () {
        showPopup(null);
    });

    function handleInputChange(event) {
        const QUERY = event.target.value;
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            searchEmployee(QUERY)
        }, 200)
    }
    
    document.getElementById('search').addEventListener('input', handleInputChange);
}

export function searchEmployee(query) {
    var offset = 0*getLimit();
    if (query !== '') {
        paginate(`https://localhost:7004/api/v1/employees/search?value=${query}&branch=${getBranch()}&limit=${getLimit()}&offset=${offset}&is-desc=${getIsDesc()}`);
    } else {
        paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${getBranch()}&limit=10&offset=${offset}&is-desc=${getIsDesc()}`);
    }
}

/**
 * Hàm tạo các cột tiêu đề các cột trong bảng
 * Dựa trên mảng các cột được chọn
 */
function renderTableHeader () {
    let columns = filterColumnSelected();
    return columns.map (column => {
        return `<th class="${column.key === 'employeeCode' ? 'th-code' : ''} ${getIsDesc() === 'true' ? 'active' : ''}">
              ${column.label}
              ${column.key === 'employeeCode' ? '<i class="icofont-caret-up"></i>' : ''}
            </th>`;
    }).join('');
}