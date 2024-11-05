let keyCache;

/**
 * Hàm tạo ra html để hiện thị trang nhập khẩu nhân viên
 */
function showImportEmployee() {
    const importEmployeeHtml = `
        <div class="title-bar">
                <h2>Nhập khẩu danh sách nhân viên</h2>
                <button class="title-bar-close"></button>
            </div>
            <div class="steps">
                <div class="step-item active">
                    <div class="step-item-content">
                        <div class="step-number">
                            1
                        </div>
                        <div class="step-border"></div>
                    </div>
                    <div class="step-text">
                        Chọn tệp nguồn
                    </div>
                </div>
                <div class="step-item">
                    <div class="step-item-content">
                        <div class="step-number">
                            2
                        </div>
                        <div class="step-border"></div>
                    </div>
                    <div class="step-text">
                        Kết quả nhập khẩu
                    </div>
                </div>
            </div>
            <div class="step-content">
                <div class="step-content-item-1 active">
                    <div class="step-content-item">
                        <div class="left-step-content">
                            <div class="step-title">
                                Hướng dẫn
                            </div>
                            <div class="step-item-detail">
                                <div class="item-content">
                                    <div class="item-icon">
                                        <i class="icofont-download"></i>
                                    </div>
                                    <div class="item-text">
                                        <div class="item-title-text">Bước 1: Tải tệp mẫu</div>
                                        <div class="item-text-content">
                                            Bạn chưa có tệp mẫu vui lòng tải 
                                            <a href="../assets/Danh sách nhân viên.xlsx" download='file-example.xlsx' class="download-item" data-single-command="Download" >tại đây</a>
                                            .
                                        </div>
                                    </div>
                                </div>
                                <div class="item-content">
                                    <div class="item-icon">
                                        <i class="icofont-edit"></i>
                                    </div>
                                    <div class="item-text">
                                        <div class="item-title-text">Bước 2: Chuẩn bị tệp</div>
                                        <div class="item-text-content">
                                            Đưa dữ liệu cần nhập khẩu vào tệp mẫu.
                                            <br>
                                            Bước này làm bên ngoài chương trình.
                                        </div>
                                    </div>
                                </div>
                                <div class="item-content">
                                    <div class="item-icon">
                                        <i class="icofont-upload-alt"></i>
                                    </div>
                                    <div class="item-text">
                                        <div class="item-title-text">Bước 3: Đính kèm tệp</div>
                                        <div class="item-text-content">
                                            Đưa dữ liệu chuẩn bị lên chương trình.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="right-step-content">
                            <div class="step-title">
                                Đính kèm tệp
                            </div>
                            <div class="step-text">
                                Dung lượng tối đa 2MB
                            </div>
                            <div class="import-content">
                                <div id="progress-container" style="display: none;">
                                    <div id="progress-bar" style="width: 0%; height: 20px; background-color: #2ea4f1;"></div>
                                    <p id="progress-text">0%</p>
                                </div>
                                <div class="result-upload">
                                    
                                </div>
                                <div class="drag-container">
                                    <div class="ic-gray-upload">
                                        <i class="icofont-upload-alt"></i>
                                    </div>
                                    <div class="text">
                                        Kéo thả tệp vào đây hoặc 
                                        <a href="#" class="misa-link">bấm vào đây</a>
                                        <input value="" type="file" class="drag-box" title="Chọn tệp" accept=".xls,.xlsx" >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="step-content-item-2">
                    <div class="step-content-item">
                        <div class="left-content">
                            <i class="icofont-search-document"></i>
                        </div>
                        <div class="right-content">
                            <div class="import-result">
                                <div class="result-item success-import">
                                    <div class="result-icon">
                                        <i class="icofont-tick-mark"></i>
                                    </div>
                                    <div class="result-text">
                                        Nhập khẩu thành công
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <button class="cancel-btn" style="
                    padding: 10px 20px;
                ">Hủy</button>
                <button class="import-btn disable">Nhập dữ liệu</button>
                <button class="close-ie-popup hidden" style="
                    padding: 10px 20px;
                ">Đóng</button>
            </div>
    `
    const ieWrapper = document.querySelector('.ie-wrapper');
    ieWrapper.innerHTML = importEmployeeHtml;
    ieWrapper.classList.add('open');
    const dropArea = document.querySelector('.drag-container');
    const fileInput = document.querySelector('.drag-box');
    const importBtn = document.querySelector('.import-btn');
    const resultUpload = document.querySelector('.result-upload');
    const titleBarClose = document.querySelector('.title-bar-close');
    const cancelBtn = document.querySelector('.cancel-btn');
    const closeBtn = document.querySelector('.close-ie-popup');

    closeBtn.addEventListener('click', function () {
        previousApi = '';
        paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${branch}&limit=10&offset=0`);
        fetchNewCode();
        ieWrapper.classList.remove('open');
    })

    titleBarClose.addEventListener('click', function () {
        previousApi = '';
        paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${branch}&limit=10&offset=0`);
        fetchNewCode();
        ieWrapper.classList.remove('open');
    });

    cancelBtn.addEventListener('click', function () {
        ieWrapper.classList.remove('open');
    });

    // Thêm sự kiện 'dragover' để ngăn hành động mặc định của trình duyệt
    dropArea.addEventListener('dragover', (event) => {
        // Ngăn hành động mặc định để cho phép thả tệp vào khu vực này
        event.preventDefault();
    });

    // Thêm sự kiện 'drop' để xử lý khi tệp được thả vào khu vực 'dropArea'
    dropArea.addEventListener('drop', async (event) => {
        event.preventDefault();

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];

            // Kiểm tra đuôi file
            const validExtensions = ['.xls', '.xlsx'];
            const isValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

            // Kiểm tra kích thước file (giới hạn ở mức 2MB)
            const maxSize = 2 * 1024 * 1024; // 2MB
            const isValidSize = file.size <= maxSize;

            if (isValidExtension && isValidSize) {
                fileInput.files = files;

                resetProgress();
                let response = await checkFileImport(fileInput.files[0]);

                if (!response.hasError) {
                    keyCache = response.data;
                    // Nếu không có lỗi, hiển thị thông báo thành công
                    resultUpload.innerHTML = '';
                    importBtn.classList.remove('disable');
                    resultUpload.innerHTML = successHtml();

                    const btnDeleteFile = document.querySelector('.btn-delete-file');
                    btnDeleteFile.addEventListener('click', function () {
                        handleDeleteFile();
                    });

                } else {
                    // Nếu có lỗi, hiển thị thông báo và nút tải file lỗi về
                    resultUpload.innerHTML = '';
                    resultUpload.innerHTML = errorHtml('Tệp tải lên không đúng định dạng mẫu của chương trình', true);

                    const btnDownloadError = document.querySelector('.btn-download-error');
                    btnDownloadError.addEventListener('click', function () {
                        handleDownloadFileError(response.data, 'error_log.xlsx')
                    });

                    const btnDeleteFile = document.querySelector('.btn-delete-file');
                    btnDeleteFile.addEventListener('click', function () {
                        handleDeleteFile();
                    });
                }
            } else {
                let errorMessage = "Chỉ chấp nhận tệp định dạng Excel (.xls, .xlsx)";
                if (!isValidSize) {
                    errorMessage = "Kích thước tệp vượt quá giới hạn 2MB";
                }
                // Hiển thị thông báo lỗi
                resultUpload.innerHTML = errorHtml(errorMessage, false);
                const btnDeleteFile = document.querySelector('.btn-delete-file');
                btnDeleteFile.addEventListener('click', function () {
                    handleDeleteFile();
                });
            }
        }
    });


    fileInput.addEventListener('change', async function () {
        if (fileInput.files.length > 0) {
            resetProgress();
            let response = await checkFileImport(fileInput.files[0]);
            if (!response.hasError) {
                keyCache = response.data;
                // Nếu không có lỗi, hiển thị thông báo thành công
                resultUpload.innerHTML = '';
                importBtn.classList.remove('disable');
                resultUpload.innerHTML = successHtml();

                const btnDeleteFile = document.querySelector('.btn-delete-file');
                btnDeleteFile.addEventListener('click', function () {
                    handleDeleteFile();
                });

            } else {
                // Nếu có lỗi, hiển thị thông báo và nút tải file lỗi về
                resultUpload.innerHTML = '';
                resultUpload.innerHTML = errorHtml('Tệp tải lên không đúng định dạng mẫu của chương trình', true);

                const btnDownloadError = document.querySelector('.btn-download-error');
                btnDownloadError.addEventListener('click', function () {
                    handleDownloadFileError(response.data, 'error_log.xlsx')
                });

                const btnDeleteFile = document.querySelector('.btn-delete-file');
                btnDeleteFile.addEventListener('click', function () {
                    handleDeleteFile();
                });
            }
        }
    });

    /**
     * Hàm xử lí việc xóa file trong input type='file' khi người dùng tải file lên
     */
    function handleDeleteFile () {
        fileInput.value = '';
        resultUpload.innerHTML = '';
        importBtn.classList.add('disable');
    }

    /**
     * Xử lý tải file xuống trong trường hợp có lỗi
     * Nó tạo một phần tử thẻ liên kết tạm thời, thiết lập url và tên file 
     * Sau đó kích hoạt tải xuống bằng cách mô phỏng một cú click chuột vào phần tử này
     * Cuối cùng hàm sẽ dọn dẹp bằng cách xóa thẻ liên kết khỏi DOM và hủy URL để giải phóng bộ nhớ
     * @param {*} url URL của file cần tải xuống
     * @param {*} fileName Tên muốn đặt cho file tải xuống
     */
    function handleDownloadFileError (url, fileName) {
        //B1: Tạo thẻ liên kết tạm thời
        const a = document.createElement('a');

        //B2: Thiết lập url và tên file tải xuống
        a.href = url;
        a.download = fileName; // Đặt tên cho file lỗi

        //B3: Thêm thẻ liên kết tạm thời vào body và kích hoạt click để tải xuống
        document.body.appendChild(a);
        a.click();

        //B4: Xóa thẻ liên kết khỏi DOM sau khi tải xuống
        document.body.removeChild(a);

        //B5: Hủy URL để giải phóng bộ nhớ
        URL.revokeObjectURL(url);
    }

    /**
     * Hàm tạo html lỗi cho việc hiển thị thông báo lỗi và tải file lỗi
     * @param {*} errorMessage - Thông báo lỗi 
     * @param {*} isFile - Có cho hiển thị chức năng tải file lỗi xuống hay không
     * @returns trả về html cho việc hiển thị thông báo lỗi
     */
    const errorHtml = (errorMessage, isFile) => {
        return `
            <div class="result-item status-item status-fail">
                <div class="status-icon">
                    <i class="icofont-close-line-circled"></i>
                </div>
                <div class="text">${errorMessage}</div>
                ${
                    isFile ? `<button class="btn-download-error">Tải file lỗi về</button>` : ''
                }
                <div class="btn-delete-file">
                    <i class="icofont-close-line"></i>
                </div>
            </div>
        `
    }

    /**
     * Tạo html cho việc hiển thị thông báo thành công
     * @returns trả về html cho việc hiển thị thông báo lỗi
     */
    const successHtml = () => {
        return `
            <div class="result-item status-item status-success">
                <div class="status-icon">
                    <i class="icofont-check-line"></i>
                </div>
                <div class="text">Tải lên thành công</div>
                <div class="btn-delete-file">
                    <i class="icofont-close-line"></i>
                </div>
            </div>
        `
    }


    /**
     * Promise là một đối tượng trong JS để xử lý bất đồng bộ. 
     * Cho phép thực hiện các hành động mà không làm tắc nghẽn luồng thực thi chính của ứng dụng
     * Promise có 3 trạng thái:
     * - Pending (đang chờ): Trạng thái ban đầu, nghĩa là chưa có kết quả
     * - Fulfilled(Đã hoàn thành): Trạng thái cho biết rằng tác vụ bất đồng bộ đã hoàn thành thành công và có giá trị kết quả
     * - Rejected (Đã bị từ chối): Trạng thái cho biết rằng tác vụ bất đồng bộ đã thất bại và có lý do
     */

    /**
     * Kiểm tra tệp nhập khẩu bằng cách gửi tệp tới một api
     * @param {*} file tệp cần kiểm tra
     * @returns một promise chứa kết quả kiểm tra
     */
    async function checkFileImport(file) {
        const url = 'https://localhost:7004/api/v1/employees/check-file-import'; 
        const formData = new FormData();
        formData.append('file', file); 
    
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
    
            // Cập nhật tiến trình tải tệp
            xhr.upload.onprogress = function (event) {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    const progressBar = document.getElementById('progress-bar');
                    const progressText = document.getElementById('progress-text');
                    
                    // Cập nhật thanh tiến trình
                    progressBar.style.width = `${percentComplete}%`;
                    progressText.innerText = ''
                    progressText.innerText = `${Math.round(percentComplete)}%`; 

                    // Ẩn thanh tiến trình khi đạt 100%
                    if (percentComplete === 100) {
                        setTimeout(() => {
                            resetProgress();
                            const progressContainer = document.getElementById('progress-container');
                            progressContainer.style.display = 'none'; 
                            resultUpload.style.display = 'block'
                        }, 500); //Đợi 500ms trước khi thực hiện
                    }
                }
            };
    
            xhr.open('POST', url, true); // Mở kết nối POST tới URL đã chỉ định
    
            // Đặt loại phản hồi là arraybuffer để nhận dữ liệu nhị phân
            xhr.responseType = 'arraybuffer';
            
            // Xử lý khi yêu cầu hoàn thành
            xhr.onload = function () {
                if (xhr.status === 201) {
                    const data = xhr.response;
                    resolve({ hasError: false, data: data });
                } else if (xhr.status === 200) {
                    const blob = new Blob([xhr.response], { type: 'application/octet-stream' });
                    const fileUrl = window.URL.createObjectURL(blob); // Tạo url cho blob
                    resolve({ hasError: true, data: fileUrl }); //Trả về url blob cho lỗi
                } else {
                    console.error('Lỗi không xác định:', xhr.status);
                    resolve({ hasError: true, data: 'Lỗi không xác định xảy ra' });
                }
            };
    
            xhr.onerror = function () {
                console.error('Error:', xhr.status);
                resolve({ hasError: true, data: 'Lỗi kết nối với máy chủ' });
            };
    
            // Gửi yêu cầu với dữ liệu đã chuẩn bị
            xhr.send(formData);
        });
    }

    /**
     * Bắt sự kiện cho button nhập khẩu nhân viên
     * Gọi đến api nhập khẩu nhân viên bên back end
     */
    importBtn.addEventListener('click', function () {
        fetch('https://localhost:7004/api/v1/employees/import?key-code='+keyCache, {
                method: 'POST',
            })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    const stepContentItem1 = document.querySelector('.step-content-item-1');
                    const stepContentItem2 = document.querySelector('.step-content-item-2');
                    const stepNumber = document.querySelector('.step-number');
                    const stepItemActive = document.querySelector('.step-item.active');
                    const stepItem = document.querySelectorAll('.step-item')[1];
                    const stepItemContent1 = document.querySelectorAll('.step-item-content')[0];

                    stepItemContent1.style.border = '1px solid #2ea4f1';
                    stepItemContent1.style.color = '#2ea4f1'

                    const stepBorder = document.querySelector('.steps .step-item .step-border');

                    // Sửa màu `border` bằng cách thay đổi giá trị biến CSS
                    stepBorder.style.setProperty('--step-border-color', '#2ea4f1');

                    stepItemActive.classList.remove('active');
                    stepItem.classList.add('active')
                    stepNumber.innerHTML = '';
                    stepNumber.innerHTML = '&#10003;';

                    closeBtn.classList.remove('hidden');
                    cancelBtn.classList.add('hidden');
                    importBtn.classList.add('hidden');

                    stepContentItem1.classList.remove('active');
                    stepContentItem2.classList.add('active');
                } else {
                    resultUpload.innerHTML = '';
                    resultUpload.innerHTML = errorHtml("Nhập khẩu nhân viên thất bại", false);
                    importBtn.classList.add('disable');
                    const btnDeleteFile = document.querySelector('.btn-delete-file');
                    btnDeleteFile.addEventListener('click', function () {
                        handleDeleteFile()
                    });
                }
            })
            .catch((error) => {
                alert(error)
            });
    })
}


/**
 * Đặt lại các giá trị của thanh tiến trình về trạng thái ban đầu 
 */
function resetProgress () {
    const progressContainer = document.getElementById('progress-container');
    progressContainer.style.display = 'block';

    // Đặt lại tiến trình về 0
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    progressBar.style.width = '0%';
    progressText.innerText = '';
    progressText.innerText = '0%';

    // Ẩn thanh kết quả
    const resultContainer = document.querySelector('.result-upload');
    resultContainer.style.display = 'none';
}