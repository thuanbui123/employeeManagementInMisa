import { getCurrentPage, getLimit } from "./renderDataTable.js";
import { paginate } from "./service.js";

/**
 * Hàm hiển thị giao diện lọc (filter)
 */
export function loadFilterHTML () {
    const FILTERHTML = `
        <div class="filter">
            <div class="filter-content">
                <div class="filter-by">
                    <p class="filter-by-text">
                        Lọc theo
                    </p>
                    <select class="filter-by-value">
                        <option>-------------</option>
                        <option value="department">Phòng ban</option>
                        <option value="position">Chức vụ</option>
                    </select>
                </div>
                <div class="filter-condition">
                    <p class="filter-condition-text">Điều kiện lọc</p>
                    <select class="filter-condition-value">
                        <option>-------------</option>
                        <option value="contain">Chứa</option>
                        <option value="start-with">Bắt đầu bằng</option>
                        <option value="end-with">Kết thúc bằng</option>
                    </select>
                </div>
                <input type="text" class="filter-input-value" placeholder="Nhập giá trị"/>
            </div>
            <div class="filter-footer">
                <button class="cancel-filter">Bỏ lọc</button>
                <button class="apply-filter">Áp dụng</button>
            </div>
        </div>
    `;
    const FILTERAREA = document.createElement('div');
    FILTERAREA.classList.add('filter-area');
    document.getElementById('container').append(FILTERAREA);
    FILTERAREA.innerHTML = '';
    FILTERAREA.innerHTML = FILTERHTML;
    const FILTER = document.getElementsByClassName('filter')[0];
    FILTER.classList.add('open');
    initAction();
}

/**
 * Bắt sự kiện cho các nút bấm trên filter
 */
function initAction () {
    const FILTER = document.getElementsByClassName('filter')[0];
    const CANCELFILTER = document.querySelector('.cancel-filter');
    CANCELFILTER.addEventListener('click', function () {
        document.querySelector('.filter-area').remove();
    });

    const APPLYFILTER = document.querySelector('.apply-filter');
    APPLYFILTER.addEventListener('click', function() {
        var offset = (getCurrentPage())*getLimit();
        var filterBy = document.querySelector('.filter-by-value').value;
        var filterCondition = document.querySelector('.filter-condition-value').value;
        var value = document.querySelector('.filter-input-value').value;
        paginate(`https://localhost:7004/api/v1/employees/filter?filter-by=${filterBy}&filter-condition=${filterCondition}&value=${value}&limit=${getLimit()}&offset=${offset}&is-desc=false`);
        document.querySelector('.filter-area').remove();
    });
}

