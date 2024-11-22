import { searchEmployee } from "./employeePage.js";
import { getBranch } from "./header.js";
import { getCurrentPage, getIsDesc, getLimit } from "./renderDataTable.js";
import { fetchData, paginate, setPreviousApi, validateBankAccountInput } from "./service.js";
import { toast } from "./toast.js";
import { validateIdentityNumberInput, validateEmailInput, validateNumberPhoneInput, validateSalaryInput } from "./service.js";

let positions;
let departments;
let newCode;
/**
 * Chuyển đổi định dạng ngày từ 'dd/MM/yyyy' sang 'yyyy-MM-dd'
 * @param {*} date Ngày với định dạng 'dd/MM/yyyy'
 * @returns Ngày với định dạng 'yyyy-MM-dd'
 */
export function convertDate(date) {
    const PARTS = date.split("/");
    return `${PARTS[2]}-${PARTS[1]}-${PARTS[0]}`;
}

/**
 * Lấy giá trị từ form nhập dữ liệu và tạo đối tượng nhân viên chứa các thông tin
 * @returns đối tượng nhân viên chứa thông tin từ form 
 */
function getValueForm() {
    let salary = document.getElementById('salary').value;
    let branchElement = document.querySelector('input[name="branch"]:checked');
    let branch = branchElement ? branchElement.value : null;
    let bankName = document.getElementById('bankName').value;
    let bankAccount = document.getElementById('bankAccount').value;
    let landline = document.getElementById('landline').value;
    let dateOfBirth = document.getElementById('birthday').value;
    let positionCode = document.getElementById('position').value;
    let identityDate = document.getElementById('identityDate').value;
    let departmentCode = document.getElementById('department').value;
    let identityPlace = document.getElementById('identityPlace').value;
    let address = document.getElementById('address').value;
    let genderElement = document.querySelector('input[name="sex"]:checked');
    let gender = genderElement ? genderElement.value : null;
    const EMPLOYEE = {
        employeeCode: document.getElementById('code').value,
        fullName: document.getElementById('name').value,
        email: document.getElementById('email').value,
        identityNumber: document.getElementById('identityNumber').value,
        PhoneNumber: document.getElementById('numberPhone').value,
        ...(gender !== '' && {gender: gender}),
        ...(dateOfBirth !== '' && {dateOfBirth: dateOfBirth}),
        ...(positionCode !== '' && {positionCode: positionCode}),
        ...(identityDate !== '' && {identityDate: identityDate}),
        ...(departmentCode !== '' && {departmentCode: departmentCode}),
        ...(identityPlace !== '' && {identityPlace: identityPlace}),
        ...(address !== '' && {address: address}),
        ...(landline !== '' && {landline: landline}), //toán tử spread ... dùng để trải rộng một đối tượng vào đối tượng cha
        ...(bankAccount !== '' && {bankAccount: bankAccount}),
        ...(bankName !== '' && {bankName: bankName}),
        ...(branch !== '' && {branch: branch}),
        ...(salary !== '' && {salary: formatToNumber(salary)})
    };
    return EMPLOYEE;
}

/**
 * Gọi api để lấy mã nhân viên mới từ backend
 */
export function fetchNewCode() {
    fetch('https://localhost:7004/api/v1/employees/generate-code')
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
 * Gọi api lấy danh sách thông tin phòng ban
 */
export function fetchDepartment () {
    fetchData('https://localhost:7004/api/v1/departments')
        .then(data => departments = data);
}

/**
 * Khởi tạo trang bằng cách gọi các api để lấy dữ liệu cho chức vụ, phòng ban và mã nhân viên mới từ backend
 */
function initPage () {
    fetchData('https://localhost:7004/api/v1/positions')
        .then(data => positions = data);
    fetchDepartment();
    fetchNewCode();
}

initPage();

let branchValues = JSON.parse(localStorage.getItem('branches'));

/**
 * Định dạng số thành kiểu định dạng tiền tệ VNĐ 
 * @param {*} price Giá trị số cần định dạng
 * @returns Chuỗi định dạng giá trị VNĐ
 */
function formatToVND (price) {
    const VND = new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 0 
    });
    return VND.format(price);
}

/**
 * Định dạng giá trị chuỗi thành số
 * @param {*} value Chuỗi cần định dạng
 * @returns Chuỗi số không chứa dấu (.) phân cách
 */
function formatToNumber (value) {
    const formatNumber = value.replace(/\./g, '');
    return formatNumber;
}

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
        console.log(code)
        setPreviousApi('');
        await fetchData(`https://localhost:7004/api/v1/employees/get-one-by-code?code=${code}`)
            .then(data => {
                renderPopup(data)
            });
    } else {
        renderPopup({});
    }
    
}

