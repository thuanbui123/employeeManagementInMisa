function LoadContainer() {
    const containerHtml = `
        <div class="sub-header">
                <p class="title">Quản lý Nhân viên</p>
                <button class="add">
                    <img src="./assets/icon/add.png" alt="Thêm mới"/>
                    <p>Thêm mới</p>
                </button>
        </div>
        <div class="content">
            <div class="content__header">
                <div class="header__left">
                    <input type="text" name="search" id="search" placeholder="Tìm kiếm theo mã, họ tên">
                    <img src="./assets/icon/search.png" alt="Tìm kiếm" />
                </div>
                <div class="header__right">
                    <button class="export">
                        <img src="./assets/icon/export-excel-50.png" alt="export">
                    </button>
                    <button class="refresh">
                        <img src="./assets/icon/refresh.png" alt="refresh">
                    </button>
                </div>
            </div>
            <div class="content__body">
                <table class="table">
                    <thead class="header">
                        <tr>
                            <th>STT</th>
                            <th>Mã nhân viên</th>
                            <th>Họ và tên</th>
                            <th>Giới tính</th>
                            <th>Ngày sinh</th>
                            <th>Địa chỉ email</th>
                            <th>Địa chỉ</th>
                        </tr>
                    </thead>
                    <tbody class="body">
                    </tbody>
                </table>
            </div>
        </div>
        <div class="popup"></div>
        <div class="dialog-area"></div>
            
`;
    document.getElementById('container').innerHTML = containerHtml;
    const refresh = document.getElementsByClassName('refresh')[0];
    refresh.addEventListener('click', function() {
        window.location.reload();
    })

    const addBtn = document.getElementsByClassName('add')[0];

    // showPopup(addBtn)
    addBtn.addEventListener('click', function() {
        showPopup({ code: '', name: '', gender: '', birthday: '', position: '', CMTND: '', dateProvide: '', department: '', placeOfIssue: '', address: '', numberPhone: '', landline: '', email: '', bankAccount: '', bankName: '', bankBranch: '' });
    })
}

