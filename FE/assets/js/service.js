let previousApi = null;

const paginate = (api) => {
    if (api !== previousApi) {
        previousApi = api;
        fetch(api)
            .then(response => response.json())
            .then(data => {
                Data = data.employees;
                renderTable(data.employees);
                createRowFooter(data.sumRows);
                sumRows = data.sumRows; // Cập nhật tổng số hàng
            })
            .catch(error => {
                console.log(error);
            });
    }
};

const branchOptions = [
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

localStorage.setItem('branches', JSON.stringify(branchOptions));

const positionOptions = [
    {
        value: "Intern"
    },
    {
        value: 'Fresher'
    }, 
    {
        value: 'Junior'
    },
    {
        value: 'Product Manager'
    }
]

localStorage.setItem('positions', JSON.stringify(positionOptions));