function renderPopup (employee) {
    let sex = (employee !== null && employee.gender !== undefined) ? employee.gender : '';
    let position = (employee !== null && employee.position !== undefined) ? employee.position : '';
    let department = (employee !== null && employee.department !== undefined) ? employee.department : '';
    let branchSelected = (employee !== null && employee.branch !== undefined) ? employee.branch : '';
    // Lấy ngày hiện tại
    let today = new Date().toISOString().split('T')[0];
    const POPUPHTML = `
        <div class="modal">
                <div class="modal__header">
                    <p>Thông tin nhân viên</p>
                    <button class="close" tabindex="22" title="ESC">
                        <img src="./assets/icon/close-48.png" />
                    </button>
                </div>
                <form class="form">
                    <div class="row">
                        <div class="form-group">
                            <label for="code">
                                Mã nhân viên
                                <p>*</p>
                            </label>
                            <input tabindex="1" type="text" oninvalid="this.setCustomValidity('Mã nhân viên không được để trống!')" oninput="setCustomValidity('')"
                                id="code" name="code"
                                ${employee.employeeCode&&'readonly'} 
                                required
                                title="Đây là trường bắt buộc!"
                                value="${( employee !==  null && employee.employeeCode !== undefined) ? employee.employeeCode : newCode}"/>
                        </div>
                        <div class="form-group">
                            <label for="name">
                                Họ tên
                                <p>*</p>
                            </label>
                            <input tabindex="2" type="text" required title="Đây là trường bắt buộc!" oninvalid="this.setCustomValidity('Họ và tên không được để trống!')" oninput="setCustomValidity('')"
                                id="name" name="name" value="${(employee !==  null && employee.fullName !== undefined) ? employee.fullName : ''}"
                            />
                        </div>
                        <div class="form-group">
                            <label for="birthday">Ngày sinh</label>
                            <input tabindex="3" type="date" id="birthday" max='${today}' name="birthday" ${(employee !==  null && employee.dateOfBirth !== undefined && employee.dateOfBirth !== "1970-01-01T00:00:00" && employee.dateOfBirth !== null) && `value="${convertDate(new Date(employee.dateOfBirth).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }))}"`}/>
                        </div>
                        <div class="form-group">
                            <label>Giới tính</label>
                            <div class="option">
                                <input tabindex="4" type="radio" id="male" name="sex" ${sex === "Nam" ? "checked" : ''} value="Nam"/>
                                <label for="male">Nam</label><br>
                                <input tabindex="5" type="radio" id="female" name="sex" ${sex === "Nữ" ? "checked" : ''} value="Nữ"/>
                                <label for="female">Nữ</label><br>
                                <input tabindex="6" type="radio" id="other" name="sex" ${sex === "Khác" ? "checked" : ''} value="Khác"/>
                                <label for="other">Khác</label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group">
                            <label for="position">Chức vụ</label>
                            <select tabindex="7" id="position" name="position">
                                <option disabled selected></option>
                                ${
                                    positions.map(item => {
                                        return (
                                            `
                                                <option value="${item.positionCode}" ${position === item.name ? "selected" : ""} >${item.name}</option>
                                            `
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="identityNumber">
                                Số CMTND
                                <p>*</p>    
                            </label>
                            <input tabindex="8" type="text" 
                                required
                                title="Đây là trường bắt buộc!"
                                oninvalid="this.setCustomValidity('Số CMTND không hợp lệ!')"
                                id="identityNumber" name="identityNumber"
                                ${(employee !==  null && employee.identityNumber !== undefined) ? `value="${employee.identityNumber}"` : ""}
                            />
                        </div>
                        <div class="form-group">
                            <label for="identityDate">Ngày cấp</label>
                            <input tabindex="9" type="date" id="identityDate" max='${today}' name="identityDate" ${(employee !==  null && employee.identityDate !== undefined && employee.identityDate !== "1970-01-01T00:00:00" && employee.dateOfBirth !== null) && `value="${convertDate(new Date(employee.identityDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }))}"`}/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group">
                            <label for="department">Phòng ban</label>
                            <select tabindex="10" id="department" name="department">
                                <option disabled selected></option>
                                ${
                                    departments.map(item => {
                                        return (
                                            `
                                                <option value="${item.departmentCode}" ${department === item.name ?"selected" : ""}>${item.name}</option>
                                            `
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="identityPlace">Nơi cấp</label>
                            <input tabindex="11"
                                type="text" id="identityPlace" 
                                name="identityPlace" ${(employee !== null && employee.identityPlace !== undefined && employee.identityPlace !== 'null' && employee.identityPlace !== null) && 
                                `value="${employee.identityPlace}"`}/>
                        </div>
                        <div class="form-group">
                            <label for="salary">Lương</label>
                            <input tabindex="12" type="text"
                                oninvalid="this.setCustomValidity('Tiền lương hợp lệ!')" 
                                id="salary" name="salary" 
                                ${(employee !==  null && employee.salary !== undefined && employee.salary !== null)? `value="${formatToVND(employee.salary)}"`: ''}
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group">
                            <label for="address">Địa chỉ</label>
                            <input tabindex="13" 
                            type = "text" 
                            id="address" 
                            name="address" 
                            value = "${(employee !==  null && employee.address !== undefined && employee.address !== null && employee.address !== 'null') ? employee.address : ''}" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group">
                            <label for="numberPhone">
                                ĐT Di động
                                <p>*</p>    
                            </label>
                            <input tabindex="14" type = "tel"
                                required
                                title="Đây là trường bắt buộc!"
                                oninput="validateNumberPhoneInput(this)" 
                                oninvalid="this.setCustomValidity('Vui lòng nhập số điện thoại hợp lệ!')"
                                id="numberPhone" name="numberPhone" 
                                value="${(employee !==  null && employee.phoneNumber !== undefined) ? employee.phoneNumber : ''}" 
                            />
                        </div>
                        <div class="form-group">
                            <label for="landline">ĐT Cố định</label>
                            <input tabindex="15" type = "tel" id="landline" name="landline" ${(employee !==  null && employee.landline !== undefined && employee.landline !== 'null' && employee.landline !== null) ? `value=${employee.landline}`: ''} />
                        </div>
                        <div class="form-group">
                            <label for="email">
                                Email
                                <p>*</p>    
                            </label>
                            <input tabindex="16" type = "email"
                                required
                                title="Đây là trường bắt buộc!"
                                oninvalid="this.setCustomValidity('Vui lòng nhập email hợp lệ!')"
                                id="email" name="email" value="${(employee !==  null && employee.email !== undefined) ? employee.email : ''}" 
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group">
                            <label for="bankAccount">Tài khoản ngân hàng</label>
                            <input tabindex="17" type = "number" pattern="\d{10,20}" id="bankAccount" name="bankAccount" value="${(employee !==  null && employee.bankAccount !== undefined) ? employee.bankAccount : ''}" />
                        </div>
                        <div class="form-group">
                            <label for="bankName">Tên ngân hàng</label>
                            <input tabindex="18" type = "text" id="bankName" name="bankName" value = "${(employee !==  null && employee.bankName !== undefined && employee.bankName !== 'null' && employee.bankName !== null) ? employee.bankName : ''}"/>
                        </div>
                        <div class="form-group">
                            <label for="branch">Chi nhánh</label>
                            <div class="branch option">
                                ${
                                    branchValues
                                    .filter(item => item.value !== "find-all")
                                    .map(item => (
                                        `
                                            <input tabindex="19" 
                                                type="radio" id="${item.value}" 
                                                name="branch" ${item.value === branchSelected ? "checked" : ''} 
                                                value="${item.value}"
                                            />
                                            <label for="${item.value}">${item.value}</label>
                                        `
                                    ))
                                    .join('')
                                }
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <input tabindex="21" class = "btnClose" title="F9" type="button" value="Hủy"/>
                        <input tabindex="20" class = "btnSave" title="F8" type="submit" value="Cất"/>
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

    const IDENTITYNUMBER = document.getElementById('identityNumber');
    IDENTITYNUMBER.oninput = function() {
        validateIdentityNumberInput(IDENTITYNUMBER)
    }

    const NUMBERPHONE = document.getElementById('numberPhone');
    NUMBERPHONE.oninput = function() {
        validateNumberPhoneInput(NUMBERPHONE);
    }

    const EMAIL = document.getElementById('email');
    EMAIL.oninput = function() {
        validateEmailInput(EMAIL);
    }

    const SALARY = document.getElementById('salary');
    SALARY.oninput = function() {
        validateSalaryInput(SALARY);
    }

    const BANKACCOUNT = document.getElementById('bankAccount');
    BANKACCOUNT.oninput = function() {
        validateBankAccountInput(BANKACCOUNT);
    }

    const FORM = document.querySelector('.form');
    
    document.addEventListener('keyup', h);   

    function h (e) {
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
        const EMPLOYEE = getValueForm();
        NUMBERPHONE.dispatchEvent(new Event('input'));
        if (employee.employeeCode === undefined) {
            $.ajax({
                url: 'https://localhost:7004/api/v1/employees', // Địa chỉ API
                method: 'POST',
                contentType: 'application/json', // Đảm bảo đúng Content-Type
                data: JSON.stringify(EMPLOYEE), // Chuyển đối tượng employee thành JSON
                success: function (response) {
                    if (response !== 1) {
                        alert("Có lỗi khi thêm nhân viên")
                    }
                    toast({
                        title: 'Thành công!', 
                        message:'Thêm nhân viên thành công',
                        type: 'success',
                        duration: 3000,
                        callback: () => {
                            var offset = (getCurrentPage()) * getLimit();
                            setPreviousApi('')
                            paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${getBranch()}&limit=${getLimit()}&offset=${offset}&is-desc=${getIsDesc()}`);
                            fetchNewCode();
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
                url: `https://localhost:7004/api/v1/employees/${employee.employeeCode}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(EMPLOYEE),
                success: function (response) {
                    if (response !== 1) {
                        alert("Có lỗi khi sửa nhân viên")
                    }
                    toast({
                        title: 'Thành công!', 
                        message:'Sửa nhân viên thành công',
                        type: 'success',
                        duration: 3000,
                        callback: () => {
                            var valueSearch = document.getElementById('search').value;
                            var offset = (getCurrentPage()) * getLimit();
                            setPreviousApi('')
                            paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${getBranch()}&limit=${getLimit()}&offset=${offset}&is-desc=${getIsDesc()}`);
                            fetchNewCode();
                            if (valueSearch) {
                                searchEmployee(valueSearch)
                            }
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
