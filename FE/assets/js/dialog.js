function showDialog (data ={}, index) {
    const dialogHTML = `
        <div class="dialog">
            <div class="dialog__header">
            <p>${data.title}</p>
            <button class="close" tabindex="1">
                <img src="./assets/icon/close-48.png"/>
            </button>
            </div>
            <div class="dialog__content">
                <p>${data.description}</p>
            </div>
            <div class="dialog__footer">
                <button class="cancel" tabindex="2">Đóng</button>
                <button class="ok tabindex="3">Ok</button>
            </div>
        </div>
    `;

    const dialogArea = document.querySelector(".dialog-area");
    dialogArea.innerHTML = dialogHTML;
    dialogArea.classList.add('open');

    const close = document.querySelector(".close");
    close.addEventListener('click', function() {
        dialogArea.classList.remove('open');
    });

    const cancel = document.querySelector('.cancel');
    cancel.addEventListener('click', function() {
        dialogArea.classList.remove('open')
    });

    const okBtn = document.querySelector(".ok");
    okBtn.addEventListener('click', function() {
        fetchDeleteData(index);
        dialogArea.classList.remove('open');
    });

    /**
     * Xóa dữ liệu bằng js thường
     * @param {*} index: Dòng dữ liệu cần xóa
     */
    function deleteData (index) {
        fakeData.splice(index, 1);
        renderTable(fakeData);
    }

    /**
     * Gọi api xóa dữ liệu từ server
     * @param {*} index Dòn dữ liệu cần xóa
     */
    function fetchDeleteData (index) {
        var code = Data[index].employeeCode;
        $.ajax({
            url: `https://localhost:7004/api/v1/employees/${code}`,  
            method: 'DELETE',
            contentType: 'application/json',  
            success: function (response) {
                if (response !== 1) {
                    alert("Có lỗi khi xóa nhân viên")
                }
                alert('Xóa nhân viên thành công');
                var offset = (currentPage)*limit;
                paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${branch}&limit=${limit}&offset=${offset}`);
            },
            error: function (error) {
                alert('Xóa nhân viên thất bại: ' + error.responseText);
            }
        })
    }
}