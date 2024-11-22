import { fetchDepartment } from "./popup.js";
import { fetchNewCode } from "./popupDepartment.js";
import { getData, renderDepartmentTable } from "./renderTableDepartment.js";
import { toast } from "./toast.js";

/**
 * Hiển thị một hộp thoại xác nhận và xử lý các thao tác người dùng tương tác với hộp thoại
 * Hộp thoại bao gồm tiêu đề, mô tả và các nút "Có" và "Không" để xác nhận hành động
 * Khi nhấn có, hộp thoại sẽ thực hiện xóa dữ liệu qua api
 * @param {*} data Dữ liệu để hiển thị trên hộp thoại bao gồm title và description
 * @param {*} index Chỉ mục của dữ liệu cần xóa
 */
export function showDialog (data ={}, index) {
    let dialogHTML = `
        <div class="dialog">
            <div class="dialog__header">
            <p>${data.title}</p>
            <button class="close__dialog" tabindex="2" title="ESC">
                <img src="./assets/icon/close-48.png"/>
            </button>
            </div>
            <div class="dialog__content">
                <p>${data.description}</p>
            </div>
            <div class="dialog__footer">
                <button class="cancel" tabindex="3" title="F9">Không</button>
                <button class="ok" tabindex="1">Có</button>
            </div>
        </div>
    `;

    //Thêm hộp thoại vào vùng hiển thị và mở hộp thoại
    const DIALOGAREA = document.querySelector(".dialog-area");
    DIALOGAREA.innerHTML = dialogHTML;
    DIALOGAREA.classList.add('open');

    //Xử lý đóng hộp thoại khi ấn nút đóng hoặc hủy
    const CLOSEDIALOG = document.querySelector(".close__dialog");
    CLOSEDIALOG.addEventListener('click', function() {
        DIALOGAREA.classList.remove('open');
    });

    const cancelDialog = document.querySelector('.cancel');
    cancelDialog.addEventListener('click', function() {
        DIALOGAREA.classList.remove('open')
    });

    // Xử lý khi nhấn "OK" để xóa dữ liệu và đóng hộp thoại
    const OKBTN = document.querySelector(".ok");
    OKBTN.addEventListener('click', function() {
        fetchDeleteData(index);
        DIALOGAREA.classList.remove('open');
    });

    /**
     * Xóa dữ liệu bằng js thường
     * @param {*} index: Dòng dữ liệu cần xóa
     */
    function deleteData (index) {
        fakeData.splice(index, 1);
        renderTable(fakeData);
    }
    // Focus vào nút đầu tiên trong hộp thoại
    const focusableElements = DIALOGAREA.querySelectorAll('[tabindex], [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    document.addEventListener('focus', (event) => {
        if (!DIALOGAREA.contains(event.target)) {
            event.stopPropagation();
            lastElement.focus();
        }
    }, true);
    /**
     * Gọi api xóa dữ liệu từ server
     * @param {*} index Dòn dữ liệu cần xóa
     */
    function fetchDeleteData (index) {
        var code = getData()[index].departmentCode;
        $.ajax({
            url: `https://localhost:7004/api/v1/departments/${code}`,  
            method: 'DELETE',
            contentType: 'application/json',  
            success: function (response) {
                if (response !== 1) {
                    alert("Có lỗi khi xóa phòng ban")
                }
                toast({
                    title: 'Thành công!', 
                    message:'Xóa phòng ban thành công',
                    type: 'success',
                    duration: 3000,
                    callback: () => {
                        fetchNewCode();
                        fetchDepartment();
                        fetch('https://localhost:7004/api/v1/departments')
                            .then(res => res.json())
                            .then(data => {
                                renderDepartmentTable(data)
                            })
                            .catch(err => console.log(err))
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
        })
    }
}