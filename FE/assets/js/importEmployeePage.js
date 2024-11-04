let keyCache;

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

                let response = await checkFileImport(fileInput.files[0]);

                if (!response.hasError) {
                    keyCache = response.data;
                    // Nếu không có lỗi, hiển thị thông báo thành công
                    resultUpload.innerHTML = '';
                    importBtn.classList.remove('disable');
                    resultUpload.innerHTML = successHtml();

                    const btnDeleteFile = document.querySelector('.btn-delete-file');
                    btnDeleteFile.addEventListener('click', function () {
                        fileInput.value = '';
                        resultUpload.innerHTML = '';
                        importBtn.classList.add('disable');
                    });

                } else {
                    // Nếu có lỗi, hiển thị thông báo và nút tải file lỗi về
                    resultUpload.innerHTML = '';
                    resultUpload.innerHTML = errorHtml('Tệp tải lên không đúng định dạng mẫu của chương trình', true);

                    const btnDownloadError = document.querySelector('.btn-download-error');
                    btnDownloadError.addEventListener('click', function () {
                        const url = response.data;
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'error_log.xlsx'; // Đặt tên cho file lỗi
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    });

                    const btnDeleteFile = document.querySelector('.btn-delete-file');
                    btnDeleteFile.addEventListener('click', function () {
                        fileInput.value = '';
                        resultUpload.innerHTML = '';
                        importBtn.classList.add('disable');
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
                    fileInput.value = '';
                    resultUpload.innerHTML = '';
                    importBtn.classList.add('disable');
                });
            }
        }
    });


    fileInput.addEventListener('change', async function () {
        if (fileInput.files.length > 0) {
            let response = await checkFileImport(fileInput.files[0]);
            if (!response.hasError) {
                keyCache = response.data;
                // Nếu không có lỗi, hiển thị thông báo thành công
                resultUpload.innerHTML = '';
                importBtn.classList.remove('disable');
                resultUpload.innerHTML = successHtml();

                const btnDeleteFile = document.querySelector('.btn-delete-file');
                btnDeleteFile.addEventListener('click', function () {
                    fileInput.value = '';
                    resultUpload.innerHTML = '';
                    importBtn.classList.add('disable');
                });

            } else {
                // Nếu có lỗi, hiển thị thông báo và nút tải file lỗi về
                resultUpload.innerHTML = '';
                resultUpload.innerHTML = errorHtml('Tệp tải lên không đúng định dạng mẫu của chương trình', true);

                const btnDownloadError = document.querySelector('.btn-download-error');
                btnDownloadError.addEventListener('click', function () {
                    const url = response.data;
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'error_log.xlsx'; // Đặt tên cho file lỗi
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                });

                const btnDeleteFile = document.querySelector('.btn-delete-file');
                btnDeleteFile.addEventListener('click', function () {
                    fileInput.value = '';
                    resultUpload.innerHTML = '';
                    importBtn.classList.add('disable');
                });
            }
        }
    });

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

    async function checkFileImport(file) {
        const url = 'https://localhost:7004/api/v1/employees/check-file-import'; 
        const formData = new FormData();
        formData.append('file', file); 
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });
    
            if (response.status === 201) {
                const data = await response.text();
                return { hasError: false, data: data };
            } else if (response.status === 200) {
                const blob = await response.blob();
                const fileUrl = window.URL.createObjectURL(blob);
    
                return { hasError: true, data: fileUrl };
            } else {
                console.error('Lỗi không xác định:', response.status);
                return { hasError: true, data: 'Lỗi không xác định xảy ra' };
            }
        } catch (error) {
            console.error('Error:', error);
            return { hasError: true, data: 'Lỗi kết nối với máy chủ' };
        }
    }
    
    

    // async function checkFileImport(file) {
    //     const formData = new FormData();
    //     formData.append('file', file);

    //     try {
    //         const response = await fetch('https://localhost:7004/api/v1/employees/check-file-import', {
    //             method: 'POST',
    //             body: formData,
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Error: ${response.status}`);
    //         }

    //         // Lấy dữ liệu trả về dưới dạng Blob
    //         const blob = await response.blob();

    //         // Kiểm tra nếu có lỗi
    //         if (blob.size > 0) {
    //             // Nếu có dữ liệu lỗi, trả về blob
    //             return {
    //                 hasError: true,
    //                 file: blob
    //             };
    //         } else {
    //             // Nếu không có dữ liệu lỗi
    //             return {
    //                 hasError: false,
    //                 file: response.text()
    //             };
    //         }
    //     } catch (error) {
    //         alert(`Error: ${error.message}`);
    //         return {
    //             hasError: true,
    //             file: null
    //         }; // Giả sử không có file lỗi nếu có lỗi trong API
    //     }
    // }


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
                    fileInput.value = '';
                    resultUpload.innerHTML = '';
                    importBtn.classList.add('disable');
                });
                }
            })
            .catch((error) => {
                alert(error)
            });
    })
}