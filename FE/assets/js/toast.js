/**
 * Hàm tạo TOAST message để hiển thị thông báo
 * @param {*} param0 chứa các thông tin cần thiết cho toast message như:
 * title: tiêu đề của toast
 * message: nội dung thông báo
 * type: loại của toast message được tạo
 * duration: thời gian hiển thị của toast message
 * callback: hàm đươc gọi sau khi toast message ẩn
 */
export function toast({ title = "", message = "", type = "info", duration = 3000, callback }) {
  const MAIN = document.getElementById("toast");
  if (MAIN) {
    const TOAST = document.createElement("div");

    // Auto remove TOAST
    const AUTOREMOVEID = setTimeout(function () {
      MAIN.removeChild(TOAST);
    }, duration + 1000);

    // Remove TOAST when clicked
    TOAST.onclick = function (e) {
      if (e.target.closest(".toast__close")) {
        MAIN.removeChild(TOAST);
        clearTimeout(AUTOREMOVEID);
      }
    };

    const ICONS = {
      success: "./assets/icon/success-48.png",
      info: "./assets/icon/info-48.png",
      warning: "./assets/icon/warning-48.png",
      error: "./assets/icon/error-48.png"
    };
    const ICON = ICONS[type];

    //toFixed(a) làm tròn giá trị đến a chữ số thập phân và trả về một chuỗi
    const DELAY = (duration / 1000).toFixed(2);

    setTimeout(() => {
      if (typeof callback === 'function'){
        callback();
      }
    }, duration)

    TOAST.classList.add("toast", `toast--${type}`);
    TOAST.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${DELAY}s forwards`;

    TOAST.innerHTML = `
                    <div class="toast__icon">
                        <i>
                            <img src='${ICON}' alt='${type}'/>
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
    MAIN.appendChild(TOAST);
  }
}
