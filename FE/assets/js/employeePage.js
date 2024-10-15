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
                        <th style="width: 5%;">STT</th>
                        <th style="width: 10%;">Mã nhân viên</th>
                        <th style="width: 15%;">Họ và tên</th>
                        <th style="width: 8%;">Giới tính</th>
                        <th style="width: 12%;">Ngày sinh</th>
                        <th style="width: 20%;">Địa chỉ email</th>
                        <th style="width: 30%;">Địa chỉ</th>
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
        showPopup({});
    });

    let timeoutId;
    function handleInputChange(event) {
        const query = event.target.value;
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            searchEmployee(query)
        }, 200)
    }
    document.getElementById('search').addEventListener('input', handleInputChange);

    function searchEmployee (query) {
        fetch('https://localhost:7004/api/v1/employees/'.concat(query))
        .then(response => {
            return response.json(); 
        })
        .then(data => {
            renderTable(data);
        })
        .catch(error => {
            console.log(error)
        })
    }
}

