function showDialog (data ={}, index) {
    const dialogHTML = `
        <div class="dialog">
            <div class="dialog__header">
            <p>${data.title}</p>
            <button class="close" tabindex="1">
                <img src="./assets/icon/close-48.png"/>
            </button>
            </div>
            <div class="dialog__content">
                <p>${data.description}</p>
            </div>
            <div class="dialog__footer">
                <button class="cancel" tabindex="2">Đóng</button>
                <button class="ok tabindex="3">Ok</button>
            </div>
        </div>
    `;

    const dialogArea = document.querySelector(".dialog-area");
    dialogArea.innerHTML = dialogHTML;
    dialogArea.classList.add('open');

    const close = document.querySelector(".close");
    close.addEventListener('click', function() {
        dialogArea.classList.remove('open');
    });

    const cancel = document.querySelector('.cancel');
    cancel.addEventListener('click', function() {
        dialogArea.classList.remove('open')
    });

    const okBtn = document.querySelector(".ok");
    okBtn.addEventListener('click', function() {
        deleteData(index);
        dialogArea.classList.remove('open');
    });

    
    function deleteData (index) {
        fakeData.splice(index, 1);
        renderTable(fakeData);
    }
}