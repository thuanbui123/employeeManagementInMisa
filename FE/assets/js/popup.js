function convertDate (date) {
    const parts = date.split("/");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`
    return formattedDate;
}

function getValueForm () {
    const employee = {
        employeeCode: document.getElementById('code').value,
        fullName: document.getElementById('name').value,
        dateOfBirth: document.getElementById('birthday').value.split('-').reverse().join('/'), // Chuyển đổi về định dạng dd/mm/yyyy
        sex: document.querySelector('input[name="sex"]:checked').value,
        position: document.getElementById('position').value,
        identityNumber: document.getElementById('identityNumber').value,
        identityDate: document.getElementById('identityDate').value.split('-').reverse().join('/'),
        department: document.getElementById('department').value,
        identityPlace: document.getElementById('identityPlace').value,
        address: document.getElementById('address').value,
        numberPhone: document.getElementById('numberPhone').value,
        landline: document.getElementById('landline').value,
        email: document.getElementById('email').value,
        bankAccount: document.getElementById('bankAccount').value,
        bankName: document.getElementById('bankName').value,
        bankBranch: document.getElementById('bankBranch').value
    };
    return employee;
}

function showPopup (data= {}) {
    const sex = (data !==  null && data.sex !== undefined) ? data.sex : '';
    const position = (data !==  null && data.position !== undefined) ? data.position : '';
    const department = (data !==  null && data.department !== undefined) ? data.department : '';
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
                            <input tabindex="1" type="text" required oninvalid="this.setCustomValidity('Mã nhân viên không được để trống!')" oninput="setCustomValidity('')"
                             id="code" name="code" ${data.employeeCode&&'readonly'} value="${( data !==  null && data.employeeCode !== undefined) ? data.employeeCode : ''}"/>
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
                            <input tabindex="3" type="date" id="birthday" name="birthday" value="${(data !==  null && data.dateOfBirth !== undefined) ? convertDate(new Date(data.dateOfBirth).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })) : ''}"/>
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
                                <option value="Intern" ${position === "Intern" ? "selected" : ""} >Intern</option>
                                <option value="Fresher" ${position === "Fresher" ? "selected" : ""}>Fresher</option>
                                <option value="Junior" ${position === "Junior" ? "selected" : ""}>Junior</option>
                                <option value="Project manager" ${position === "Project manager" ? "selected" : ""}>Project Manager</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="IdentityNumber">Số identityNumber</label>
                            <input tabindex="8" type="text" id="IdentityNumber" name="IdentityNumber" value="${(data !==  null && data.identityNumber !== undefined) ? data.identityNumber : ""}" />
                        </div>
                        <div class="form-group">
                            <label for="IdentityDate">Ngày cấp</label>
                            <input tabindex="9" type="date" id="IdentityDate" name="IdentityDate" value='${(data !==  null && data.identityDate !== undefined) ? convertDate(new Date(data.identityDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })) : ""}'/>
                        </div>
                            
                    </div>
                    <div class="row">
                        <div class="form-group">
                            <label for="department">Phòng ban</label>
                            <select tabindex="10" id="department" name="department">
                                <option disabled selected></option>
                                <option value="Nhân sự" ${department === "Nhân sự" ?"selected" : ""}>Nhân sự</option>
                                <option value="Sản xuất" ${department === "Sản xuất" ?"selected" : ""}>Sản xuất</option>
                                <option value="Kinh doanh" ${department === "Kinh doanh" ?"selected" : ""}>Kinh doanh</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="IdentityPlace">Nơi cấp</label>
                            <input tabindex="11" type="text" id="IdentityPlace" name="IdentityPlace" value="${(data !==  null && data.identityPlace !== undefined) ? data.identityPlace : ''}" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group">
                            <label for"address">Địa chỉ</label>
                            <input tabindex="12" type = "text" id="address" name="address" value = "${(data !==  null && data.address !== undefined) ? data.address : ''}" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group">
                            <label for="numberPhone">ĐT Di động</label>
                            <input tabindex="13" type = "tel" id="numberPhone" name="numberPhone" value="${(data !==  null && data.phoneNumber !== undefined) ? data.phoneNumber : ''}" />
                        </div>
                        <div class="form-group">
                            <label for="landline">ĐT Cố định</label>
                            <input tabindex="14" type = "tel" id="landline" name="landline" value="${(data !==  null && data.landline !== undefined) ? data.landline : ''}" />
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input tabindex="15" type = "email" oninvalid="this.setCustomValidity('Email không đúng định dạng!')" oninput="setCustomValidity('')"
                             id="email" name="email" value="${(data !==  null && data.email !== undefined) ? data.email : ''}" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group">
                            <label for="bankAccount">Tài khoản ngân hàng</label>
                            <input tabindex="16" type = "text"pattern="\d{10,20}" id="bankAccount" name="bankAccount" value="${(data !==  null && data.bankAccount !== undefined) ? data.bankAccount : ''}" />
                        </div>
                        <div class="form-group">
                            <label for="bankName">Tên ngân hàng</label>
                            <input tabindex="17" type = "text" id="bankName" name="bankName" value = "${(data !==  null && data.bankName !== undefined) ? data.bankName : ''}"/>
                        </div>
                        <div class="form-group">
                            <label for="bankBranch">Chi nhánh</label>
                            <input tabindex="18" type = "text" id="bankBranch" name="bankBranch" value = "${(data !==  null && data.bankBranch !== undefined) ? data.bankBranch : ''}" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <input tabindex="19" class = "btnClose" type="button" value="Hủy"/>
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
    close.addEventListener('click', function() {
        popup.classList.remove('open')
    })
    btnClose = document.querySelector(".btnClose");
    btnClose.addEventListener('click', function() {
        popup.classList.remove('open')
    });

    const form = document.querySelector('.form');

    document.onkeydown = function(e) {
        if (e.ctrlKey && e.keyCode === 	119) {
            e.preventDefault();
            // Gọi hàm submit của form để lưu thông tin
            form.dispatchEvent(new Event('submit'));
        }
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const employee = getValueForm();
        if (data.employeeId) {
            const index = fakeData.findIndex(emp => emp.employeeId === data.employeeId);
            fakeData[index] = employee;
        } else {
            fakeData.push(employee);
        }
        renderTable(fakeData);
        popup.classList.remove('open');
    }) 
}