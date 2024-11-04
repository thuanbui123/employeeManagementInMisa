function showDialog (data ={}, index) {
    const dialogHTML = `
        <div class="dialog">
            <div class="dialog__header">
            <p>${data.title}</p>
            <button class="close__dialog" tabindex="1">
                <img src="./assets/icon/close-48.png"/>
            </button>
            </div>
            <div class="dialog__content">
                <p>${data.description}</p>
            </div>
            <div class="dialog__footer">
                <button class="cancel" tabindex="2">Không</button>
                <button class="ok tabindex="3">Có</button>
            </div>
        </div>
    `;

    const dialogArea = document.querySelector(".dialog-area");
    dialogArea.innerHTML = dialogHTML;
    dialogArea.classList.add('open');

    const closeDialog = document.querySelector(".close__dialog");
    closeDialog.addEventListener('click', function() {
        dialogArea.classList.remove('open');
    });

    const cancelDialog = document.querySelector('.cancel');
    cancelDialog.addEventListener('click', function() {
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
                toast({
                    title: 'Thành công!', 
                    message:'Xóa nhân viên thành công',
                    type: 'success',
                    duration: 3000,
                    callback: () => {
                        var valueSearch = document.getElementById('search').value;
                        var offset = (currentPage) * limit;
                        previousApi =''
                        paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${branch}&limit=${limit}&offset=${offset}`);
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
}