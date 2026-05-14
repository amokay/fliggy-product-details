        document.addEventListener('DOMContentLoaded', function() {
            var backBtn = document.querySelector('.back-btn');
            if (backBtn) {
                backBtn.addEventListener('click', function() {
                    window.history.back();
                });
            }
            var skuMore = document.querySelector('.sku-more');
            if (skuMore) {
                skuMore.addEventListener('click', function() {
                    window.history.back();
                });
            }
            var urlParams = new URLSearchParams(window.location.search);
            var title = urlParams.get('title');
            if (title) {
                var headerTitle = document.querySelector('.header-title');
                if (headerTitle) {
                    headerTitle.textContent = title;
                }
            }
            var selectedTicketTitle = localStorage.getItem('selectedTicketTitle');
            var selectedTicketSubtitle = localStorage.getItem('selectedTicketSubtitle');
            var ticketTitleEl = document.querySelector('.ticket-title');
            if (ticketTitleEl && selectedTicketTitle) {
                if (selectedTicketSubtitle) {
                    ticketTitleEl.textContent = selectedTicketTitle + '·' + selectedTicketSubtitle;
                } else {
                    ticketTitleEl.textContent = selectedTicketTitle;
                }
            }

            // 读取数量和日期信息，设置 sku-info
            var selectedQuantity = localStorage.getItem('selectedQuantity');
            var selectedDateId = localStorage.getItem('selectedDateId');
            var selectedDayWeek = localStorage.getItem('selectedDayWeek');
            var skuInfoEl = document.querySelector('.sku-info');
            if (skuInfoEl && selectedQuantity && selectedDateId) {
                // 将 YYYY-MM-DD 转为 "X月X日" 格式
                var dateParts = selectedDateId.split('-');
                var month = parseInt(dateParts[1], 10);
                var day = parseInt(dateParts[2], 10);
                var dateStr = month + '月' + day + '日';
                // 将 "周X" 转为 "星期X" 格式
                var weekDay = selectedDayWeek || '';
                if (weekDay.startsWith('周')) {
                    weekDay = '星期' + weekDay.substring(1);
                }
                skuInfoEl.textContent = '数量x ' + selectedQuantity + ' ｜' + dateStr + ' ' + weekDay;
            }
        });
