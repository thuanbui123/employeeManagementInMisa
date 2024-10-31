function convertDate(date) {
    const parts = date.split("/");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`
    return formattedDate;
}

function getValueForm() {
    const employee = {
        employeeCode: document.getElementById('code').value,
        fullName: document.getElementById('name').value,
        dateOfBirth: document.getElementById('birthday').value,
        gender: document.querySelector('input[name="sex"]:checked').value,
        positionCode: document.getElementById('position').value,
        identityNumber: document.getElementById('identityNumber').value,
        identityDate: document.getElementById('identityDate').value,
        departmentCode: document.getElementById('department').value,
        identityPlace: document.getElementById('identityPlace').value,
        address: document.getElementById('address').value,
        PhoneNumber: document.getElementById('numberPhone').value,
        landline: document.getElementById('landline').value,
        email: document.getElementById('email').value,
        bankAccount: document.getElementById('bankAccount').value,
        bankName: document.getElementById('bankName').value,
        branch: document.getElementById('branch').value,
        salary: document.getElementById('salary').value
    };
    return employee;
}

let newCode;

function fetchNewCode() {
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
let positions;
let departments;

function fetchPositions() {
    fetch('https://localhost:7004/api/v1/positions')
        .then(response => {
            return response.json();
        })
        .then(data => {
            positions = data;
        })
        .catch(error => {
            console.log(error)
        })
}

function fetchDepartments() {
    fetch('https://localhost:7004/api/v1/departments')
        .then(response => {
            return response.json();
        })
        .then(data => {
            departments = data;
        })
        .catch(error => {
            console.log(error)
        })
}

fetchNewCode()

let code;

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

function validateEmailInput(input) {
    const email = input.value;

    // Kiểm tra nếu email không hợp lệ
    if (!validateEmail(email)) {
        input.setCustomValidity('Email không hợp lệ!');
    } else {
        input.setCustomValidity(''); // Nếu email hợp lệ, xóa thông báo lỗi
    }
}

fetchPositions();
fetchDepartments();
const branchValues = JSON.parse(localStorage.getItem('branches'));

function showPopup(data = {}) {
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
                            <input tabindex="3" type="date" id="birthday" max='${today}' name="birthday" value="${(data !==  null && data.dateOfBirth !== undefined) ? convertDate(new Date(data.dateOfBirth).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })) : ''}"/>
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
                            <label for="identityNumber">Số identityNumber</label>
                            <input tabindex="8" type="text" id="identityNumber" name="identityNumber" value="${(data !==  null && data.identityNumber !== undefined) ? data.identityNumber : ""}" />
                        </div>
                        <div class="form-group">
                            <label for="identityDate">Ngày cấp</label>
                            <input tabindex="9" type="date" id="identityDate" max='${today}' name="identityDate" value='${(data !==  null && data.identityDate !== undefined) ? convertDate(new Date(data.identityDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })) : ""}'/>
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
                            <input tabindex="11" type="text" id="identityPlace" name="identityPlace" value="${(data !==  null && data.identityPlace !== undefined) ? data.identityPlace : ''}" />
                        </div>
                        <div class="form-group">
                            <label for="salary">Lương</label>
                            <input tabindex="12" type="number" id="salary" name="salary" value='${(data !==  null && data.salary !== undefined) ? data.salary : ""}'/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group">
                            <label for"address">Địa chỉ</label>
                            <input tabindex="13" type = "text" id="address" name="address" value = "${(data !==  null && data.address !== undefined) ? data.address : ''}" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group">
                            <label for="numberPhone">ĐT Di động</label>
                            <input tabindex="14" type = "tel" id="numberPhone" name="numberPhone" value="${(data !==  null && data.phoneNumber !== undefined) ? data.phoneNumber : ''}" />
                        </div>
                        <div class="form-group">
                            <label for="landline">ĐT Cố định</label>
                            <input tabindex="15" type = "tel" id="landline" name="landline" value="${(data !==  null && data.landline !== undefined) ? data.landline : ''}" />
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input tabindex="16" type = "email" oninvalid="this.setCustomValidity('Vui lòng nhập email hợp lệ!')" oninput="validateEmailInput(this)"
                             id="email" name="email" value="${(data !==  null && data.email !== undefined) ? data.email : ''}" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group">
                            <label for="bankAccount">Tài khoản ngân hàng</label>
                            <input tabindex="17" type = "number" pattern="\d{10,20}" id="bankAccount" name="bankAccount" value="${(data !==  null && data.bankAccount !== undefined) ? data.bankAccount : ''}" />
                        </div>
                        <div class="form-group">
                            <label for="bankName">Tên ngân hàng</label>
                            <input tabindex="18" type = "text" id="bankName" name="bankName" value = "${(data !==  null && data.bankName !== undefined) ? data.bankName : ''}"/>
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
                                        return ""; // Trả về một chuỗi rỗng nếu giá trị là "find-all"
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
    popup.innerHTML = popupHtmL;
    popup.classList.add('open');
    const firstInput = document.querySelectorAll('.modal input')[0];
    firstInput.focus();
    firstInput.select()
    close = document.querySelector(".close");
    close.addEventListener('click', function () {
        popup.classList.remove('open')
    })
    btnClose = document.querySelector(".btnClose");
    btnClose.addEventListener('click', function () {
        popup.classList.remove('open')
    });

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
                    alert('Thêm nhân viên thành công');
                    var offset = (currentPage) * limit;
                    paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${branch}&limit=${limit}&offset=${offset}`);
                    fetchNewCode();
                },
                error: function (error) {
                    alert('Thêm nhân viên mới thất bại: ' + error.responseText);
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
                    alert('Sửa nhân viên thành công');
                    var valueSearch = document.getElementById('search').value;
                    var offset = (currentPage) * limit;
                    paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${branch}&limit=${limit}&offset=${offset}`);
                    fetchNewCode();
                    if (valueSearch) {
                        searchEmployee(valueSearch)
                    }
                },
                error: function (error) {
                    alert('Sửa nhân viên thất bại: ' + error.responseText);
                }
            })
        }
        popup.classList.remove('open');
    })
}