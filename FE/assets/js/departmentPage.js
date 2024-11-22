import { showPopup } from "./popupDepartment.js";
import { renderDepartmentTable } from "./renderTableDepartment.js";
import { fetchData } from "./service.js";
import { toast } from "./toast.js";

let timeoutId;

export function loadDepartment() {
    const DEPARTMENTHTML = `
        <div class="sub-header">
                <p class="title">Quản Lý Phòng Ban</p>
                <button class="add" title ="ins">
                    <img src="./assets/icon/add.png" alt="Thêm mới"/>
                    <p>Thêm mới</p>
                </button>
        </div>
        <div class="content">
            <div class="content__header">
                <div class="header__left">
                    <input type="text" name="search" id="search" placeholder="Tìm kiếm theo mã, tên phòng ban" title="ctrl+F3">
                    <img src="./assets/icon/search.png" alt="Tìm kiếm" />
                </div>
                <div class="header__right">
                    <button class="refresh">
                        <img src="./assets/icon/refresh.png" alt="refresh">
                    </button>
                </div>
            </div>
            <div class="content__body">
                <table class="table">
                    <thead class="header">
                        <th style='width: 5%;'>STT</th>
                        <th style='width: 35%;'>Mã phòng ban</th>
                        <th style='width: 60%;'>Tên phòng ban</th>
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
    document.getElementById('container').innerHTML = DEPARTMENTHTML;
    const REFRESH = document.getElementsByClassName('refresh')[0];
    REFRESH.addEventListener('click', function () {
        try {
            fetchData('https://localhost:7004/api/v1/departments')
                .then(data => renderDepartmentTable(data))
                .catch(err => console.log(err))
        } catch (error) {
            toast({
                title: 'Thất bại!', 
                message: JSON.parse(error.responseText).Errors[0],
                type: 'error',
                duration: 3000
            });
        }
    });

    const ADDBTN = document.getElementsByClassName('add')[0];

    ADDBTN.addEventListener('click', function () {
        showPopup(null);
    });

    function handleInputChange(event) {
        const QUERY = event.target.value;
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            searchDepartment(QUERY)
        }, 200)
    }
    
    document.getElementById('search').addEventListener('input', handleInputChange);
}

function searchDepartment(query) {
    if (query !== '') {
        fetchData(`https://localhost:7004/api/v1/departments/search?key=${query}`)
                .then(data => {
                    renderDepartmentTable(data);
                })
                .catch(err => console.log(err))
    } else {
        fetchData('https://localhost:7004/api/v1/departments')
                .then(data => renderDepartmentTable(data))
                .catch(err => console.log(err))
    }
}