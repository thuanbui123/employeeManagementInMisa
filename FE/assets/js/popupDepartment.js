import { fetchDepartment } from "./popup.js";
import { renderDepartmentTable } from "./renderTableDepartment.js";
import { fetchData } from "./service.js";
import { toast } from "./toast.js";

let newCode;
/**
 * Lấy giá trị từ form nhập dữ liệu và tạo đối tượng phòng ban chứa các thông tin
 * @returns đối tượng phòng ban chứa thông tin từ form 
 */
function getValueForm() {
    const DEPARTMENT = {
        departmentCode: document.getElementById('code').value,
        name: document.getElementById('name').value,
    };
    return DEPARTMENT;
}

/**
 * Gọi api để lấy mã phòng ban mới từ backend
 */
export function fetchNewCode() {
    fetch('https://localhost:7004/api/v1/departments/generate-code')
        .then(response => {
            return response.text();
        })
        .then(data => {
            newCode = data;
        })
        .catch(error => {
            console.log(error)
        })
}

/**
 * Khởi tạo trang bằng cách gọi các api để lấy dữ liệu mã phòng ban mới từ backend
 */
function initPage () {
    fetchNewCode();
}

initPage();

/**
 * Tạo ra một poup để hiển thị khi thêm hoặc sửa dữ liệu
 * @param {*} data dữ liệu truyền vào để hiển thị khi sửa dữ liệu
 */
export async function showPopup(code) {
    const POPUP = document.querySelector('.popup');
    POPUP.innerHTML = '';
    POPUP.classList.add('open');

    // Hiển thị trạng thái loading ban đầu
    POPUP.innerHTML = `<div class="loading">Đang tải dữ liệu...</div>`;
    if (code !== null) {
        await fetchData(`https://localhost:7004/api/v1/departments/get-by-code?code=${code}`)
            .then(data => {
                renderPopup(data)
            });
    } else {
        renderPopup({});
    }
    
}

function renderPopup (department) {
    const POPUPHTML = `
        <div class="modal" style='width: 420px'>
                <div class="modal__header">
                    <p>Thông tin phòng ban</p>
                    <button class="close" tabindex="5" title="ESC">
                        <img src="./assets/icon/close-48.png" />
                    </button>
                </div>
                <form class="form">
                    <div class="row" style='width: 100%'>
                        <div class="form-group" style='width: 100%'>
                            <label for="code" style='padding: 10px 0'>
                                Mã phòng ban
                                <p>*</p>
                            </label>
                            <input tabindex="1" type="text" oninvalid="this.setCustomValidity('Mã phòng ban không được để trống!')" oninput="setCustomValidity('')"
                                id="code" name="code"
                                ${department.departmentCode && 'readonly'} 
                                required
                                title="Đây là trường bắt buộc!"
                                style='width: 100%'
                                value="${( department !==  null && department.departmentCode !== undefined) ? department.departmentCode : newCode}"/>
                        </div>
                    </div>
                    <div class='row' style='padding: 20px 0; width: 100%'>
                        <div class="form-group"  style='width: 100%'>
                            <label for="name" style='padding: 10px 0'>
                                Tên phòng ban
                                <p>*</p>
                            </label>
                            <input tabindex="2" type="text" required title="Đây là trường bắt buộc!" oninvalid="this.setCustomValidity('Tên phòng không được để trống!')" oninput="setCustomValidity('')"
                                id="name" name="name" style='width: 100%' value="${(department !==  null && department.name !== undefined) ? department.name : ''}"
                            />
                        </div>
                    </div>
                    <div class="modal-footer" style="padding-top: 20px">
                        <input tabindex="4" class = "btnClose" title="F9" type="button" value="Hủy"/>
                        <input tabindex="3" class = "btnSave" title="F8" type="submit" value="Cất"/>
                    </div>
                </form>        
            </div>
    `

    const POPUP = document.querySelector('.popup');
    POPUP.innerHTML = '';
    POPUP.innerHTML = POPUPHTML;
    POPUP.classList.add('open');
    const FIRSTINPUT = document.querySelectorAll('.modal input')[0];
    FIRSTINPUT.focus();
    FIRSTINPUT.select()
    close = document.querySelector(".modal__header .close");
    close.addEventListener('click', function () {
        POPUP.classList.remove('open')
    })
    const BTNCLOSE = document.querySelector(".btnClose");
    BTNCLOSE.addEventListener('click', function () {
        POPUP.classList.remove('open')
    });

    const FORM = document.querySelector('.form');
    
    document.addEventListener('keyup', handleKeyUp);   

    function handleKeyUp (e) {
        if (e.keyCode === 119) {
            e.preventDefault();
            // Gọi hàm submit của FORM để lưu thông tin
            FORM.dispatchEvent(new Event('submit'));
        } else if (e.keyCode === 120 || e.keyCode === 27) {
            e.preventDefault();
            const POPUP = document.querySelector('.popup');
            POPUP.classList.remove('open');
            const DIALOGAREA = document.querySelector(".dialog-area");
            DIALOGAREA.classList.remove('open');
        }
    }

    FORM.addEventListener('submit', function (e) {
        e.preventDefault();
        const DEPARTMENT = getValueForm();
        if (department.departmentCode === undefined) {
            $.ajax({
                url: 'https://localhost:7004/api/v1/departments', // Địa chỉ API
                method: 'POST',
                contentType: 'application/json', // Đảm bảo đúng Content-Type
                data: JSON.stringify(DEPARTMENT), // Chuyển đối tượng department thành JSON
                success: function (response) {
                    if (response !== 1) {
                        alert("Có lỗi khi thêm phòng ban")
                    }
                    toast({
                        title: 'Thành công!', 
                        message:'Thêm phòng ban thành công',
                        type: 'success',
                        duration: 3000,
                        callback: () => {
                            fetchNewCode();
                            fetchDepartment();
                            fetch('https://localhost:7004/api/v1/departments')
                                .then(res => res.json())
                                .then(data => {
                                    renderDepartmentTable(data)
                                })
                                .catch(err => console.log(err))
                        }
                    })

                },
                error: function (error) {
                    toast({
                        title: 'Thất bại!', 
                        message: JSON.parse(error.responseText).Errors[0],
                        type: 'error',
                        duration: 3000
                    })
                }
            });
        } else {
            $.ajax({
                url: `https://localhost:7004/api/v1/departments/${department.departmentCode}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(DEPARTMENT),
                success: function (response) {
                    if (response !== 1) {
                        alert("Có lỗi khi sửa phòng ban")
                    }
                    toast({
                        title: 'Thành công!', 
                        message:'Sửa phòng ban thành công',
                        type: 'success',
                        duration: 3000,
                        callback: () => {
                            fetchNewCode();
                            fetchDepartment();
                            fetch('https://localhost:7004/api/v1/departments')
                                .then(res => res.json())
                                .then(data => {
                                    renderDepartmentTable(data)
                                })
                                .catch(err => console.log(err))
                        }
                    })
                },
                error: function (error) {
                    toast({
                        title: 'Thất bại!', 
                        message: JSON.parse(error.responseText).Errors[0],
                        type: 'error',
                        duration: 3000
                    });
                }
            })
        }
        POPUP.classList.remove('open');
    });
}
