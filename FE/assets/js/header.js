import { getLimit, setCurrentPage } from "./renderDataTable.js";
import { paginate } from "./service.js";

let branches = JSON.parse(localStorage.getItem('branches'));

export const setBranch = (branch) => {
    localStorage.setItem('branch', '');
    localStorage.setItem('branch', branch);
}

export const getBranch = () => {
    return localStorage.getItem('branch');
}

/**
 * Hàm hiển thị giao diện của header với các thành phần như logo website, bộ lọc theo chi nhánh,...
 */
function loadHeader() {
    const headerHTML = `
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

    document.getElementById('header').innerHTML = headerHTML;

    const subnav = document.getElementsByClassName('subnav')[0];
    subnav.addEventListener('input', function() {
        setBranch(subnav.value); 
        setCurrentPage(0)
        paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${getBranch()}&limit=${getLimit()}&offset=0`);
    });
}

document.addEventListener('DOMContentLoaded', loadHeader);

/**
 * Hàm xử lý khi nội dung HTML được tải xong. 
 * Hàm này thiết lập các sự kiện để thu gọn / mở rộng sidebar
 * khi người dùng nhấn vào nút 'toggle-sidebar'
 */
document.addEventListener('DOMContentLoaded', () => {
    const toggleSidebar = document.getElementsByClassName('toggle-sidebar')[0]; 
    const sidebar = document.getElementById('sidebar');
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', () => {
            sidebar.classList.toggle('close');
        });
    } else {
        console.error('Toggle button not found');
    }
});

