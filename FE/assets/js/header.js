import { getCurrentPage, getIsDesc, getLimit, setCurrentPage } from "./renderDataTable.js";
import { paginate } from "./service.js";

let branches = JSON.parse(localStorage.getItem('branches'));

export function setBranch(branch) {
    localStorage.setItem('branch', '');
    localStorage.setItem('branch', branch);
}

export function getBranch() {
    return localStorage.getItem('branch');
}

/**
 * Hàm hiển thị giao diện của header với các thành phần như logo website, bộ lọc theo chi nhánh,...
 */
function loadHeader() {
    const HEADERHTML = `
        <ul class="header-left">
            <li class="toggle-sidebar">
                <img src="./assets/img/toggle.png" />
            </li>
            <li><img class="logo-img" src="./assets/cukcuk-logo.png" /></li>
            <li class="menu">
                <select class="subnav">
                    ${
                        branches.map((branch) => {
                            return (`
                                <option ${branch.value === getBranch() ? 'selected' : ''} value="${branch.value}">
                                    Chi nhánh ${branch.value ==='find-all' ? 'tất cả chi nhánh' : branch.value}
                                </option>
                                `
                            )
                        })
                    }
                </select>
            </li>
        </ul>
        <div class="header-right">
            <img src="./assets/icon/avatar-default.png" alt="avatar" id="avatar">
            <p class="name">Bùi Văn Thuân</p>
            <button class="option">
                <img src="./assets/icon/option.png" alt="option">
            </button>
        </div>
    `;

    document.getElementById('header').innerHTML = HEADERHTML;

    const SUBNAV = document.getElementsByClassName('subnav')[0];
    SUBNAV.addEventListener('input', function() {
        setBranch(SUBNAV.value); 
        setCurrentPage(0);
        var offset = getLimit()*getCurrentPage();
        paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${getBranch()}&limit=${getLimit()}&offset=${offset}&is-desc=${getIsDesc()}`);
    });
}

document.addEventListener('DOMContentLoaded', loadHeader);

/**
 * Hàm xử lý khi nội dung HTML được tải xong. 
 * Hàm này thiết lập các sự kiện để thu gọn / mở rộng sidebar
 * khi người dùng nhấn vào nút 'toggle-sidebar'
 */
document.addEventListener('DOMContentLoaded', () => {
    const TOGGLESIDEBAR = document.getElementsByClassName('toggle-sidebar')[0]; 
    const SIDEBAR = document.getElementById('sidebar');
    if (TOGGLESIDEBAR) {
        TOGGLESIDEBAR.addEventListener('click', () => {
            SIDEBAR.classList.toggle('close');
        });
    } else {
        console.error('Toggle button not found');
    }
});

