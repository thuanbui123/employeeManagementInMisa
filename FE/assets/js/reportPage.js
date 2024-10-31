function createChart(ctx, chartType, labels, label, dataPoints, backgroundColors) {
    const data = {
        labels: labels, // Mỗi label tương ứng với phần tử của dataset
        datasets: [{
            label: label,// Label cho dataset
            data: dataPoints, // Giá trị dữ liệu cho từng label
            backgroundColor: backgroundColors, // Màu sắc tương ứng với từng phần
            hoverOffset: 4
        }]
    };
    const config = {
        type: chartType,
        data: data,
    };
    return new Chart(ctx, config);
}

let dataAge;

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

function renderReport() {
    const html = `<div class="report-container">
            <div class="report-age">
                <div class="title">Cơ cấu nhân viên theo độ tuổi</div>
                <canvas id="ageChart"></canvas>
            </div>
        </div>
    `
    document.getElementById('container').innerHTML = html;

    const ctx = document.getElementById('ageChart');
    const labels = [];
    const dataPoints = [];

    dataAge.map(item => {
        labels.push(item.ageGroup);
        dataPoints.push(item.employeeCount)
    })


    const backgroundColors = [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
    ];

    createChart(ctx, 'doughnut', labels, 'Thống kê nhân viên theo độ tuổi', dataPoints, backgroundColors);
}