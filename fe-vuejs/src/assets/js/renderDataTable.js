let Data = []

function fetchEmployeeData() {
    fetch('https://localhost:7004/api/v1/employees')
        .then(response => {
            
            return response.json(); 
        })
        .then(data => {
            Data = data;

            renderTable(Data);
        })
        .catch(error => {
            console.log(error)
        })
}

function renderTable(data) {
    const tableBody = document.querySelector('.table .body');
    tableBody.innerHTML = '';

    data.forEach((employee, index) => {
        const row = document.createElement('tr');
        row.classList.add('row');
        row.innerHTML = `
            <td>${index + 1}</td> 
            <td>${employee.employeeCode}</td> 
            <td>${employee.fullName}</td> 
            <td>${employee.sex}</td> 
            <td>${new Date(employee.dateOfBirth).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td> 
            <td>${employee.email}</td> 
            <td class="actions">
                ${employee.address}
                <button class="edit-btn" style="display: none;" data-tooltip="Ctrl + F2">
                    <img src="./assets/icon/info-48.png"/>
                </button>
                <button class="delete-btn" style="display: none;" data-tooltip="delete">
                    <img src="./assets/icon/delete-48.png"/>
                </button>
            </td> 
            
               `;
        row.addEventListener('click', () => myFunction(index))
        row.ondblclick = function () {
            showPopup(Data[index])    
        }

        tableBody.appendChild(row);
    });
}

function myFunction(index) {
    const rows = document.getElementsByClassName('row');
    
    const actionEdits = document.querySelectorAll('.actions .edit-btn');
    actionEdits.forEach(action => {
        action.style.display = 'none';
    });

    const currentRow = rows[index];
    const currentActionEdit = currentRow.querySelector('.actions .edit-btn');
    if (currentActionEdit) {
        currentActionEdit.style.display = 'block';
    }

    const actionDeletes = document.querySelectorAll('.actions .delete-btn');
    actionDeletes.forEach(action => {
        action.style.display = 'none';
    });

    const currentActionDelete = currentRow.querySelector('.actions .delete-btn');
    if (currentActionDelete) {
        currentActionDelete.style.display = 'block';
    }

    for (let i = 0; i < rows.length; i++) {
        rows[i].classList.remove('active');
    }

    currentRow.classList.add('active');
    const editBtn = document.getElementsByClassName('edit-btn')[index];

    editBtn.addEventListener('click', function() {
        showPopup(Data[index])
    })

    const deleteBtn = document.getElementsByClassName('delete-btn')[index];
    deleteBtn.addEventListener('click', function() {
        showDialog({title: 'Xác nhận xóa?', description: `Xóa bản nhân viên ${Data[index].name} ra khỏi hệ thống?`}, index);
    });

    document.onkeydown = function(e) {
        if (e.ctrlKey && e.keyCode === 113) {
            e.preventDefault();
            showPopup(Data[index])
        } else if (e.ctrlKey && e.keyCode === 46) {
            e.preventDefault();
            deleteData(index);
        } else if (e.keyCode === 27) {
            const popup = document.querySelector('.popup');
            popup.classList.remove('open');
            const dialogArea = document.querySelector(".dialog-area");
            dialogArea.classList.remove('open');
        }
    }
}
