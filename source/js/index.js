    document.addEventListener('DOMContentLoaded', () => {
        // ====== 视频播放器逻辑 ======
        const videoContainer = document.getElementById('video-container');
        const video = document.getElementById('fullscreen-video');
        const playButton = document.getElementById('play-btn');
        const VIDEO_CONFIG = { folder: 'source/videos/', files: ['SPU_item.mp4'] };
        if (VIDEO_CONFIG.files.length > 0) { video.src = VIDEO_CONFIG.folder + VIDEO_CONFIG.files[0]; }
        videoContainer.addEventListener('click', () => { if (!video.paused) { video.pause(); playButton.classList.remove('is-hidden'); } });
        playButton.addEventListener('click', (event) => { event.stopPropagation(); video.play(); playButton.classList.add('is-hidden'); });

        // ====== 地图卡片视频弹窗逻辑 ======
        const mapVideoPopup = document.getElementById('mapVideoPopup');
        const mapPopupVideo = document.getElementById('mapPopupVideo');
        const mapVideoPopupClose = document.getElementById('mapVideoPopupClose');
        const mapVideoPopupBackdrop = document.getElementById('mapVideoPopupBackdrop');
        // 基地对应视频源映射（后期按需补充各基地视频）
        const baseVideoMap = {
            'base-1': 'source/videos/哈努曼世界.mov',
            'base-2': 'source/videos/天际线飞跃.mov',
            'base-3': 'source/videos/哈努曼世界_天桥漫步.mov',
            'base-4': 'source/videos/skyline_飞行滑板.mov'
        };
        // 基地ID→基地名称映射，用于拼接视频文件名
        const baseNameMap = {
            'base-1': '哈努曼世界',
            'base-2': 'skyline',
            'base-3': '查龙海景飞跃',
            'base-4': '飞象海景丛林飞跃'
        };
        // 已知存在的视频文件集合（新增视频文件后在此添加即可自动关联）
        const videoFiles = new Set([
            '哈努曼世界_天桥漫步.mov',
            '哈努曼世界_800米过山车.mov',
            '哈努曼世界_天际漫步.mov',
            '哈努曼世界_天际滑车.mov',
            '哈努曼世界_蜜月环道滑索.mov',
            'skyline_飞行滑板.mov',
            'skyline_树屋.mov',
            'skyline_绳降.mov',
            'skyline_螺旋楼梯.mov'
        ]);
        const getActiveBaseVideo = () => {
            const activeBase = document.querySelector('.selectable-item.option-step1.is-selected');
            const baseId = activeBase ? activeBase.dataset.id : 'base-1';
            return baseVideoMap[baseId] || baseVideoMap['base-1'];
        };
        // 获取label-row对应的视频路径：根据命名规则 "{baseTitle}_{activityName}.{ext}" 自动查找
        const getLabelVideoSrc = (activityName) => {
            const activeBase = document.querySelector('.selectable-item.option-step1.is-selected');
            const baseId = activeBase ? activeBase.dataset.id : 'base-1';
            const baseName = baseNameMap[baseId] || '';
            const exts = ['.mp4', '.mov', '.MP4'];
            for (const ext of exts) {
                const fileName = baseName + '_' + activityName + ext;
                if (videoFiles.has(fileName)) {
                    return 'source/videos/' + fileName;
                }
            }
            return null;
        };
        if (mapPopupVideo) { mapPopupVideo.src = getActiveBaseVideo(); }
        document.querySelectorAll('.map-card-arrow').forEach(arrow => {
            arrow.addEventListener('click', () => {
                if (mapVideoPopup && mapPopupVideo) {
                    mapPopupVideo.src = getActiveBaseVideo();
                    mapVideoPopup.classList.add('is-visible');
                    if (mapVideoPopupBackdrop) { mapVideoPopupBackdrop.classList.add('is-visible'); }
                    mapPopupVideo.play();
                }
            });
        });
        // ====== 统一关闭地图视频弹窗函数 ======
        const closeMapVideoPopup = () => {
            if (mapVideoPopup && mapVideoPopup.classList.contains('is-visible')) {
                if (mapPopupVideo) { mapPopupVideo.pause(); }
                mapVideoPopup.classList.remove('is-visible');
                if (mapVideoPopupBackdrop) { mapVideoPopupBackdrop.classList.remove('is-visible'); }
            }
        };

        if (mapVideoPopupClose) {
            mapVideoPopupClose.addEventListener('click', closeMapVideoPopup);
        }
        // 点击遮罩区域关闭视频弹窗
        if (mapVideoPopupBackdrop) {
            mapVideoPopupBackdrop.addEventListener('click', closeMapVideoPopup);
        }

        // ====== AI面板元素获取 ======
        const aiPanel = document.getElementById('aiPanel');
        const footerInput = document.getElementById('footerInput');
        const inputArea = document.getElementById('inputArea');
        const inputEditable = document.getElementById('inputEditable');
        const inputActions = document.getElementById('inputActions');
        const sendBtn = document.getElementById('sendBtn');
        const keyboardImage = document.getElementById('keyboardImage');
        const header = document.getElementById('aiPanelHeader');
        const stepTabsContainer = document.getElementById('stepTabs');
        const stepTabs = stepTabsContainer.querySelectorAll('.step-tab');
        const tabPanelsSlider = document.getElementById('tabPanelsSlider');
        const tabPanels = tabPanelsSlider.querySelectorAll('.tab-panel');
        const nextStepBtn = document.getElementById('nextStepBtn');
        const quantityStepper = document.getElementById('quantityStepper');
        const calendarGrid = document.getElementById('calendarGrid');
        const panelKeyboardWrapper = document.getElementById('panelKeyboardWrapper');
        const aiStatusLine = document.getElementById('aiStatusLine');
        const aiStatusText = document.getElementById('aiStatusText');


        // ====== AI状态行控制 ======
        function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

        function showStatus(text) {
            const statusLine = document.getElementById('aiStatusLine');
            const statusText = document.getElementById('aiStatusText');
            if (!statusLine || !statusText) return;
            statusText.textContent = text;
            footerInput.classList.add('has-status');
            statusLine.classList.add('is-visible');
            setTimeout(() => { statusLine.style.opacity = '1'; }, 50);
        }

        function updateStatus(newText) {
            const statusLine = document.getElementById('aiStatusLine');
            const statusText = document.getElementById('aiStatusText');
            if (!statusLine || !statusText) return;
            statusLine.style.opacity = '0';
            setTimeout(() => { statusText.textContent = newText; statusLine.style.opacity = '1'; }, 300);
        }

        function hideStatus() {
            const statusLine = document.getElementById('aiStatusLine');
            if (!statusLine) return;
            statusLine.style.opacity = '0';
            setTimeout(() => {
                statusLine.classList.remove('is-visible');
                statusLine.style.opacity = '';
                footerInput.classList.remove('has-status');
            }, 300);
        }

        // ====== 加载选项配置 ======
        let optionsConfig = null;
        fetch('source/options-config.json')
            .then(res => { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
            .then(data => { optionsConfig = data; console.log('[DEBUG] 选项配置加载成功'); populateMapCard(); })
            .catch(err => { console.error('[ERROR] 选项配置加载失败:', err); });

        // ====== 从配置填充地图卡片 ======
        function populateMapCard() {
            if (!optionsConfig) return;
            const options = optionsConfig.steps[0].options;
            // 填充 map-card (base-1)
            const card1 = document.querySelector('.map-card');
            if (card1 && options[0]) {
                card1.querySelector('.map-card-title').textContent = options[0].title;
                card1.querySelector('.map-card-subtitle').textContent = options[0].subtitle;
                card1.querySelector('.map-card-desc').textContent = options[0].description;
            }
            // 填充 map-card2 (base-2)
            const card2 = document.querySelector('.map-card2');
            if (card2 && options[1]) {
                card2.querySelector('.map-card-title').textContent = options[1].title;
                card2.querySelector('.map-card-subtitle').textContent = options[1].subtitle;
                card2.querySelector('.map-card-desc').textContent = options[1].description;
            }
            // 填充 map-card3 (base-3)
            const card3 = document.querySelector('.map-card3');
            if (card3 && options[2]) {
                card3.querySelector('.map-card-title').textContent = options[2].title;
                card3.querySelector('.map-card-subtitle').textContent = options[2].subtitle;
                card3.querySelector('.map-card-desc').textContent = options[2].description;
            }
            // 填充 map-card4 (base-4)
            const card4 = document.querySelector('.map-card4');
            if (card4 && options[3]) {
                card4.querySelector('.map-card-title').textContent = options[3].title;
                card4.querySelector('.map-card-subtitle').textContent = options[3].subtitle;
                card4.querySelector('.map-card-desc').textContent = options[3].description;
            }
            console.log('[DEBUG] map-card 已填充');
        }

        // ====== 状态管理 ======
        let currentStep = 1;
        const totalSteps = 3;
        let maxReachedStep = 1;
        let isStep3Unlocked = false;
        let isExpanded = false;

        const onSelectionChange = (step, id, title) => {
            console.log(`[Hook] 步骤${step} 选中变更 -> ID: "${id}", 标题: "${title}"`);
            // 步骤1（选基地）时，只有 base-1 显示 map-card
            if (step === 1) {
                const mapCard = document.querySelector('.map-card');
                if (mapCard) {
                    if (id === 'base-1') {
                        mapCard.style.display = 'block';
                        populateMapCard();
                    } else {
                        mapCard.style.display = 'none';
                    }
                }
            }
        };

        // ====== 切换面板展开/收起 ======
        const togglePanel = () => {
            isExpanded = !isExpanded;
            aiPanel.classList.toggle('is-expanded', isExpanded);
            panelKeyboardWrapper.classList.toggle('is-expanded', isExpanded);
            document.querySelector('.page').classList.toggle('is-panel-expanded', isExpanded);
            // 同步控制 info-tags 显示/隐藏
            const infoTags = document.querySelector('.info-tags');
            if (infoTags) { infoTags.style.display = isExpanded ? 'none' : ''; }
            // 扩展时暂停视频并加高斯模糊，收起时恢复
            const video = document.getElementById('fullscreen-video');
            const videoFrame = document.getElementById('video-container');
            if (isExpanded) {
                video.pause();
                videoFrame.classList.add('is-blurred');
                // 展开时如果是"选基地"步骤，显示地图
                if (currentStep === 1) {
                    document.getElementById('mapOverlay').classList.remove('is-hidden');
                    // 默认选中项高亮对应 map-pin
                    const selItem = document.querySelector('.option-step1.is-selected');
                    if (selItem) { const pin = document.querySelector(`.map-pin[data-pin="${selItem.dataset.id}"]`); if (pin) pin.classList.add('is-active'); }
                }
                // 展开时如果是步骤3，显示日历覆盖层
                if (currentStep === 3) {
                    document.getElementById('calendarOverlay').classList.add('is-visible');
                }
            } else {
                video.play();
                videoFrame.classList.remove('is-blurred');
                document.getElementById('mapOverlay').classList.add('is-hidden');
                document.getElementById('calendarOverlay').classList.remove('is-visible');
            }
        };

        // ====== 更新套餐列表 ======
        const updatePackagesList = (baseId) => {
            if (!optionsConfig) return;
            const baseOption = optionsConfig.steps[0].options.find(o => o.optionId === baseId);
            const packages = baseOption && baseOption.packages ? baseOption.packages : [];
            const panel2 = document.querySelector('.tab-panel[data-panel="2"]');
            if (panel2) {
                if (packages.length > 0) {
                    panel2.innerHTML = packages.map((pkg, idx) => 
                        `<div class="selectable-item option-step2${idx === 0 ? ' is-selected' : ''}" data-selectable data-id="${pkg.packageId}"><span class="title">${pkg.title}</span><span class="subtitle">${pkg.subtitle}</span></div>`
                    ).join('');
                } else {
                    panel2.innerHTML = '<div class="empty-placeholder" style="color: rgba(255,255,255,0.5); text-align: center; padding: 20px;">该基地暂无可选套餐</div>';
                }
            }
        };

        // ====== 横向滚动表格让选中列完整展示 ======
        const scrollColumnIntoView = (targetCol) => {
            const container = document.querySelector('.comparison-data');
            if (!container || !targetCol) {
                console.log('[scrollColumnIntoView] container或targetCol为空, container:', container, 'targetCol:', targetCol);
                return;
            }

            const buffer = 16;
            const containerRect = container.getBoundingClientRect();
            const colRect = targetCol.getBoundingClientRect();

            console.log('[scrollColumnIntoView] container尺寸:', {
                scrollWidth: container.scrollWidth,
                clientWidth: container.clientWidth,
                scrollLeft: container.scrollLeft,
                hasOverflow: container.scrollWidth > container.clientWidth
            });
            console.log('[scrollColumnIntoView] 位置对比:', {
                colLeft: colRect.left, colRight: colRect.right,
                containerLeft: containerRect.left, containerRight: containerRect.right,
                isLeftClipped: colRect.left < containerRect.left,
                isRightClipped: colRect.right > containerRect.right
            });

            // 如果被左边裁切
            if (colRect.left < containerRect.left) {
                const scrollDelta = colRect.left - containerRect.left - buffer;
                console.log('[scrollColumnIntoView] 左侧裁切, 滚动delta:', scrollDelta, '新scrollLeft:', container.scrollLeft + scrollDelta);
                container.scrollTo({ left: container.scrollLeft + scrollDelta, behavior: 'smooth' });
            }
            // 如果被右边裁切
            else if (colRect.right > containerRect.right) {
                const isLastCol = !targetCol.nextElementSibling;
                if (isLastCol) {
                    const maxScroll = container.scrollWidth - container.clientWidth;
                    console.log('[scrollColumnIntoView] 右侧裁切(最后一列), 滚动到最右, maxScroll:', maxScroll);
                    container.scrollTo({ left: maxScroll, behavior: 'smooth' });
                } else {
                    const scrollDelta = colRect.right - containerRect.right + buffer;
                    console.log('[scrollColumnIntoView] 右侧裁切, 滚动delta:', scrollDelta, '新scrollLeft:', container.scrollLeft + scrollDelta);
                    container.scrollTo({ left: container.scrollLeft + scrollDelta, behavior: 'smooth' });
                }
            } else {
                console.log('[scrollColumnIntoView] 列完全可见，无需滚动');
            }
        };

        // ====== 跳转到指定步骤 ======
        const goToStep = (stepNumber) => {
            stepNumber = parseInt(stepNumber, 10);
            if (stepNumber < 1 || stepNumber > totalSteps) return;
            // 离开步骤3时，重置解锁状态，确保下次进入步骤3仍需通过 next-step-btn
            if (currentStep === 3 && stepNumber !== 3) {
                isStep3Unlocked = false;
            }
            // 进入步骤2时，根据step1选中基地的packages动态刷新step2选项
            if (stepNumber === 2) {
                const selectedBase = document.querySelector('.tab-panel[data-panel="1"] .selectable-item.is-selected');
                const baseId = selectedBase ? selectedBase.dataset.id : '';
                updatePackagesList(baseId);
            }
            currentStep = stepNumber;
            stepTabs.forEach(tab => { tab.classList.toggle('is-active', parseInt(tab.dataset.step) === currentStep); });
            const offset = (currentStep - 1) * -750;
            tabPanelsSlider.style.transform = `translateX(${offset}px)`;
            updateNextButtonState();
            nextStepBtn.style.visibility = currentStep === 3 ? 'hidden' : 'visible';
            // "选基地"步骤显示地图覆盖层
            const mapOverlay = document.getElementById('mapOverlay');
            if (currentStep === 1) {
                mapOverlay.classList.remove('is-hidden');
                // 默认选中项高亮对应 map-pin
                document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('is-active'));
                const selItem = document.querySelector('.option-step1.is-selected');
                if (selItem) { const pin = document.querySelector(`.map-pin[data-pin="${selItem.dataset.id}"]`); if (pin) pin.classList.add('is-active'); }
            } else {
                mapOverlay.classList.add('is-hidden');
            }
            // 套餐对比表格显隐控制
            const packageComparison = document.getElementById('packageComparison');
            if (currentStep === 2) {
                const selectedBase = document.querySelector('.tab-panel[data-panel="1"] .selectable-item.is-selected');
                const baseId = selectedBase ? selectedBase.dataset.id : '';
                const baseTitle = selectedBase ? selectedBase.querySelector('.title').textContent.trim() : '';
                // comparison-header 已移除，以下代码不再使用
                // document.getElementById('comparisonHeader').textContent = baseTitle + '项目';
                // 动态生成套餐对比数据列
                const comparisonData = document.querySelector('.comparison-data');
                comparisonData.innerHTML = '';
                if (optionsConfig && baseId) {
                    const baseOption = optionsConfig.steps[0].options.find(o => o.optionId === baseId);
                    const packages = baseOption && baseOption.packages ? baseOption.packages : [];
                    const activities = baseOption && baseOption.activities ? baseOption.activities : [];
                    // 动态生成左侧项目列
                    const comparisonLabels = document.querySelector('.comparison-labels');
                    comparisonLabels.innerHTML = '<div class="label-header">项目</div>' +
                        activities.map((activity, idx) => {
                            const videoSrc = getLabelVideoSrc(activity);
                            const hasVideo = !!videoSrc;
                            const arrowHtml = hasVideo ? `<span class="arrow-icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 18.75C14.8325 18.75 18.75 14.8325 18.75 10C18.75 5.1675 14.8325 1.25 10 1.25C5.1675 1.25 1.25 5.1675 1.25 10C1.25 14.8325 5.1675 18.75 10 18.75ZM9.0625 14.0125C8.87283 14.1262 8.65641 14.1875 8.43532 14.1902C8.21422 14.1929 7.99637 14.1369 7.80397 14.0279C7.61157 13.919 7.45153 13.7609 7.34015 13.5699C7.22878 13.3789 7.17006 13.1617 7.17 12.9406V7.64875C7.17 7.42754 7.2287 7.2103 7.3401 7.0192C7.45151 6.82809 7.61163 6.66998 7.80412 6.56099C7.99662 6.452 8.21458 6.39605 8.43577 6.39884C8.65696 6.40163 8.87344 6.46306 9.06313 6.57687L13.4731 9.22312C13.6582 9.33418 13.8114 9.49128 13.9178 9.67912C14.0241 9.86696 14.08 10.0791 14.08 10.295C14.08 10.5109 14.0241 10.723 13.9178 10.9109C13.8114 11.0987 13.6582 11.2558 13.4731 11.3669L9.06313 14.0125H9.0625Z" fill="#919499"/></svg></span>` : '';
                            return `<div class="label-row${hasVideo ? ' has-video' : ''}" data-activity="${activity}">${activity}${arrowHtml}</div>`;
                        }).join('');
                    // 绑定 label-row 点击事件弹出视频弹窗
                    comparisonLabels.querySelectorAll('.label-row.has-video').forEach(row => {
                        row.style.cursor = 'pointer';
                        row.addEventListener('click', () => {
                            const activity = row.dataset.activity;
                            const videoSrc = getLabelVideoSrc(activity);
                            if (videoSrc && mapVideoPopup && mapPopupVideo) {
                                mapPopupVideo.src = videoSrc;
                                mapVideoPopup.classList.add('is-visible');
                                if (mapVideoPopupBackdrop) { mapVideoPopupBackdrop.classList.add('is-visible'); }
                                mapPopupVideo.play();
                            }
                        });
                    });
                    packages.forEach((pkg, idx) => {
                        const col = document.createElement('div');
                        col.className = 'data-column';
                        col.dataset.packageId = pkg.packageId;
                        console.log('[表格生成] 套餐列 data-package-id:', pkg.packageId);

                        // 列标题（套餐名）
                        const header = document.createElement('div');
                        header.className = 'col-header';
                        header.textContent = pkg.title.split('·')[0] || `套餐${idx + 1}`;
                        col.appendChild(header);

                        // 根据 activities 顺序填充每行数据
                        const details = pkg.details || {};
                        activities.forEach(activity => {
                            const cell = document.createElement('div');
                            cell.className = 'col-cell';
                            cell.textContent = details[activity] || '-';
                            col.appendChild(cell);
                        });

                        // 点击表格列时高亮+自动滚动+联动step2选中
                        col.addEventListener('click', () => {
                            document.querySelectorAll('.data-column').forEach(c => c.classList.remove('is-highlighted'));
                            col.classList.add('is-highlighted');
                            scrollColumnIntoView(col);
                            // 联动step2选项选中状态
                            const pkgId = col.dataset.packageId;
                            const step2Items = document.querySelectorAll('.tab-panel[data-panel="2"] [data-selectable]');
                            step2Items.forEach(item => item.classList.remove('is-selected'));
                            const matchItem = document.querySelector(`.tab-panel[data-panel="2"] [data-id="${pkgId}"]`);
                            if (matchItem) matchItem.classList.add('is-selected');
                        });

                        comparisonData.appendChild(col);
                    });
                    // 初始化时高亮已选中的套餐列
                    const selectedPkg = document.querySelector('.option-step2.is-selected');
                    if (selectedPkg) {
                        const selectedPkgId = selectedPkg.dataset.id;
                        console.log('[初始化高亮] 已选套餐 data-id:', selectedPkgId);
                        if (selectedPkgId) {
                            const targetCol = document.querySelector(`.data-column[data-package-id="${selectedPkgId}"]`);
                            console.log('[初始化高亮] 匹配到表格列:', targetCol ? '是' : '否');
                            if (targetCol) {
                                targetCol.classList.add('is-highlighted');
                                requestAnimationFrame(() => scrollColumnIntoView(targetCol));
                            }
                        }
                    }
                }
                packageComparison.classList.add('is-visible');
            } else {
                packageComparison.classList.remove('is-visible');
            }
            // 日历覆盖层显隐控制
            const calendarOverlay = document.getElementById('calendarOverlay');
            if (currentStep === 3 && isExpanded) {
                calendarOverlay.classList.add('is-visible');
            } else {
                calendarOverlay.classList.remove('is-visible');
            }
            // 步骤3支付按钮状态控制：进入step3时根据是否已选工作日日期显示/隐藏，离开step3时恢复输入框
            const footerInput = document.getElementById('footerInput');
            if (currentStep === 3) {
                const activePanelStep3 = document.querySelector('.tab-panel[data-panel="3"]');
                const selectedWeekday = activePanelStep3 ? activePanelStep3.querySelector('.calendar-day.is-selected') : null;
                if (selectedWeekday) {
                    footerInput.classList.add('is-pay-mode');
                    const dayPriceEl = selectedWeekday.querySelector('.day-price');
                    const payButtonPrice = document.getElementById('payButtonPrice');
                    if (dayPriceEl && payButtonPrice) payButtonPrice.textContent = dayPriceEl.textContent.trim();
                } else {
                    footerInput.classList.remove('is-pay-mode');
                }
            } else {
                footerInput.classList.remove('is-pay-mode');
            }
        };

        // ====== 更新"下一步"按钮状态 ======
        const updateNextButtonState = () => {
            const activePanel = document.querySelector(`.tab-panel[data-panel="${currentStep}"]`);
            if (!activePanel) { nextStepBtn.disabled = true; return; }
            let isSelectionMade = false;
            if (currentStep === 1 || currentStep === 2) {
                isSelectionMade = !!activePanel.querySelector('.selectable-item.is-selected');
                nextStepBtn.disabled = !isSelectionMade;
                nextStepBtn.textContent = '选好了，下一步';
            } else if (currentStep === 3) {
                const isDateSelected = !!activePanel.querySelector('.calendar-day.is-selected');
                isSelectionMade = isDateSelected;
                nextStepBtn.disabled = !isSelectionMade;
                nextStepBtn.textContent = '完成选择';
            }
        };

        // ====== 处理选项点击 ======
        const handleSelection = (e) => {
            const selectedItem = e.target.closest('[data-selectable]');
            if (!selectedItem) return;
            const panel = selectedItem.closest('.tab-panel');
            const siblings = panel.querySelectorAll('[data-selectable]');
            siblings.forEach(item => item.classList.remove('is-selected'));
            selectedItem.classList.add('is-selected');
            // 切换步骤1基地时自动关闭视频弹窗
            if (currentStep === 1) {
                const videoPopup = document.getElementById('mapVideoPopup');
                const popupVideo = document.getElementById('mapPopupVideo');
                const backdrop = document.getElementById('mapVideoPopupBackdrop');
                if (videoPopup && videoPopup.classList.contains('is-visible')) {
                    popupVideo && popupVideo.pause();
                    videoPopup.classList.remove('is-visible');
                }
                if (backdrop) backdrop.classList.remove('is-visible');
            }
            // 联动对比表格列高亮
            if (currentStep === 2) {
                console.log('[handleSelection] currentStep === 2, 选中套餐 data-id:', selectedItem.dataset.id);
                const allColumns = document.querySelectorAll('.data-column');
                allColumns.forEach(col => col.classList.remove('is-highlighted'));
                const selectedPkgId = selectedItem.dataset.id;
                console.log('[handleSelection] 查找表格列 data-package-id="' + selectedPkgId + '"');
                if (selectedPkgId) {
                    const targetCol = document.querySelector(`.data-column[data-package-id="${selectedPkgId}"]`);
                    console.log('[handleSelection] 匹配到表格列:', targetCol ? '是' : '否');
                    if (targetCol) {
                        targetCol.classList.add('is-highlighted');
                        scrollColumnIntoView(targetCol);
                    }
                }
            }
            // 联动日历覆盖层高亮
            if (currentStep === 3) {
                document.querySelectorAll('.calendar-overlay-day').forEach(d => d.classList.remove('is-highlighted'));
                const selectedDateId = selectedItem.dataset.id;
                if (selectedDateId) {
                    const targetOverlayDay = document.querySelector(`.calendar-overlay-day[data-date-id="${selectedDateId}"]`);
                    if (targetOverlayDay) targetOverlayDay.classList.add('is-highlighted');
                }
                // 步骤3选中工作日日期时显示支付按钮，否则隐藏
                const footerInput = document.getElementById('footerInput');
                const isWeekdaySelected = selectedItem.classList.contains('calendar-day');
                if (isWeekdaySelected) {
                    footerInput.classList.add('is-pay-mode');
                    const dayPriceEl = selectedItem.querySelector('.day-price');
                    const payButtonPrice = document.getElementById('payButtonPrice');
                    if (dayPriceEl && payButtonPrice) payButtonPrice.textContent = dayPriceEl.textContent.trim();
                } else {
                    footerInput.classList.remove('is-pay-mode');
                }
            }
            const titleEl = selectedItem.querySelector('.title');
            const selectedTitle = titleEl ? titleEl.textContent.trim() : '';
            const selectedId = selectedItem.dataset.id || '';
            onSelectionChange(currentStep, selectedId, selectedTitle);
            updateNextButtonState();
            // 关联 map-card 显示/隐藏 & map-pin 高亮
            if (currentStep === 1) {
                const cardMap = { 'base-1': '.map-card:not(.map-card2):not(.map-card3):not(.map-card4)', 'base-2': '.map-card2', 'base-3': '.map-card3', 'base-4': '.map-card4' };
                Object.values(cardMap).forEach(sel => { const el = document.querySelector(sel); if (el) el.classList.remove('is-visible'); });
                const activeCard = document.querySelector(cardMap[selectedId]);
                if (activeCard) activeCard.classList.add('is-visible');
                // 切换 map-pin 高亮状态
                document.querySelectorAll('.map-pin').forEach(pin => pin.classList.remove('is-active'));
                const activePin = document.querySelector(`.map-pin[data-pin="${selectedId}"]`);
                if (activePin) activePin.classList.add('is-active');
                // 同步刷新step2的packages
                updatePackagesList(selectedId);
                // 刷新日历覆盖层目的地与天气
                setupCalendarOverlay();
            }
        };

        // ====== 数量增减器 ======
        const setupStepper = () => {
            const minusBtn = quantityStepper.querySelector('.stepper-btn--minus');
            const plusBtn = quantityStepper.querySelector('.stepper-btn--plus');
            const quantityEl = quantityStepper.querySelector('.stepper-quantity');
            const updateMinusBtnState = (quantity) => {
                minusBtn.classList.toggle('is-disabled', quantity <= 1);
                minusBtn.disabled = quantity <= 1;
            };
            minusBtn.addEventListener('click', () => {
                let quantity = parseInt(quantityEl.textContent);
                if (quantity > 1) { quantity--; quantityEl.textContent = quantity; updateMinusBtnState(quantity); }
            });
            plusBtn.addEventListener('click', () => {
                let quantity = parseInt(quantityEl.textContent);
                quantity++; quantityEl.textContent = quantity; updateMinusBtnState(quantity);
            });
            updateMinusBtnState(1);
        };

        // ====== 日历初始化 ======
        const setupCalendar = () => {
            const today = new Date();
            const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            let calendarHTML = '';
            for (let i = 1; i <= 15; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                const dayNum = date.getDate();
                const dayOfWeek = date.getDay();
                const weekday = weekdays[dayOfWeek];
                const isWeekend = (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6);
                const price = isWeekend ? '¥590' : '¥536';
                const isWeekday = (dayOfWeek >= 1 && dayOfWeek <= 4);
                const weekdayClass = isWeekday ? ' is-weekday' : '';
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(dayNum).padStart(2, '0');
                const dateId = `${year}-${month}-${day}`;
                calendarHTML += `<div class="calendar-day${weekdayClass}" data-selectable data-id="${dateId}"><span class="day-week">${weekday}</span><span class="day-num">${dayNum}</span><span class="day-price">${price}</span></div>`;
            }
            calendarHTML += `<button class="calendar-day more-dates-btn"><div class="more-dates-icon"><svg width="36" height="60" viewBox="0 0 36 60" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><g clip-path="url(#clip1)"><g clip-path="url(#clip2)"><path d="M23.7695 4C24.4066 4.00016 24.9229 4.51715 24.9229 5.1543V5.92383H28.9521C30.3598 5.92383 30.8702 6.06869 31.3848 6.33984C31.8994 6.61215 32.3035 7.01168 32.5781 7.52051C32.8538 8.02922 33 8.53478 33 9.92578V28.458C33 29.8495 32.8539 30.3554 32.5781 30.8643C32.3078 31.3683 31.8916 31.779 31.3848 32.0439C30.8702 32.3151 30.3587 32.4609 28.9521 32.4609H7.04785C5.64016 32.4609 5.12985 32.3151 4.61523 32.0439C4.10836 31.779 3.69221 31.3683 3.42188 30.8643C3.14611 30.3566 3 29.8507 3 28.458V9.92773C3 8.53632 3.14615 8.03028 3.42188 7.52148C3.69205 7.01691 4.10806 6.60512 4.61523 6.33984C5.12985 6.06869 5.64247 5.92383 7.04785 5.92383H11.0771V5.1543C11.0771 4.51715 11.5934 4.00016 12.2305 4C12.8677 4 13.3848 4.51705 13.3848 5.1543V5.92383H22.6152V5.15527C22.6152 4.51802 23.1323 4.00098 23.7695 4.00098V4ZM5.30859 28.6875C5.31436 29.4363 5.35523 29.6153 5.45215 29.793C5.50103 29.8883 5.57901 29.9658 5.6748 30.0137C5.85699 30.1093 6.03834 30.1487 6.80859 30.1533H29.0049C29.9344 30.1533 30.1311 30.1164 30.3271 30.0127C30.4228 29.9651 30.5007 29.8878 30.5498 29.793C30.6548 29.5992 30.6934 29.4055 30.6934 28.4873V17.4609H5.30859V28.6875ZM6.99707 8.23047C6.06771 8.23047 5.87082 8.26741 5.6748 8.37109C5.57918 8.41868 5.50123 8.49596 5.45215 8.59082C5.35525 8.76964 5.31419 8.94834 5.30957 9.69824L5.30859 15.1514H30.6934V9.89648C30.6934 8.97814 30.6548 8.78448 30.5498 8.5918C30.5009 8.4965 30.4229 8.41898 30.3271 8.37109C30.1311 8.26736 29.9344 8.23047 29.0049 8.23047H24.9238V10.5381C24.9238 11.1752 24.4076 11.6922 23.7705 11.6924C23.1333 11.6924 22.6162 11.1753 22.6162 10.5381V8.23047H13.3857V10.5381C13.3857 11.1753 12.8687 11.6924 12.2314 11.6924C11.5943 11.6923 11.0781 11.1753 11.0781 10.5381V8.23047H6.99707Z" fill="#0F131A"/></g></g></g><path d="M23.3032 44.7519C23.4558 44.741 23.608 44.777 23.7395 44.8551C23.8711 44.9331 23.9756 45.0495 24.0391 45.1887C24.1025 45.3278 24.122 45.483 24.0948 45.6335C24.0675 45.784 23.9949 45.9226 23.8867 46.0307L18.5842 51.3339C18.5146 51.4036 18.4319 51.459 18.3408 51.4967C18.2498 51.5344 18.1522 51.5539 18.0536 51.5539C17.955 51.5539 17.8574 51.5344 17.7664 51.4967C17.6754 51.459 17.5926 51.4036 17.523 51.3339L12.2197 46.0314C12.1146 45.9266 12.043 45.7929 12.0139 45.6473C11.9848 45.5017 11.9996 45.3507 12.0564 45.2136C12.1132 45.0764 12.2094 44.9591 12.3329 44.8767C12.4564 44.7942 12.6015 44.7503 12.75 44.7504H23.25C23.268 44.7504 23.286 44.7504 23.3032 44.7519Z" fill="#0F131A"/><defs><clipPath id="clip0"><rect width="36" height="36" fill="white"/></clipPath><clipPath id="clip1"><rect width="36" height="36" fill="white"/></clipPath><clipPath id="clip2"><rect width="30" height="28.4608" fill="white" transform="translate(3 4)"/></clipPath></defs></svg></div></button>`;
            calendarGrid.innerHTML = calendarHTML;
        };

        // ====== 日历覆盖层初始化 ======
        const setupCalendarOverlay = () => {
            const calendarOverlay = document.getElementById('calendarOverlay');
            if (!calendarOverlay) return;
            const today = new Date();
            // 获取当前选中的基地
            const activeBase = document.querySelector('.selectable-item.option-step1.is-selected');
            const baseId = activeBase ? activeBase.dataset.id : 'base-1';
            const destinationName = '普吉岛';
            // 按目的地配置不同天气模板
            const weatherTemplates = {
                'base-1': [
                    { icon: '☀️', lowTemp: 22, highTemp: 32 },
                    { icon: '☀️', lowTemp: 23, highTemp: 33 },
                    { icon: '⛅', lowTemp: 21, highTemp: 31 },
                    { icon: '☀️', lowTemp: 24, highTemp: 34 },
                    { icon: '🌤️', lowTemp: 20, highTemp: 30 },
                    { icon: '☀️', lowTemp: 25, highTemp: 35 },
                    { icon: '⛅', lowTemp: 22, highTemp: 32 }
                ],
                'base-2': [
                    { icon: '🌤️', lowTemp: 18, highTemp: 28 },
                    { icon: '⛅', lowTemp: 16, highTemp: 26 },
                    { icon: '☀️', lowTemp: 19, highTemp: 29 },
                    { icon: '🌤️', lowTemp: 17, highTemp: 27 },
                    { icon: '⛅', lowTemp: 15, highTemp: 25 },
                    { icon: '☀️', lowTemp: 20, highTemp: 30 },
                    { icon: '🌤️', lowTemp: 18, highTemp: 28 }
                ],
                'base-3': [
                    { icon: '⛅', lowTemp: 17, highTemp: 27 },
                    { icon: '🌤️', lowTemp: 18, highTemp: 28 },
                    { icon: '☀️', lowTemp: 19, highTemp: 29 },
                    { icon: '⛅', lowTemp: 16, highTemp: 26 },
                    { icon: '🌤️', lowTemp: 17, highTemp: 27 },
                    { icon: '☀️', lowTemp: 20, highTemp: 30 },
                    { icon: '⛅', lowTemp: 18, highTemp: 28 }
                ],
                'base-4': [
                    { icon: '🌤️', lowTemp: 19, highTemp: 29 },
                    { icon: '☀️', lowTemp: 20, highTemp: 30 },
                    { icon: '⛅', lowTemp: 18, highTemp: 28 },
                    { icon: '🌤️', lowTemp: 17, highTemp: 27 },
                    { icon: '☀️', lowTemp: 21, highTemp: 31 },
                    { icon: '⛅', lowTemp: 18, highTemp: 28 },
                    { icon: '🌤️', lowTemp: 19, highTemp: 29 }
                ]
            };
            const weathers = weatherTemplates[baseId] || weatherTemplates['base-1'];
            let daysHTML = '';
            for (let i = 1; i <= 15; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                const dayNum = date.getDate();
                const weather = weathers[(i - 1) % weathers.length];
                const month = date.getMonth() + 1;
                const monthLabel = month + '月';
                const year = date.getFullYear();
                const monthStr = String(month).padStart(2, '0');
                const dayStr = String(dayNum).padStart(2, '0');
                const dateId = `${year}-${monthStr}-${dayStr}`;
                daysHTML += `<div class="calendar-overlay-day" data-date-id="${dateId}">
                    <span class="day-month">${monthLabel}</span>
                    <span class="day-number">${dayNum}</span>
                    <span class="day-weather">${weather.icon}</span>
                    <span class="day-temp">${weather.lowTemp}/${weather.highTemp}°C</span>
                </div>`;
            }
            const titleText = destinationName + '天气';
            calendarOverlay.innerHTML = `<div class="calendar-overlay-month">
                    <span class="month-title">${titleText}</span>
                </div>
                <div class="calendar-overlay-days">${daysHTML}</div>`;
            // 同步已选中日期的覆盖层高亮
            const selectedDateItem = document.querySelector('.calendar-day.is-selected');
            if (selectedDateItem) {
                const selectedDateId = selectedDateItem.dataset.id;
                if (selectedDateId) {
                    const targetOverlayDay = document.querySelector(`.calendar-overlay-day[data-date-id="${selectedDateId}"]`);
                    if (targetOverlayDay) targetOverlayDay.classList.add('is-highlighted');
                }
            }
        };

        // ====== 点击 panel-keyboard-wrapper 中的按钮时关闭视频弹窗 ======
        if (panelKeyboardWrapper) {
            panelKeyboardWrapper.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;
                if (!panelKeyboardWrapper.classList.contains('is-expanded')) return;
                closeMapVideoPopup();
            });
        }

        // ====== 事件绑定 ======
        header.addEventListener('click', togglePanel);
        stepTabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.step-tab');
            if (tab && !tab.classList.contains('is-active')) {
                const targetStep = parseInt(tab.dataset.step);
                // 步骤3未通过 next-step-btn 解锁前，禁止直接点击 tab 跳转
                if (targetStep === 3 && !isStep3Unlocked) return;
                if (targetStep <= maxReachedStep) {
                    goToStep(targetStep);
                }
            }
        });
        nextStepBtn.addEventListener('click', () => {
            if (nextStepBtn.disabled) return;
            // 将当前步骤选中项的title带入对应tab的span
            const selectedItem = document.querySelector(`.tab-panel[data-panel="${currentStep}"] .selectable-item.is-selected .title`);
            if (selectedItem) {
                const fullText = selectedItem.textContent.split('·')[0];
                const truncated = fullText.length > 3 ? fullText.slice(0, 3) + '...' : fullText;
                const tab = document.querySelector(`.step-tab[data-step="${currentStep}"] .tab-text`);
                if (tab) {
                    tab.childNodes[0].textContent = truncated;
                    tab.closest('.step-tab').classList.add('is-updated');
                }
            }
            // 每次点击next-step-btn时，根据选中基地的packages动态生成step2选项
            const selectedBase = document.querySelector('.tab-panel[data-panel="1"] .selectable-item.is-selected');
            const baseId = selectedBase ? selectedBase.dataset.id : '';
            updatePackagesList(baseId);
            if (currentStep < totalSteps) {
                    maxReachedStep = Math.max(maxReachedStep, currentStep + 1);
                    // 从步骤2通过 next-step-btn 进入步骤3时，解锁步骤3
                    if (currentStep === 2) { isStep3Unlocked = true; }
                    goToStep(currentStep + 1);
                }
            else {
                const quantity = quantityStepper.querySelector('.stepper-quantity').textContent;
                const selectedDate = calendarGrid.querySelector('.calendar-day.is-selected .day-num');
                console.log(`[Hook] 完成选择! 数量: ${quantity}, 日期: ${selectedDate ? selectedDate.textContent : '未选择'}`);
                alert('已完成选择，准备提交！');
            }
        });
        tabPanels.forEach(panel => { panel.addEventListener('click', handleSelection); });

        // ====== LLM 大模型调用 ======
        // Mock 意图匹配规则
        const MOCK_RULES = [
            { keywords: ['刺激', '极限', '冒险', '惊险', '挑战'], base: 'base-2', pkg: 'pkg-1', reason: '天际线飞跃是最刺激的丛林飞跃体验' },
            { keywords: ['便宜', '省钱', '经济', '实惠', '划算'], base: 'base-1', pkg: 'pkg-3', date: 'nearest_weekday', reason: '哈努曼世界搭配套餐3性价比最高' },
            { keywords: ['风景', '海景', '浪漫', '拍照', '美', '景色'], base: 'base-3', pkg: 'pkg-2', reason: '查龙海景飞跃拥有绝美海景视野' },
            { keywords: ['家庭', '孩子', '小朋友', '亲子', '安全', '初学'], base: 'base-1', pkg: 'pkg-2', reason: '哈努曼世界适合全家体验，安全性高' },
            { keywords: ['大象', '动物', '象'], base: 'base-4', pkg: 'pkg-1', reason: '飞象海景丛林飞跃可以近距离接触大象' },
            { keywords: ['两个人', '2人', '两人', '情侣', '双人'], base: 'base-3', pkg: 'pkg-2', date: 'nearest', quantity: 2, reason: '海景飞跃适合两人浪漫体验' },
        ];

        async function callLLM(userMessage) {
            // 模拟 AI 思考延迟
            await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
            const msg = userMessage.toLowerCase();
            let matched = MOCK_RULES.find(rule => rule.keywords.some(k => msg.includes(k)));
            if (!matched) matched = { base: 'base-1', pkg: 'pkg-1', reason: '为你推荐人气最高的组合' };
            const result = {
                recommendations: [
                    { stepId: 1, optionId: matched.base, reason: matched.reason },
                    { stepId: 2, optionId: matched.pkg, reason: matched.reason },
                    { stepId: 3, optionId: matched.date || 'nearest', reason: '为你选择最近可出行的日期', quantity: matched.quantity || 1 }
                ],
                message: `已为你智能匹配最佳方案：${matched.reason}`
            };
            return JSON.stringify(result);
        }

        // ====== 解析推荐并自动选中 ======
        async function applyRecommendations(result) {
            if (!result || !result.recommendations || result.recommendations.length === 0) { hideStatus(); return; }
            // 大模型路径展开面板时同步暂停视频并添加模糊遮罩
            const video = document.getElementById('fullscreen-video');
            const videoFrame = document.getElementById('video-container');
            if (video && videoFrame) {
                video.pause();
                videoFrame.classList.add('is-blurred');
            }
            const recommendations = result.recommendations;
            for (let i = 0; i < recommendations.length; i++) {
                const rec = recommendations[i];
                const stepId = parseInt(rec.stepId, 10);
                const optionId = rec.optionId;
                const reason = rec.reason;
                console.log(`[AI选择] 步骤${stepId}, 选项: ${optionId}, 原因: ${reason}`);
                if (stepId === 3) {
                    updateStatus('正在为你选择日期...');
                    isStep3Unlocked = true;
                    maxReachedStep = Math.max(maxReachedStep, 3);
                    goToStep(3);
                    await delay(500);
                    const panel = document.querySelector('.tab-panel[data-panel="3"]');
                    if (panel) {
                        let targetDay;
                        if (optionId === 'nearest_weekday') targetDay = panel.querySelector('.calendar-day.is-weekday:not(.is-past)');
                        else if (optionId === 'nearest') targetDay = panel.querySelector('.calendar-day:not(.is-past):not(.more-dates-btn)');
                        else targetDay = panel.querySelector(`[data-id="${optionId}"]`);
                        if (targetDay) {
                            panel.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('is-selected'));
                            targetDay.classList.add('is-selected');
                            // 步骤3选中日期后激活支付按钮
                            const footerInput = document.getElementById('footerInput');
                            const dayPriceEl = targetDay.querySelector('.day-price');
                            const payButtonPrice = document.getElementById('payButtonPrice');
                            if (dayPriceEl && payButtonPrice) {
                                payButtonPrice.textContent = dayPriceEl.textContent.trim();
                            }
                            footerInput.classList.add('is-pay-mode');
                            // 同步高亮日历覆盖层
                            document.querySelectorAll('.calendar-overlay-day').forEach(d => d.classList.remove('is-highlighted'));
                            const selectedDateId = targetDay.dataset.id;
                            if (selectedDateId) {
                                const targetOverlayDay = document.querySelector(`.calendar-overlay-day[data-date-id="${selectedDateId}"]`);
                                if (targetOverlayDay) targetOverlayDay.classList.add('is-highlighted');
                            }
                            const dayNum = targetDay.querySelector('.day-num')?.textContent;
                            const dayWeek = targetDay.querySelector('.day-week')?.textContent;
                            updateStatus(`已选好日期：${dayNum}日 ${dayWeek}`);
                        }
                        if (rec.quantity && rec.quantity > 1) {
                            const quantityDisplay = document.querySelector('.stepper-quantity');
                            if (quantityDisplay) quantityDisplay.textContent = rec.quantity;
                        }
                    }
                    await delay(800);
                } else {
                    const stepName = stepId === 1 ? '基地' : '套餐';
                    updateStatus(`正在为你选择${stepName}...`);
                    maxReachedStep = Math.max(maxReachedStep, stepId);
                    goToStep(stepId);
                    await delay(500);
                    const panel = document.querySelector(`.tab-panel[data-panel="${stepId}"]`);
                    if (panel) {
                        const items = panel.querySelectorAll('[data-selectable]');
                        items.forEach(item => item.classList.remove('is-selected'));
                        let target = panel.querySelector(`[data-id="${optionId}"]`);
                        // 兆底：如果大模型返回的optionId无法匹配，选择第一个选项
                        if (!target) {
                            console.warn(`[AI选择] 步骤${stepId}未找到optionId: ${optionId}, 兆底选第一项`);
                            target = panel.querySelector('[data-selectable]');
                        }
                        if (target) {
                            target.classList.add('is-selected');
                            const title = target.querySelector('.title')?.textContent || '';
                            updateStatus(`已选好：${title}`);
                            // 同步更新 step-tab 文字信息
                            const fullText = title.split('·')[0];
                            const truncated = fullText.length > 3 ? fullText.slice(0, 3) + '...' : fullText;
                            const tabText = document.querySelector(`.step-tab[data-step="${stepId}"] .tab-text`);
                            if (tabText) {
                                tabText.childNodes[0].textContent = truncated;
                                tabText.closest('.step-tab').classList.add('is-updated');
                            }
                        }
                    }
                    await delay(800);
                }
            }
            // 如果大模型未返回步骤3推荐，自动补选最近日期
            const hasStep3 = recommendations.some(r => parseInt(r.stepId, 10) === 3);
            if (!hasStep3) {
                updateStatus('正在为你选择日期...');
                isStep3Unlocked = true;
                maxReachedStep = Math.max(maxReachedStep, 3);
                goToStep(3);
                await delay(500);
                const panel = document.querySelector('.tab-panel[data-panel="3"]');
                if (panel) {
                    const targetDay = panel.querySelector('.calendar-day:not(.is-past):not(.more-dates-btn)');
                    if (targetDay) {
                        panel.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('is-selected'));
                        targetDay.classList.add('is-selected');
                        const footerInput = document.getElementById('footerInput');
                        const dayPriceEl = targetDay.querySelector('.day-price');
                        const payButtonPrice = document.getElementById('payButtonPrice');
                        if (dayPriceEl && payButtonPrice) { payButtonPrice.textContent = dayPriceEl.textContent.trim(); }
                        footerInput.classList.add('is-pay-mode');
                        document.querySelectorAll('.calendar-overlay-day').forEach(d => d.classList.remove('is-highlighted'));
                        const selectedDateId = targetDay.dataset.id;
                        if (selectedDateId) {
                            const targetOverlayDay = document.querySelector(`.calendar-overlay-day[data-date-id="${selectedDateId}"]`);
                            if (targetOverlayDay) targetOverlayDay.classList.add('is-highlighted');
                        }
                        const dayNum = targetDay.querySelector('.day-num')?.textContent;
                        const dayWeek = targetDay.querySelector('.day-week')?.textContent;
                        updateStatus(`已选好日期：${dayNum}日 ${dayWeek}`);
                    }
                }
                await delay(800);
            }
            // 强制确保状态文案可见（绕过所有CSS隐藏规则）
            const finalStatusLine = document.getElementById('aiStatusLine');
            const finalStatusText = document.getElementById('aiStatusText');
            if (finalStatusLine && finalStatusText) {
                finalStatusText.textContent = '已根据你的需求为你匹配最佳商品，放心购买';
                finalStatusLine.style.display = 'flex';
                finalStatusLine.style.opacity = '1';
                finalStatusLine.classList.add('is-visible');
            }
            if (result.message) console.log('[LLM回复]', result.message);
        }

        // ====== 输入框交互 ======
        let isInputFocused = false;
        const expandInput = () => { if (isInputFocused) return; isInputFocused = true; footerInput.classList.add('is-focused'); panelKeyboardWrapper.classList.add('is-keyboard-open'); document.querySelector('.page').classList.add('is-keyboard-open'); const video = document.getElementById('fullscreen-video'); const videoFrame = document.getElementById('video-container'); if (video && videoFrame) { video.pause(); videoFrame.classList.add('is-blurred'); } };
        const collapseInput = () => { if (!isInputFocused) return; isInputFocused = false; footerInput.classList.remove('is-focused'); footerInput.classList.remove('has-text'); panelKeyboardWrapper.classList.remove('is-keyboard-open'); document.querySelector('.page').classList.remove('is-keyboard-open'); inputEditable.textContent = ''; if (!isExpanded) { const video = document.getElementById('fullscreen-video'); const videoFrame = document.getElementById('video-container'); if (video && videoFrame) { video.play(); videoFrame.classList.remove('is-blurred'); } } };
        const checkInputContent = () => { const text = inputEditable.textContent.trim(); footerInput.classList.toggle('has-text', text.length > 0); };

        inputArea.addEventListener('click', (e) => { if (!isInputFocused) expandInput(); });
        inputEditable.addEventListener('input', checkInputContent);
        document.addEventListener('click', (e) => {
            if (!isInputFocused) return;
            if (footerInput.contains(e.target)) return;
            if (keyboardImage.contains(e.target)) return;
            collapseInput();
        });

        // ====== 发送按钮 ======
        sendBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const text = inputEditable.textContent.trim();
            if (!text) return;
            sendBtn.style.pointerEvents = 'none';
            sendBtn.style.opacity = '0.5';
            isInputFocused = false;
            footerInput.classList.remove('is-focused');
            footerInput.classList.remove('has-text');
            panelKeyboardWrapper.classList.remove('is-keyboard-open');
            document.querySelector('.page').classList.remove('is-keyboard-open');
            inputEditable.textContent = '';
            isExpanded = true;
            aiPanel.classList.add('is-expanded');
            panelKeyboardWrapper.classList.add('is-expanded');
            document.querySelector('.page').classList.add('is-panel-expanded');
            // 强制显示 info-section，隐藏 info-tags
            const basicInfoArea = document.querySelector('.basic-info-area');
            if (basicInfoArea) { basicInfoArea.style.opacity = '1'; basicInfoArea.style.pointerEvents = 'auto'; }
            const infoTags = document.querySelector('.info-tags');
            if (infoTags) { infoTags.style.display = 'none'; }
            showStatus('正在思考理解你的需求');
            try {
                const rawResponse = await callLLM(text);
                if (!rawResponse) { updateStatus('AI服务暂时不可用，请稍后再试'); await delay(2000); hideStatus(); return; }
                updateStatus('正在为你匹配最佳选项...');
                console.log('[LLM原始响应]', rawResponse);
                let result = null;
                // 预处理：移除 <think>...</think> 标签内容
                let cleaned = rawResponse.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
                try { result = JSON.parse(cleaned); }
                catch (parseErr) {
                    const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
                    if (jsonMatch) result = JSON.parse(jsonMatch[1].trim());
                    else {
                        const startIdx = cleaned.indexOf('{');
                        const endIdx = cleaned.lastIndexOf('}');
                        if (startIdx !== -1 && endIdx !== -1) result = JSON.parse(cleaned.substring(startIdx, endIdx + 1));
                        else throw new Error('无法从响应中提取JSON');
                    }
                }
                await applyRecommendations(result);
            } catch (err) { console.error('[LLM错误]', err); updateStatus('解析失败，请重新描述你的需求'); await delay(2000); hideStatus(); }
            finally { sendBtn.style.pointerEvents = ''; sendBtn.style.opacity = ''; }
        });

    // ====== 初始化 ======
        setupStepper();
        setupCalendar();
        setupCalendarOverlay();
        updateNextButtonState();

        // ====== 立即预订按钮跳转 ======
        const payButton = document.getElementById('payButton');
        if (payButton) {
            payButton.addEventListener('click', () => {
                const selectedBase = document.querySelector('.tab-panel[data-panel="1"] .selectable-item.is-selected');
                const baseTitle = selectedBase ? selectedBase.querySelector('.title').textContent.trim() : '';
                const step2TabText = document.querySelector('.step-tab[data-step="2"] .tab-text');
                if (step2TabText) {
                    localStorage.setItem('selectedTicketTitle', step2TabText.childNodes[0].textContent.trim());
                }
                const selectedStep2 = document.querySelector('.selectable-item.option-step2.is-selected');
                if (selectedStep2) {
                    const step2Subtitle = selectedStep2.querySelector('.subtitle');
                    if (step2Subtitle) {
                        localStorage.setItem('selectedTicketSubtitle', step2Subtitle.textContent.trim());
                    }
                }

                // 获取数量
                const quantity = document.querySelector('.stepper-quantity');
                if (quantity) {
                    localStorage.setItem('selectedQuantity', quantity.textContent.trim());
                }

                // 获取选中日期
                const selectedDateEl = document.querySelector('.calendar-day.is-selected');
                if (selectedDateEl) {
                    const dateId = selectedDateEl.getAttribute('data-id'); // "2026-05-22"
                    const dayWeek = selectedDateEl.querySelector('.day-week');
                    localStorage.setItem('selectedDateId', dateId || '');
                    localStorage.setItem('selectedDayWeek', dayWeek ? dayWeek.textContent.trim() : '');
                }

                window.location.href = 'select_item.html?title=' + encodeURIComponent(baseTitle);
            });
        }
    });
