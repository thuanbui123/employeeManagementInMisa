import { renderTable, createRowFooter, setData, setSumRows, setLimit } from "./renderDataTable.js";
let previousApi = null;

export function setPreviousApi(value) {
    previousApi = value;
}

export function getPreviousApi() {
    return previousApi;
}

/**
 * Gọi api để lấy dữ liệu từ backend
 * @param {*} url Địa chỉ url của Api
 * @returns Dữ liệu Json trả về từ api
 */
export async function fetchData (url) {
    try {
        const RESPONSE = await fetch(url);
        return await RESPONSE.json();
    } catch (error) {
        return console.log(error);
    }
}

/**
 * Hàm phân trang để lấy dữ liệu từ api và cập nhật giao diện
 * @param {*} api Địa chỉ api để lấy dữ liệu
 */
export function paginate (api) {
    if (api !== previousApi) {
        previousApi = api;
        fetch(api)
            .then(response => response.json())
            .then(data => {
                setData(data.employees)
                renderTable(data.employees);
                setLimit(Cookies.get('rowsPerPageLimit'));
                createRowFooter(data.sumRows);
                setSumRows(data.sumRows)
            })
            .catch(error => {
                console.log(error);
            });
    }
};

/**
 * Mảng chí các phần tử trong bộ lọc chi nhánh
 */
const BRANCHOPTIONS = [
    {
        value: 'Hà Nội'
    },
    {
        value: 'TP. Hồ Chí Minh'
    },
    {
        value: 'find-all'
    }
]

//Lưu các các phần tử chi nhánh vào localStorage
localStorage.setItem('branches', JSON.stringify(BRANCHOPTIONS));

/**
 * Kiểm tra tính hợp lệ của email
 * @param {*} email email cần kiểm tra
 * @returns true nếu email hợp lệ, ngược lại trả về false
 */
function validateEmail (email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

/**
 * Kiểm tra dữ liệu đầu vào của email mà người dùng nhập
 * @param {*} input thẻ input chứa dữ liệu email mà người dùng nhập vào
 */
export function validateEmailInput(input) {
    const EMAIL = input.value;

    // Kiểm tra nếu EMAIL không hợp lệ
    if (!validateEmail(EMAIL)) {
        input.setCustomValidity('Email không hợp lệ!');
    } else if (EMAIL === '') {
        input.setCustomValidity('Email không được để trống!')
    } else {
        input.setCustomValidity(''); // Nếu email hợp lệ, xóa thông báo lỗi
    }
}

/**
 * Kiểm tra tính hợp lệ của số điện thoại
 * @param {*} numberPhone Số điện thoại cần kiểm tra
 * @returns true - nếu số điện thoại hợp lệ, ngược lại trả về false
 */
function validateNumberPhone (numberPhone) {
    return String(numberPhone)
        .toLowerCase()
        .match(
            /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})$/
        );
};

/**
 * Kiểm tra dữ liệu đầu vào của số điện thoại
 * @param {*} input thẻ input chứa dữ liệu số điện thoại mà người dùng nhập
 */
export function validateNumberPhoneInput (input) {
    const NUMBERPHONE = input.value;

    if (!validateNumberPhone(NUMBERPHONE)) {
        input.setCustomValidity('Số điện thoại không hợp lệ!')
    } else if (NUMBERPHONE === '') {
        input.setCustomValidity('Số điện thoại không được để trống!')
    } else {
        input.setCustomValidity('')
    }
}

/**
 * Kiểm tra tính hợp lệ của số căn cước công dân
 * @param {*} identityNumber Số căn cước công dân cần kiểm tra
 * @returns true - nếu số CCCD hợp lệ, ngược lại trả về false
 */
function validateIdentityNumber(identityNumber) {
    return String(identityNumber)
        .match(/^\d{12}$/);
}

/**
 * Kiểm tra dữ liệu đầu vào của số CCCD 
 * @param {*} input thẻ input chứa dữ liệu về số CCCD mà người dùng nhập
 */
export function validateIdentityNumberInput (input) {
    const IDENTITYNUMBER = input.value;
    if (!validateIdentityNumber(IDENTITYNUMBER)) {
        input.setCustomValidity('Số CMTND không hợp lệ!')
    } else if (IDENTITYNUMBER === '') {
        input.setCustomValidity('Số CMTND không được để trống!')
    } else {
        input.setCustomValidity('')
    }
}

/**
 * Kiểm tra xem chuỗi lương có hợp lệ hay không
 * Một chuỗi lương được coi là hợp lệ nếu: 
 * - Nó là một chuỗi
 * - Nó có thể được chuyển đổi thành một số hợp lệ
 * @param {*} salaryStr - chuỗi cần kiểm tra
 * @returns 
 * - true: nếu chuỗi hợp lệ
 * - false: nếu chuỗi không hợp lệ
 */
function validateSalary(salaryStr) {
    if (typeof salaryStr !== 'string') return false;
    const SANITIZEDSALARY = salaryStr.replace(/\./g, '');
    return !isNaN(SANITIZEDSALARY) && !isNaN(parseInt(SANITIZEDSALARY));
}

/**
 * Kiểm tra dữ liệu đầu vào của lương
 * @param {*} input thẻ input chứa dữ liệu đầu vào của lương mà người dùng nhập
 * @returns 
 */
export function validateSalaryInput (input) {
    let value = input.value;
    if (value === '') {
        input.value = 0
        input.setCustomValidity('')
        return;
    }
    if (!validateSalary(value)) {
        input.setCustomValidity('Lương không hợp lệ!');
    } else {
        input.setCustomValidity('')
    }
}

/**
 * Kiểm tra giá trị của tài khoản ngân hàng có hợp lệ hay không
 * Chỉ kiểm tra khi chuỗi khác '' và được coi là hợp lệ khi:
 * - Nó là một chuỗi số và có độ dài từ 8 đến 15 ký tự
 * @param {*} value 
 * @returns 
 */
function validateBankAccount (value) {
    if (value !== '') {
        return String(value)
            .toLowerCase()
            .match(
                /\d{8,15}$/
            )
    }
    return true;
}

export function validateBankAccountInput (input) {
    let value = input.value;
    if (!validateBankAccount(value)) {
        input.setCustomValidity('Tài khoản ngân hàng không hợp lệ!');
    } else  {
        input.setCustomValidity('');
    }
}
