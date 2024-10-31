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
    refresh.addEventListener('click', function () {
        let limit;
        const savedLimit = Cookies.get('rowsPerPageLimit');
        if (savedLimit) {
            limit = parseInt(savedLimit);
        }
        const subnav = document.getElementsByClassName('subnav')[0];
        subnav.value = "Hà Nội"
        branch = "Hà Nội"
        var offset = (currentPage)*limit;
        paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${branch}&limit=${limit}&offset=${offset}`);
    });

    const importBtn = document.getElementsByClassName('import')[0];
    // importBtn.addEventListener('click', function() {
    //     document.getElementById('fileInput').click();
    // });

    importBtn.addEventListener('click', function () {
        showImportEmployee()
    })

    const exportBtn = document.querySelector('.export');
    exportBtn.addEventListener('click', async function () {
        try {
            const response = await fetch(`https://localhost:7004/api/v1/employees/export-excel?branch=${branch}`, {
                method: "GET",
            });
            if (response.ok) {
                //Đọc dữ liệu dưới dạng Blob
                const blob = await response.blob();

                // Tạo URL từ Blob để tải xuống
                const url = window.URL.createObjectURL(blob);

                // Tạo thẻ a để tải file
                const a = document.createElement("a");
                a.href = url;
                a.download = "ExportData.xlsx"; // Tên file
                document.body.appendChild(a);
                a.click();

                // Xóa URL và thẻ a sau khi tải xuống
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert("Tải file không thành công");
            }
        } catch (error) {
            alert('Lỗi: ', error);
        }
    });

    const addBtn = document.getElementsByClassName('add')[0];

    // showPopup(addBtn)
    addBtn.addEventListener('click', function () {
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
}

function searchEmployee(query) {
    var offset = 0*limit;
    if (query != '') {
        paginate(`https://localhost:7004/api/v1/employees/search?value=${query}&branch=${branch}&limit=${limit}&offset=${offset}`);
    } else {
        paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${branch}&limit=10&offset=${offset}`);
    }
}