
let dataAge;


/**
 * Tạo biểu đồ dựa vào các thông số được cung cấp
 * @param {*} ctx - nơi biểu đồ sẽ được vẽ
 * @param {*} chartType - loại biểu đồ
 * @param {*} labels - Mảng chứa các nhãn cho từng phần tử trong dataset
 * @param {*} label - Nhã cho dataset
 * @param {*} dataPoints - Mảng chứa các giá trị dữ liệu tương ứng với từng phần tử trong dataset
 * @param {*} backgroundColors - Mảng chứa màu nền cho từng phần tử trong dataset
 * @returns - trả về đối tượng biểu đồ đã được tạo
 */

function createChart(ctx, chartType, labels, label, dataPoints, backgroundColors) {
    const DATA = {
        labels: labels, // Mỗi label tương ứng với phần tử của dataset
        datasets: [{
            label: label,// Label cho dataset
            data: dataPoints, // Giá trị dữ liệu cho từng label
            backgroundColor: backgroundColors, // Màu sắc tương ứng với từng phần
            hoverOffset: 4
        }]
    };
    const CONFIG = {
        type: chartType,
        data: DATA,
    };
    return new Chart(ctx, CONFIG);
}

function fetchAgeStatistics () {
    fetch('https://localhost:7004/api/v1/employees/employee-statistics-by-age')
        .then(response => {
            return response.json();
        }) 
        .then(data => {
            dataAge = data;
        })
        .catch(error => {
            console.log(error)
        })
}

fetchAgeStatistics()

/**
 * Tạo báo cáo thống kê nhân viên theo độ tuổi lên giao diện
 */
function renderReport() {
    const HTML = `<div class="report-container">
            <div class="report-age">
                <div class="title">Cơ cấu nhân viên theo độ tuổi</div>
                <canvas id="ageChart"></canvas>
            </div>
        </div>
    `
    document.getElementById('container').innerHTML = HTML;

    const CTX = document.getElementById('ageChart');
    const LABELS = [];
    const DATAPOINTS = [];

    dataAge.map(item => {
        LABELS.push(item.ageGroup);
        DATAPOINTS.push(item.employeeCount)
    })


    const BACKGROUNDCOLORS = [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
    ];

    createChart(CTX, 'doughnut', LABELS, 'Thống kê nhân viên theo độ tuổi', DATAPOINTS, BACKGROUNDCOLORS);
}