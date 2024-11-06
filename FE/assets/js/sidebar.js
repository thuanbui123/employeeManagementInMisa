import { LoadContainer } from "./employeePage.js";
import { setPreviousApi, paginate } from "./service.js";
import { setBranch, getBranch } from "./header.js";

/**
 * Hàm hiển thị sidebar với các mục điều hướng
 */
export function loader() {
    const sidebarHTML = `
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

    document.getElementById('sidebar').innerHTML = sidebarHTML;
}

document.addEventListener('DOMContentLoaded', loader);
document.addEventListener('DOMContentLoaded', () => document.getElementById('container').innerHTML = `<h3>Trang chủ</h3>`);

/**
 * Khi dom được tải xong, thiết lập các sự kiện click cho các mục trong sidebar
 */
document.addEventListener('DOMContentLoaded', () => {
    const items = document.getElementsByClassName('item');
    Array.from(items).forEach(item => {
        item.addEventListener('click', function () {
            //Thêm sự kiện click cho từng mục
            Array.from(items).forEach(i => i.classList.remove('active'));
            const page = this.getAttribute('data-page');
            const container = document.getElementById('container');
            switch (page) {
                case 'Employee':
                    LoadContainer();
                    setPreviousApi('')
                    let limit;
                    const savedLimit = Cookies.get('rowsPerPageLimit');
                    if (savedLimit) {
                        limit = parseInt(savedLimit);
                    }
                    paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${getBranch()}&limit=${limit}&offset=0`);
                    break;
                case 'Home':
                    setPreviousApi('')
                    container.innerHTML = `<h3>Trang chủ</h3>`
                    break;
                case 'Report':
                    setPreviousApi('')
                    renderReport();
                    break;
                case 'Setting':
                    setPreviousApi('')
                    container.innerHTML = `<h3>Trang cài đặt</h3>`
            }
            this.classList.add('active');
        });
    });

    // Thiết lập sự kiện click cho nút thu nhỏ sidebar
    const shrinks = document.querySelector('.shrink');
    shrinks.addEventListener('click', function () {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('close');
    })
});