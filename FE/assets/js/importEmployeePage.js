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
                                        <input value="" type="file" class="drag-box" title="Chọn tệp">
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

    closeBtn.addEventListener('click', function() {
        previousApi = '';
        paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${branch}&limit=10&offset=0`);
        ieWrapper.classList.remove('open');
    })

    titleBarClose.addEventListener('click', function() {
        previousApi = '';
        paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${branch}&limit=10&offset=0`);
        ieWrapper.classList.remove('open');
    });

    cancelBtn.addEventListener('click', function() {
        ieWrapper.classList.remove('open');
    });

    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault(); // Ngăn chặn hành động mặc định  
    });

    dropArea.addEventListener('drop', async (event) => {
        event.preventDefault();

        const files = event.dataTransfer.files; // Lấy tệp từ sự kiện  
        fileInput.files = files; // Gán các tệp vào input  
        if (files.length > 0) { // Kiểm tra có tệp được kéo vào
            let isCheck = await checkFileImport(files[0]);
            if (isCheck) {
                resultUpload.innerHTML = '';
                importBtn.classList.remove('disable')
                resultUpload.innerHTML = `
                        <div class="result-item status-item status-success">
                            <div class="status-icon">
                                <i class="icofont-close-line-circled"></i>
                            </div>
                            <div class="text">Tải lên thành công</div>
                            <div class="btn-delete-file">
                                <i class="icofont-close-line"></i>
                            </div>
                        </div>
                    `;
                const btnDeleteFile = document.querySelector('.btn-delete-file');
                btnDeleteFile.addEventListener('click', function () {
                    fileInput.value = '';
                    resultUpload.innerHTML = '';
                })
            } else {
                resultUpload.innerHTML = '';
                resultUpload.innerHTML = `
                        <div class="result-item status-item status-fail">
                            <div class="status-icon">
                                <i class="icofont-close-line-circled"></i>
                            </div>
                            <div class="text">Tệp tải lên không đúng định dạng mẫu của chương trình</div>
                            <div class="btn-delete-file">
                                <i class="icofont-close-line"></i>
                            </div>
                        </div>
                    `;

                const btnDeleteFile = document.querySelector('.btn-delete-file');
                btnDeleteFile.addEventListener('click', function () {
                    fileInput.value = '';
                    resultUpload.innerHTML = '';
                    importBtn.classList.add('disable');
                })
            }
        } else {
            alert("Chưa chọn file.");
        }
    });

    fileInput.addEventListener('change', async function () {
        if (fileInput.files.length > 0) {
            let isCheck = await checkFileImport(fileInput.files[0]);
            if (isCheck) {
                resultUpload.innerHTML = '';
                importBtn.classList.remove('disable');
                resultUpload.innerHTML = `
                        <div class="result-item status-item status-success">
                            <div class="status-icon">
                                <i class="icofont-close-line-circled"></i>
                            </div>
                            <div class="text">Tải lên thành công</div>
                            <div class="btn-delete-file">
                                <i class="icofont-close-line"></i>
                            </div>
                        </div>
                    `;
                const btnDeleteFile = document.querySelector('.btn-delete-file');
                btnDeleteFile.addEventListener('click', function () {
                    fileInput.value = '';
                    resultUpload.innerHTML = '';
                    importBtn.classList.add('disable');
                });

            } else {
                resultUpload.innerHTML = '';
                resultUpload.innerHTML = `
                        <div class="result-item status-item status-fail">
                            <div class="status-icon">
                                <i class="icofont-close-line-circled"></i>
                            </div>
                            <div class="text">Tệp tải lên không đúng định dạng mẫu của chương trình</div>
                            <div class="btn-delete-file">
                                <i class="icofont-close-line"></i>
                            </div>
                        </div>
                    `;

                const btnDeleteFile = document.querySelector('.btn-delete-file');
                btnDeleteFile.addEventListener('click', function () {
                    fileInput.value = '';
                    resultUpload.innerHTML = '';
                    importBtn.classList.add('disable');
                })
            }
        }
    })

    async function checkFileImport(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('https://localhost:7004/api/v1/employees/check-file-import', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.text();
            if (data == 'true') {
                return true;
            }
            return false;
        } catch (error) {
            alert(`Error: ${error.message}`);
            return false;
        }
    }

    importBtn.addEventListener('click', function () {
        fetch('https://localhost:7004/api/v1/employees/import', {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            
            const stepContentItem1= document.querySelector('.step-content-item-1');
            const stepContentItem2= document.querySelector('.step-content-item-2');
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

            
        })
        .catch((error) => {
            alert(error)
        });
    })
}