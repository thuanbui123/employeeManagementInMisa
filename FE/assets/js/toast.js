/**
 * Hàm tạo toast message để hiển thị thông báo
 * @param {*} param0 chứa các thông tin cần thiết cho toast message như:
 * title: tiêu đề của toast
 * message: nội dung thông báo
 * type: loại của toast message được tạo
 * duration: thời gian hiển thị của toast message
 * callback: hàm đươc gọi sau khi toast message ẩn
 */
function toast({ title = "", message = "", type = "info", duration = 3000, callback }) {
  const main = document.getElementById("toast");
  if (main) {
    const toast = document.createElement("div");

    // Auto remove toast
    const autoRemoveId = setTimeout(function () {
      main.removeChild(toast);
    }, duration + 1000);

    // Remove toast when clicked
    toast.onclick = function (e) {
      if (e.target.closest(".toast__close")) {
        main.removeChild(toast);
        clearTimeout(autoRemoveId);
      }
    };

    const icons = {
      success: "./assets/icon/success-48.png",
      info: "./assets/icon/info-48.png",
      warning: "./assets/icon/warning-48.png",
      error: "./assets/icon/error-48.png"
    };
    const icon = icons[type];
    const delay = (duration / 1000).toFixed(2);

    setTimeout(() => {
      callback();
    }, duration)

    toast.classList.add("toast", `toast--${type}`);
    toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

    toast.innerHTML = `
                    <div class="toast__icon">
                        <i>
                            <img src='${icon}' alt='${type}'/>
                        </i>
                    </div>
                    <div class="toast__body">
                        <h3 class="toast__title">${title}</h3>
                        <p class="toast__msg">${message}</p>
                    </div>
                    <div class="toast__close">
                        <i class="fas fa-times"></i>
                    </div>
                `;
    main.appendChild(toast);
  }
}
