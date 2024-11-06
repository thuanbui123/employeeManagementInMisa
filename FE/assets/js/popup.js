import { searchEmployee } from "./employeePage.js";
import { getBranch } from "./header.js";
import { getCurrentPage, getLimit } from "./renderDataTable.js";
import { getPreviousApi, paginate, setPreviousApi } from "./service.js";
import { toast } from "./toast.js";
import { validateIdentityNumberInput, validateEmailInput, validateNumberPhoneInput, validateSalaryInput } from "./service.js";

let positions;
let departments;
let code;
let newCode;

/**
 * Chuyển đổi định dạng ngày từ 'dd/MM/yyyy' sang 'yyyy-MM-dd'
 * @param {*} date Ngày với định dạng 'dd/MM/yyyy'
 * @returns Ngày với định dạng 'yyyy-MM-dd'
 */
export function convertDate(date) {
    const parts = date.split("/");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

/**
 * Lấy giá trị từ form nhập dữ liệu và tạo đối tượng nhân viên chứa các thông tin
 * @returns đối tượng nhân viên chứa thông tin từ form 
 */
function getValueForm() {
    let salary = document.getElementById('salary').value;
    let branch = document.getElementById('branch').value;
    let bankName = document.getElementById('bankName').value;
    let bankAccount = document.getElementById('bankAccount').value;
    let landline = document.getElementById('landline').value;
    let dateOfBirth = document.getElementById('birthday').value;
    let positionCode = document.getElementById('position').value;
    let identityDate = document.getElementById('identityDate').value;
    let departmentCode = document.getElementById('department').value;
    let identityPlace = document.getElementById('identityPlace').value;
    let address = document.getElementById('address').value;
    const employee = {
        employeeCode: document.getElementById('code').value,
        fullName: document.getElementById('name').value,
        email: document.getElementById('email').value,
        identityNumber: document.getElementById('identityNumber').value,
        PhoneNumber: document.getElementById('numberPhone').value,
        gender: document.querySelector('input[name="sex"]:checked').value,
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
    return employee;
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
 * Gọi api để lấy dữ liệu từ backend
 * @param {*} url Địa chỉ url của Api
 * @returns Dữ liệu Json trả về từ api
 */
async function fetchData (url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        return console.log(error);
    }
}

/**
 * Khởi tạo trang bằng cách gọi các api để lấy dữ liệu cho chức vụ, phòng ban và mã nhân viên mới từ backend
 */
function initPage () {
    fetchData('https://localhost:7004/api/v1/positions')
        .then(data => positions = data);
    fetchData('https://localhost:7004/api/v1/departments')
        .then(data => departments = data);
    fetchNewCode();
}

initPage();

const branchValues = JSON.parse(localStorage.getItem('branches'));

/**
 * Định dạng số thành kiểu định dạng tiền tệ VNĐ 
 * @param {*} price Giá trị số cần định dạng
 * @returns Chuỗi định dạng giá trị VNĐ
 */
const formatToVND = (price) => {
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
const formatToNumber = (value) => {
    const formatNumber = value.replace(/\./g, '');
    return formatNumber;
}

/**
 * Tạo ra một poup để hiển thị khi thêm hoặc sửa dữ liệu
 * @param {*} data dữ liệu truyền vào để hiển thị khi sửa dữ liệu
 */
export function showPopup(data = {}) {
    code = (data !== null && data.employeeCode !== undefined) ? data.employeeCode : undefined;
    const sex = (data !== null && data.gender !== undefined) ? data.gender : '';
    const position = (data !== null && data.positionCode !== undefined) ? data.positionCode : '';
    const department = (data !== null && data.departmentCode !== undefined) ? data.departmentCode : '';
    const branchSelected = (data !== null && data.branch !== undefined) ? data.branch : '';
    // Lấy ngày hiện tại
    const today = new Date().toISOString().split('T')[0];
    const popupHtmL = `
        <div class="modal">
                <div class="modal__header">
                    <p>Thông tin nhân viên</p>
                    <button class="close" tabindex="21">
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
                             id="code" name="code" ${data.employeeCode&&'readonly'} value="${( data !==  null && data.employeeCode !== undefined) ? data.employeeCode : newCode}"/>
                        </div>
                        <div class="form-group">
                            <label for="name">
                                Họ tên
                                <p>*</p>
                            </label>
                            <input tabindex="2" type="text" required oninvalid="this.setCustomValidity('Họ và tên không được để trống!')" oninput="setCustomValidity('')"
                             id="name" name="name" value="${(data !==  null && data.fullName !== undefined) ? data.fullName : ''}"/>
                        </div>
                        <div class="form-group">
                            <label for="birthday">Ngày sinh</label>
                            <input tabindex="3" type="date" id="birthday" max='${today}' name="birthday" ${(data !==  null && data.dateOfBirth !== undefined && data.dateOfBirth !== "1970-01-01T00:00:00" && data.dateOfBirth !== null) && `value="${convertDate(new Date(data.dateOfBirth).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }))}"`}/>
                        </div>
                        <div class="form-group">
                            <label>Giới tính</label>
                            <div class="option">
                                <input tabindex="4" type="radio" id="male" name="sex" checked ${sex === "Nam" ? "checked" : ''} value="Nam">
                                <label for="male">Nam</label><br>
                                <input tabindex="5" type="radio" id="female" name="sex" ${sex === "Nữ" ? "checked" : ''} value="Nữ">
                                <label for="female">Nữ</label><br>
                                <input tabindex="6" type="radio" id="other" name="sex" ${sex === "Khác" ? "checked" : ''} value="Khác">
                                <label for="other">Khác</label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group">
                            <label for="position">Vị trí</label>
                            <select tabindex="7" id="position" name="position">
                                <option disabled selected></option>
                                ${
                                    positions.map(item => {
                                        return (
                                            `
                                                <option value="${item.positionCode}" ${position === item.positionCode ? "selected" : ""} >${item.name}</option>
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
                                oninvalid="this.setCustomValidity('Số CMTND không hợp lệ!')"
                                id="identityNumber" name="identityNumber"
                                ${(data !==  null && data.identityNumber !== undefined) ? `value="${data.identityNumber}"` : ""}
                            />
                        </div>
                        <div class="form-group">
                            <label for="identityDate">Ngày cấp</label>
                            <input tabindex="9" type="date" id="identityDate" max='${today}' name="identityDate" ${(data !==  null && data.identityDate !== undefined && data.identityDate !== "1970-01-01T00:00:00" && data.dateOfBirth !== null) && `value="${convertDate(new Date(data.identityDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }))}"`}/>
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
                                                <option value="${item.departmentCode}" ${department === item.departmentCode ?"selected" : ""}>Phòng ${item.name}</option>
                                            `
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="identityPlace">Nơi cấp</label>
                            <input tabindex="11" type="text" id="identityPlace" name="identityPlace" ${(data !== null && data.identityPlace !== undefined && data.identityPlace !== 'null' && data.identityPlace !== null) && `value="${data.identityPlace}"`}/>
                        </div>
                        <div class="form-group">
                            <label for="salary">Lương</label>
                            <input tabindex="12" type="text"
                                oninvalid="this.setCustomValidity('Tiền lương hợp lệ!')" 
                                oninput="validateSalaryInput(this)" id="salary" name="salary" 
                                ${(data !==  null && data.salary !== undefined && data.salary !== null)? `value="${formatToVND(data.salary)}"`: ''}
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group">
                            <label for="address">Địa chỉ</label>
                            <input tabindex="13" type = "text" id="address" name="address" value = "${(data !==  null && data.address !== undefined && data.address !== null && data.address !== 'null') ? data.address : ''}" />
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
                                oninvalid="this.setCustomValidity('Vui lòng nhập số điện thoại hợp lệ!')"
                                id="numberPhone" name="numberPhone" 
                                value="${(data !==  null && data.phoneNumber !== undefined) ? data.phoneNumber : ''}" 
                            />
                        </div>
                        <div class="form-group">
                            <label for="landline">ĐT Cố định</label>
                            <input tabindex="15" type = "tel" id="landline" name="landline" ${(data !==  null && data.landline !== undefined && data.landline !== 'null' && data.landline !== null) ? `value=${data.landline}`: ''} />
                        </div>
                        <div class="form-group">
                            <label for="email">
                                Email
                                <p>*</p>    
                            </label>
                            <input tabindex="16" type = "email"
                                required
                                oninvalid="this.setCustomValidity('Vui lòng nhập email hợp lệ!')" 
                                oninput="validateEmailInput(this)"
                                id="email" name="email" value="${(data !==  null && data.email !== undefined) ? data.email : ''}" 
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group">
                            <label for="bankAccount">Tài khoản ngân hàng</label>
                            <input tabindex="17" type = "number" pattern="\d{10,20}" id="bankAccount" name="bankAccount" value="${(data !==  null && data.bankAccount !== undefined) ? data.bankAccount : ''}" />
                        </div>
                        <div class="form-group">
                            <label for="bankName">Tên ngân hàng</label>
                            <input tabindex="18" type = "text" id="bankName" name="bankName" value = "${(data !==  null && data.bankName !== undefined && data.bankName !== 'null' && data.bankName !== null) ? data.bankName : ''}"/>
                        </div>
                        <div class="form-group">
                            <label for="branch">Chi nhánh</label>
                            <select tabindex="19" id="branch" name="branch">
                                ${
                                    branchValues.map(item => {
                                        // Kiểm tra xem giá trị có phải là "find-all" hay không
                                        if (item.value !== "find-all") {
                                            return (
                                                `<option ${item.value === branchSelected ? 'selected' : ''} value="${item.value}">${item.value}</option>`
                                            );
                                        }
                                        return ""; 
                                    })
                                }
                            </select>
                            
                        </div>
                    </div>
                    <div class="modal-footer">
                        <input tabindex="21" class = "btnClose" type="button" value="Hủy"/>
                        <input tabindex="20" class = "btnSave" data-tooltip="CTRL + F8" type="submit" value="Cất"/>
                    </div>
                </form>        
            </div>
    `

    const popup = document.querySelector('.popup');
    popup.innerHTML = ''
    popup.innerHTML = popupHtmL;
    popup.classList.add('open');
    const firstInput = document.querySelectorAll('.modal input')[0];
    firstInput.focus();
    firstInput.select()
    close = document.querySelector(".modal__header .close");
    close.addEventListener('click', function () {
        popup.classList.remove('open')
    })
    const btnClose = document.querySelector(".btnClose");
    btnClose.addEventListener('click', function () {
        popup.classList.remove('open')
    });

    const identityNumber = document.getElementById('identityNumber');
    identityNumber.oninput = function() {
        validateIdentityNumberInput(identityNumber)
    }

    const numberPhone = document.getElementById('numberPhone');
    numberPhone.oninput = function() {
        validateNumberPhoneInput(numberPhone);
    }

    const email = document.getElementById('email');
    email.oninput = function() {
        validateEmailInput(email);
    }

    const form = document.querySelector('.form');

    document.onkeydown = function (e) {
        if (e.ctrlKey && e.keyCode === 119) {
            e.preventDefault();
            // Gọi hàm submit của form để lưu thông tin
            form.dispatchEvent(new Event('submit'));
        }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const employee = getValueForm();
        // thêm thuần bằng js
        // if (data.employeeId) {
        //     const index = fakeData.findIndex(emp => emp.employeeId === data.employeeId);
        //     fakeData[index] = employee;
        // } else {
        //     fakeData.push(employee);
        // }



        if (code === undefined) {
            $.ajax({
                url: 'https://localhost:7004/api/v1/employees', // Địa chỉ API
                method: 'POST',
                contentType: 'application/json', // Đảm bảo đúng Content-Type
                data: JSON.stringify(employee), // Chuyển đối tượng employee thành JSON
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
                            paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${getBranch()}&limit=${getLimit()}&offset=${offset}`);
                            fetchNewCode();
                        }
                    })

                },
                error: function (error) {
                    toast({
                        title: 'Thất bại!', 
                        message:'Thêm nhân viên thất bại',
                        type: 'error',
                        duration: 3000
                    })
                }
            });
        } else {
            $.ajax({
                url: 'https://localhost:7004/api/v1/employees',
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(employee),
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
                            getPreviousApi('')
                            paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${getBranch()}&limit=${getLimit()}&offset=${offset}`);
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
                        message:'Sửa nhân viên thất bại',
                        type: 'error',
                        duration: 3000
                    })
                }
            })
        }
        popup.classList.remove('open');
    })
}
