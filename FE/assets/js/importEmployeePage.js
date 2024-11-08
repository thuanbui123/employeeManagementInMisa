import { getBranch } from "./header.js";
import { fetchNewCode } from "./popup.js";
import { getCurrentPage, getIsDesc, getLimit } from "./renderDataTable.js";
import { paginate, setPreviousApi } from "./service.js";

let keyCache;

/**
 * Hàm tạo ra html để hiện thị trang nhập khẩu nhân viên
 */
export function showImportEmployee() {
    const IMPORTEMPLOYEEHTML = `
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
                                            <a href="../assets/Danh sách nhân viên.xlsx" download='file-example.xlsx' class="download-item" >tại đây</a>
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
    const IEWRAPPER = document.querySelector('.ie-wrapper');
    IEWRAPPER.innerHTML = IMPORTEMPLOYEEHTML;
    IEWRAPPER.classList.add('open');
    const DROPAREA = document.querySelector('.drag-container');
    const FILEINPUT = document.querySelector('.drag-box');
    const IMPORTBTN = document.querySelector('.import-btn');
    const RESULTUPLOAD = document.querySelector('.result-upload');
    const TITLEBARCLOSE = document.querySelector('.title-bar-close');
    const CANCELBTN = document.querySelector('.cancel-btn');
    const CLOSEBTN = document.querySelector('.close-ie-popup');

    CLOSEBTN.addEventListener('click', function () {
        setPreviousApi('');
        let offset = getCurrentPage() * getLimit();
        paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${getBranch()}&limit=${getLimit()}&offset=${offset}&is-desc=${getIsDesc()}`);
        fetchNewCode();
        IEWRAPPER.classList.remove('open');
    })

    TITLEBARCLOSE.addEventListener('click', function () {
        setPreviousApi('');
        let offset = getCurrentPage() * getLimit();
        paginate(`https://localhost:7004/api/v1/employees/paginate?branch=${getBranch()}&limit=${getLimit()}&offset=${offset}&is-desc=${getIsDesc()}`);
        fetchNewCode();
        IEWRAPPER.classList.remove('open');
    });

    CANCELBTN.addEventListener('click', function () {
        IEWRAPPER.classList.remove('open');
    });

    // Thêm sự kiện 'dragover' để ngăn hành động mặc định của trình duyệt
    DROPAREA.addEventListener('dragover', (event) => {
        // Ngăn hành động mặc định để cho phép thả tệp vào khu vực này
        event.preventDefault();
    });

    // Thêm sự kiện 'drop' để xử lý khi tệp được thả vào khu vực 'DROPAREA'
    DROPAREA.addEventListener('drop', async (event) => {
        event.preventDefault();

        const FILES = event.dataTransfer.files;
        if (FILES.length > 0) {
            const FILE = FILES[0];

            // Kiểm tra đuôi file
            const VALIDEXTENSIONS = ['.xls', '.xlsx'];
            const ISVALIDEXTENSION = VALIDEXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));

            // Kiểm tra kích thước file (giới hạn ở mức 2MB)
            const MAXSIZE = 2 * 1024 * 1024; // 2MB
            const ISVALIDSIZE = FILE.size <= MAXSIZE;

            if (ISVALIDEXTENSION && ISVALIDSIZE) {
                FILEINPUT.files = FILES;

                resetProgress();
                let response = await checkFileImport(FILEINPUT.files[0]);

                if (!response.hasError) {
                    keyCache = response.data;
                    // Nếu không có lỗi, hiển thị thông báo thành công
                    RESULTUPLOAD.innerHTML = '';
                    IMPORTBTN.classList.remove('disable');
                    RESULTUPLOAD.innerHTML = SUCCESSHTML();

                    const BTNDELETEFILE = document.querySelector('.btn-delete-file');
                    BTNDELETEFILE.addEventListener('click', function () {
                        handleDeleteFile();
                    });

                } else {
                    // Nếu có lỗi, hiển thị thông báo và nút tải file lỗi về
                    RESULTUPLOAD.innerHTML = '';
                    RESULTUPLOAD.innerHTML = ERRORHTML('Tệp tải lên không đúng định dạng mẫu của chương trình', true);

                    const BTNDOWNLOADERROR = document.querySelector('.btn-download-error');
                    BTNDOWNLOADERROR.addEventListener('click', function () {
                        handleDownloadFileError(response.data, 'error_log.xlsx')
                    });

                    const BTNDELETEFILE = document.querySelector('.btn-delete-file');
                    BTNDELETEFILE.addEventListener('click', function () {
                        handleDeleteFile();
                    });
                }
            } else {
                let errorMessage = "Chỉ chấp nhận tệp định dạng Excel (.xls, .xlsx)";
                if (!ISVALIDSIZE) {
                    errorMessage = "Kích thước tệp vượt quá giới hạn 2MB";
                }
                // Hiển thị thông báo lỗi
                RESULTUPLOAD.innerHTML = ERRORHTML(errorMessage, false);
                const BTNDELETEFILE = document.querySelector('.btn-delete-file');
                BTNDELETEFILE.addEventListener('click', function () {
                    handleDeleteFile();
                });
            }
        }
    });


    FILEINPUT.addEventListener('change', async function () {
        if (FILEINPUT.files.length > 0) {
            resetProgress();
            let response = await checkFileImport(FILEINPUT.files[0]);
            if (!response.hasError) {
                keyCache = response.data;
                // Nếu không có lỗi, hiển thị thông báo thành công
                RESULTUPLOAD.innerHTML = '';
                IMPORTBTN.classList.remove('disable');
                RESULTUPLOAD.innerHTML = SUCCESSHTML();

                const BTNDELETEFILE = document.querySelector('.btn-delete-file');
                BTNDELETEFILE.addEventListener('click', function () {
                    handleDeleteFile();
                });

            } else {
                // Nếu có lỗi, hiển thị thông báo và nút tải file lỗi về
                RESULTUPLOAD.innerHTML = '';
                RESULTUPLOAD.innerHTML = ERRORHTML('Tệp tải lên không đúng định dạng mẫu của chương trình', true);

                const BTNDOWNLOADERROR = document.querySelector('.btn-download-error');
                BTNDOWNLOADERROR.addEventListener('click', function () {
                    handleDownloadFileError(response.data, 'error_log.xlsx')
                });

                const BTNDELETEFILE = document.querySelector('.btn-delete-file');
                BTNDELETEFILE.addEventListener('click', function () {
                    handleDeleteFile();
                });
            }
        }
    });

    /**
     * Hàm xử lí việc xóa file trong input type='file' khi người dùng tải file lên
     */
    function handleDeleteFile () {
        FILEINPUT.value = '';
        RESULTUPLOAD.innerHTML = '';
        IMPORTBTN.classList.add('disable');
    }

    /**
     * Xử lý tải file xuống trong trường hợp có lỗi
     * Nó tạo một phần tử thẻ liên kết tạm thời, thiết lập URL và tên file 
     * Sau đó kích hoạt tải xuống bằng cách mô phỏng một cú click chuột vào phần tử này
     * Cuối cùng hàm sẽ dọn dẹp bằng cách xóa thẻ liên kết khỏi DOM và hủy URL để giải phóng bộ nhớ
     * @param {*} url URL của file cần tải xuống
     * @param {*} fileName Tên muốn đặt cho file tải xuống
     */
    function handleDownloadFileError (url, fileName) {
        //B1: Tạo thẻ liên kết tạm thời
        const A = document.createElement('a');

        //B2: Thiết lập url và tên file tải xuống
        A.href = url;
        A.download = fileName; // Đặt tên cho file lỗi

        //B3: Thêm thẻ liên kết tạm thời vào body và kích hoạt click để tải xuống
        document.body.appendChild(A);
        A.click();

        //B4: Xóa thẻ liên kết khỏi DOM sau khi tải xuống
        document.body.removeChild(A);

        //B5: Hủy URL để giải phóng bộ nhớ
        URL.revokeObjectURL(url);
    }

    /**
     * Hàm tạo html lỗi cho việc hiển thị thông báo lỗi và tải file lỗi
     * @param {*} errorMessage - Thông báo lỗi 
     * @param {*} isFile - Có cho hiển thị chức năng tải file lỗi xuống hay không
     * @returns trả về html cho việc hiển thị thông báo lỗi
     */
    const ERRORHTML = (errorMessage, isFile) => {
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
    const SUCCESSHTML = () => {
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
        const URL = 'https://localhost:7004/api/v1/employees/check-file-import'; 
        const FORMDATA = new FormData();
        FORMDATA.append('file', file); 
    
        return new Promise((resolve) => {
            const XHR = new XMLHttpRequest();
    
            // Cập nhật tiến trình tải tệp
            XHR.upload.onprogress = function (event) {
                if (event.lengthComputable) {
                    const PERCENTCOMPLETE = (event.loaded / event.total) * 100;
                    const PROGRESSBAR = document.getElementById('progress-bar');
                    const PROGRESSTEXT = document.getElementById('progress-text');
                    
                    // Cập nhật thanh tiến trình
                    PROGRESSBAR.style.width = `${PERCENTCOMPLETE}%`;
                    PROGRESSTEXT.innerText = ''
                    PROGRESSTEXT.innerText = `${Math.round(PERCENTCOMPLETE)}%`; 

                    // Ẩn thanh tiến trình khi đạt 100%
                    if (PERCENTCOMPLETE === 100) {
                        setTimeout(() => {
                            resetProgress();
                            const PROGRESSCONTAINER = document.getElementById('progress-container');
                            PROGRESSCONTAINER.style.display = 'none'; 
                            RESULTUPLOAD.style.display = 'block'
                        }, 500); //Đợi 500ms trước khi thực hiện
                    }
                }
            };
    
            XHR.open('POST', URL, true); // Mở kết nối POST tới URL đã chỉ định
    
            // Đặt loại phản hồi là arraybuffer để nhận dữ liệu nhị phân
            XHR.responseType = 'arraybuffer';
            
            // Xử lý khi yêu cầu hoàn thành
            XHR.onload = function () {
                if (XHR.status === 201) {
                    let data = XHR.response;

                    // Sử dụng TextDecoder để chuyển đổi ArrayBuffer thành text
                    let decoder = new TextDecoder('utf-8'); // Chỉ định kiểu mã hóa là UTF-8
                    let text = decoder.decode(data);
                    resolve({ hasError: false, data: text });
                } else if (XHR.status === 200) {
                    let blob = new Blob([XHR.response], { type: 'application/octet-stream' });
                    let fileURL = window.URL.createObjectURL(blob); // Tạo URL cho blob
                    resolve({ hasError: true, data: fileURL }); //Trả về URL blob cho lỗi
                } else {
                    console.error('Lỗi không xác định:', XHR.status);
                    resolve({ hasError: true, data: 'Lỗi không xác định xảy ra' });
                }
            };
    
            XHR.onerror = function () {
                console.error('Error:', XHR.status);
                resolve({ hasError: true, data: 'Lỗi kết nối với máy chủ' });
            };
    
            // Gửi yêu cầu với dữ liệu đã chuẩn bị
            XHR.send(FORMDATA);
        });
    }

    /**
     * Bắt sự kiện cho button nhập khẩu nhân viên
     * Gọi đến api nhập khẩu nhân viên bên back end
     */
    IMPORTBTN.addEventListener('click', function () {
        fetch('https://localhost:7004/api/v1/employees/import?key-code='+keyCache, {
                method: 'POST',
            })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    const STEPCONTENTITEM1 = document.querySelector('.step-content-item-1');
                    const STEPCONTENTITEM2 = document.querySelector('.step-content-item-2');
                    const STEPNUMBER = document.querySelector('.step-number');
                    const STEPITEMACTIVE = document.querySelector('.step-item.active');
                    const STEPITEM = document.querySelectorAll('.step-item')[1];
                    const STEPITEMCONTENT1 = document.querySelectorAll('.step-item-content')[0];

                    STEPITEMCONTENT1.style.border = '1px solid #2ea4f1';
                    STEPITEMCONTENT1.style.color = '#2ea4f1'

                    const STEPBORDER = document.querySelector('.steps .step-item .step-border');

                    // Sửa màu `border` bằng cách thay đổi giá trị biến CSS
                    STEPBORDER.style.setProperty('--step-border-color', '#2ea4f1');

                    STEPITEMACTIVE.classList.remove('active');
                    STEPITEM.classList.add('active')
                    STEPNUMBER.innerHTML = '';
                    STEPNUMBER.innerHTML = '&#10003;';

                    CLOSEBTN.classList.remove('hidden');
                    CANCELBTN.classList.add('hidden');
                    IMPORTBTN.classList.add('hidden');

                    STEPCONTENTITEM1.classList.remove('active');
                    STEPCONTENTITEM2.classList.add('active');
                } else {
                    RESULTUPLOAD.innerHTML = '';
                    RESULTUPLOAD.innerHTML = ERRORHTML("Nhập khẩu nhân viên thất bại", false);
                    IMPORTBTN.classList.add('disable');
                    const BTNDELETEFILE = document.querySelector('.btn-delete-file');
                    BTNDELETEFILE.addEventListener('click', function () {
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
    const PROGRESSCONTAINER = document.getElementById('progress-container');
    PROGRESSCONTAINER.style.display = 'block';

    // Đặt lại tiến trình về 0
    const PROGRESSBAR = document.getElementById('progress-bar');
    const PROGRESSTEXT = document.getElementById('progress-text');
    PROGRESSBAR.style.width = '0%';
    PROGRESSTEXT.innerText = '';
    PROGRESSTEXT.innerText = '0%';

    // Ẩn thanh kết quả
    const RESULTCONTAINER = document.querySelector('.result-upload');
    RESULTCONTAINER.style.display = 'none';
}