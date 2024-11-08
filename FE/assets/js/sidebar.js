import { LoadContainer } from "./employeePage.js";
import { setPreviousApi, paginate } from "./service.js";
import { getBranch } from "./header.js";
import { getCurrentPage, getIsDesc, getLimit } from "./renderDataTable.js";

/**
 * Hàm hiển thị sidebar với các mục điều hướng
 */
export function loader() {
    const SIDEBARHTML = `
        <ul class="menu-sidebar">
            <li class="item active" data-page="Home" data-tooltip="Trang chủ">
                <img src="./assets/icon/dashboard.png" alt="Home"/>
                <p>Trang chủ</p>
            </li>
            <li class="item" data-page="Report" data-tooltip="Báo cáo">
                <img src="./assets/icon/report.png" alt="Home"/>
                <p>Báo cáo</p>
            </li>
            <li class="item" data-page="Employee" data-tooltip="Nhân viên">
                <img src="./assets/icon/dic-employee.png" alt="Home"/>
                <p>Nhân viên</p>
            </li>
            <li class="item" data-page="Setting" data-tooltip="Cài đặt">
                <img src="./assets/icon/setting.png" alt="Home"/>
                <p>Cài đặt</p>
            </li>
        </ul>
        <button class= "shrink">
            <i class="icofont-rounded-left icon"></i>
            <span>Thu nhỏ</span>
        </button>
    `;

    document.getElementById('sidebar').innerHTML = SIDEBARHTML;
}

document.addEventListener('DOMContentLoaded', loader);
document.addEventListener('DOMContentLoaded', () => document.getElementById('container').innerHTML = `<h3>Trang chủ</h3>`);

/**
 * Khi dom được tải xong, thiết lập các sự kiện click cho các mục trong sidebar
 */
document.addEventListener('DOMContentLoaded', () => {
    const ITEMS = document.getElementsByClassName('item');
    Array.from(ITEMS).forEach(item => {
        item.addEventListener('click', function () {
            //Thêm sự kiện click cho từng mục
            Array.from(ITEMS).forEach(i => i.classList.remove('active'));
            const PAGE = this.getAttribute('data-page');
            const CONTAINER = document.getElementById('container');
            switch (PAGE) {
                case 'Employee':
                    LoadContainer();
                    setPreviousApi('')
                    let limit;
                    const SAVEDLIMIT = Cookies.get('rowsPerPageLimit');
                    if (SAVEDLIMIT) {
                        limit = parseInt(SAVEDLIMIT);
                    }
                    var offset = getLimit() * getCurrentPage();
                    paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${getBranch()}&limit=${limit}&offset=${offset}&is-desc=${getIsDesc()}`);
                    break;
                case 'Home':
                    setPreviousApi('')
                    CONTAINER.innerHTML = `<h3>Trang chủ</h3>`
                    break;
                case 'Report':
                    setPreviousApi('')
                    renderReport();
                    break;
                case 'Setting':
                    setPreviousApi('')
                    CONTAINER.innerHTML = `<h3>Trang cài đặt</h3>`
            }
            this.classList.add('active');
        });
    });

    // Thiết lập sự kiện click cho nút thu nhỏ sidebar
    const SHRINKS = document.querySelector('.shrink');
    SHRINKS.addEventListener('click', function () {
        const SIDEBAR = document.getElementById('sidebar');
        SIDEBAR.classList.toggle('close');
    })
});