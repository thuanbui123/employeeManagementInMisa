import { toast } from "./toast.js";

const MAX_SELECTED_COLUMNS = 6;
/**
 * Hàm lấy danh sách các cột 
 * @returns danh sách các cột lưu trên localStorage với key là columns
 */
export function getColumns () {
    return JSON.parse(localStorage.getItem('columns'));
}

/**
 * Hàm lưu lại mảng các cột được hiển thị lên localStorage
 * @param {*} columns mảng các cột mà người dùng chọn
 */
export function setColumnSelected (columns) {
    localStorage.setItem('columnSelected', JSON.stringify(columns));
}

/**
 * Hàm lấy ra mảng các cột được hiển thị lưu trên localStorage
 */
export function getColumnSelected () {
    return JSON.parse(localStorage.getItem('columnSelected'));
}

/**
 * Lọc các cột được chọn theo mảng các cột lưu trong localStorage
 * @returns Mảng các cột được chọn sau lọc
 */
export function filterColumnSelected () {
    const COLUMNS = getColumns();
    const COLUMNSELECTED = getColumnSelected();
    return COLUMNS.filter(item => COLUMNSELECTED.includes(item.index));
}

/**
 * Hàm tạo và bắt các sự kiện cho các thành phần của trang cài đặt
 */
export function loadSettingPage() {
    const COLUMNLIST = getColumns();
    // Tách các mục lẻ và chẵn thành hai mảng riêng biệt
    const oddItems = COLUMNLIST.filter((_, index) => index % 2 === 0);
    const evenItems = COLUMNLIST.filter((_, index) => index % 2 !== 0);
    let columnSelected = getColumnSelected();

    // Tạo HTML cho hai cột riêng
    const oddColumnHTML = oddItems.map(item => `
        <label>
            <input type="checkbox" value="${item.index}" ${columnSelected.includes(item.index) ? 'checked' : ''}>
            ${item.label}
        </label>
    `).join('');

    const evenColumnHTML = evenItems.map(item => `
        <label>
            <input type="checkbox" value="${item.index}" ${columnSelected.includes(item.index) ? 'checked' : ''}>
            ${item.label}
        </label>
    `).join('');

    // Hiển thị hai cột
    const resultHTML = `
    <div style="display: flex; align-item: center; justify-content: space-between">
        <div>${oddColumnHTML}</div>
        <div>${evenColumnHTML}</div>
    </div>
    `;
    const SETTINGPAGEHTML = `
        <div class="settings-container">
            <h2>Cài Đặt Hiển Thị Bảng</h2>
        
            <div class="column-selector">
                <button id="select-all-btn">Chọn theo mặc định</button>
                <button id="deselect-all-btn">Bỏ chọn tất cả</button>
                
                <div id="columnSelector">
                    
                    ${
                        resultHTML
                    }
                </div>
            </div>
        
            <div class="actions">
                <button id="saveBtn">Áp dụng</button>
                <button id="cancelBtn">Hủy</button>
            </div>
        </div>
    `;
    document.getElementById('container').innerHTML = '';
    document.getElementById('container').innerHTML = SETTINGPAGEHTML;
    // Giới hạn số lượng cột có thể chọn
    updateColumnSelection();
    const COLUMNCHECKBOXES = document.querySelectorAll('#columnSelector input[type="checkbox"]');

    // Lắng nghe sự kiện thay đổi trên mỗi checkbox
    COLUMNCHECKBOXES.forEach(checkbox => {
        checkbox.addEventListener('change', updateColumnSelection);
    });

    initAction();
}

// Hàm kiểm tra số lượng cột đã chọn
function updateColumnSelection() {
    const COLUMNCHECKBOXES = document.querySelectorAll('#columnSelector input[type="checkbox"]');
    const SELECTEDCOUNT = Array.from(COLUMNCHECKBOXES).filter(checkbox => checkbox.checked).length;

    // Nếu đã đạt đến giới hạn tối đa
    if (SELECTEDCOUNT >= MAX_SELECTED_COLUMNS) {
        COLUMNCHECKBOXES.forEach(checkbox => {
            // Chỉ vô hiệu hóa các checkbox chưa chọn
            if (!checkbox.checked) {
                checkbox.disabled = true;
            }
        });
    } else {
        // Kích hoạt lại tất cả các checkbox nếu chưa đạt đến giới hạn
        COLUMNCHECKBOXES.forEach(checkbox => {
            checkbox.disabled = false;
        });
    }
}

/**
 * Hàm bắt sự kiện cho các nút bấm của trang cài đặt
 */
function initAction () {
    const DESELECT = document.querySelector('#deselect-all-btn');
    DESELECT.addEventListener('click', function () {
        const COLUMNCHECKBOXES = document.querySelectorAll('#columnSelector input[type="checkbox"]');
        COLUMNCHECKBOXES.forEach(item => {
            item.checked = false;
        });
        updateColumnSelection();
    });

    const SELECTEDDEFAULTBTN = document.querySelector('#select-all-btn');
    SELECTEDDEFAULTBTN.addEventListener('click', function() {
        const DEFAULTSELECTED = [1, 2, 3, 4, 5, 6];
        setColumnSelected(DEFAULTSELECTED);
        loadSettingPage();
    });

    const saveBtn = document.querySelector('#saveBtn');
    saveBtn.addEventListener('click', function () {
        const COLUMNCHECKBOXES = document.querySelectorAll('#columnSelector input[type="checkbox"]');
        let columnChecked = Array.from(COLUMNCHECKBOXES).filter(checkbox => checkbox.checked);
        if (columnChecked.length < MAX_SELECTED_COLUMNS) {
            toast({title: 'Thất bại', message: `Số cột được chọn nhỏ hơn ${MAX_SELECTED_COLUMNS}!`, type: 'error'});
        } else {
            let selectedValues = columnChecked.map(checkbox => Number(checkbox.value));
            setColumnSelected(selectedValues);
            toast({title: 'Thành công', message: `Thiết lập bảng thành công`, type: 'success'});
        }
    });
}

/**
 * Hàm sắp xếp danh sách 
 * @param {*} list - Danh sách cần sắp xếp
 * @returns Danh sách đã được sắp xếp theo thứ tự tăng dần
 */
function sortList (list) {
    return list.sort((a, b) => a.index - b.index);
}

