function loadHeader() {
    const headerHTML = `
        <ul class="header-left">
            <li class="toggle-sidebar">
                <img src="./assets/img/toggle.png" />
            </li>
            <li><img class="logo-img" src="./assets/cukcuk-logo.png" /></li>
            <li class="menu">
                <a>
                    <p>Chi nhánh Hà Nội</p>
                    <i class="icofont-curved-down"></i>
                </a>
                <ul class="subnav">
                    <li>Chi nhánh TP. Hồ Chí Minh</li>
                </ul>
            </li>
        </ul>
        <div class="header-right">
            <img src="./assets/icon/avatar-default.png" alt="avatar" id="avatar">
            <p class="name">Bùi Văn Thuân</p>
            <button class="option">
                <img src="./assets/icon/option.png" alt="option">
            </button>
        </div>
    `;

    document.getElementById('header').innerHTML = headerHTML;
}

document.addEventListener('DOMContentLoaded', loadHeader);

document.addEventListener('DOMContentLoaded', () => {
    const toggleSidebar = document.getElementsByClassName('toggle-sidebar')[0]; 
    const sidebar = document.getElementById('sidebar');
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', () => {
            sidebar.classList.toggle('close');
        });
    } else {
        console.error('Toggle button not found');
    }
});

