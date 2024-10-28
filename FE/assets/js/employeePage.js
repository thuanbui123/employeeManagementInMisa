
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
                    <button class="import">
                        <img src="./assets/icon/import.png" alt="import">
                    </button>
                    <input type="file" id="fileInput" style="display: none;">
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
                        <th style="width: 15%;">Chi nhánh</th>
                        <th style="width: 35%;">Địa chỉ</th>
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
    document.getElementById('container').innerHTML = containerHtml;
    const refresh = document.getElementsByClassName('refresh')[0];
    refresh.addEventListener('click', function() {
        paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${branch}&limit=10&offset=0`)
        fetchSumRows ();
    });

    const importBtn = document.getElementsByClassName('import')[0];
    // importBtn.addEventListener('click', function() {
    //     document.getElementById('fileInput').click();
    // });

    importBtn.addEventListener('click', function() {
        showImportEmployee()
    })

    document.getElementById('fileInput').addEventListener('change', function(event) {
        const file = event.target.files[0]; // Lấy file được chọn
    
        if (file) {
            // Gọi API để gửi file
            const formData = new FormData();
            formData.append('file', file);
    
            fetch('https://localhost:7004/api/v1/employees/import', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                var message = '';
                data.map(item => {
                    message += `${item.error} \n` 
                })
                alert(message)
                fetchEmployeeData(10, 0);
                fetchSumRows ();
                event.target.value = '';
            })
            .catch((error) => {
                alert(error)
            });
        } else {
            alert('Vui lòng chọn file!');
            event.target.value = '';
        }
    });

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
        if (query != '') {
            paginate(`https://localhost:7004/api/v1/employees/search?value=${query}&branch=${branch}&limit=${limit}&offset=0`);
        } else {
            paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${branch}&limit=10&offset=0`);
        }
    }
}

