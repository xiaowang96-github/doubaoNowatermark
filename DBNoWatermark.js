// ==UserScript==
// @name        豆包下载无水印
// @namespace    https://github.com/xiaowang96-github/doubaoNowatermark
// @version      1.2
// @description  尝试从豆包下载不带水印的大图
// @author       xiaowang
// @match        *://www.doubao.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 等待页面完全加载
    window.addEventListener('load', function () {
        console.log('页面已加载');

        // 监控 .canvas_wrapper-GK0Ng2 entered-HNbdrI 元素
        const observerCanvasWrapper = new MutationObserver((mutations) => {
            for (const mut of mutations) {
                if (mut.type === 'childList') {
                    const canvasWrappers = document.querySelectorAll('.canvas_wrapper-GK0Ng2.entered-HNbdrI');
                    canvasWrappers.forEach(canvasWrapper => {
                        if (!canvasWrapper.dataset.processed) {
                            console.log('canvas_wrapper-GK0Ng2 entered-HNbdrI 元素已出现');
                            // 标记该元素已被处理
                            canvasWrapper.dataset.processed = true;
                            // 在 .right-dVuO4Z 元素中添加下载按钮
                            setTimeout(() => {
                                addDownloadNoWatermarkButton(canvasWrapper);
                                console.log('已经添加完按钮啦');
                            }, 200); // 延迟 1000 毫秒，即 1 秒
                        }
                    });
                }
            }
        });

        // 配置 MutationObserver 监听 body 元素的子节点变化
        observerCanvasWrapper.observe(document.body, { childList: true, subtree: true });

        // 监控关闭按钮的点击事件
        const observerCloseButton = new MutationObserver((mutations) => {
            for (const mut of mutations) {
                if (mut.type === 'childList') {
                    const closeButton = document.querySelector('[data-testid="edit_image_close_button"]');
                    if (closeButton) {
                        closeButton.addEventListener('click', () => {
                            console.log('关闭按钮被点击');
                            // 重置所有 .canvas_wrapper-GK0Ng2.entered-HNbdrI 元素的状态
                            const canvasWrappers = document.querySelectorAll('.canvas_wrapper-GK0Ng2.entered-HNbdrI');
                            canvasWrappers.forEach(canvasWrapper => {
                                delete canvasWrapper.dataset.processed;
                            });
                        });
                    }
                }
            }
        });

        // 配置 MutationObserver 监听 body 元素的子节点变化
        observerCloseButton.observe(document.body, { childList: true, subtree: true });

        // 监听下载按钮的点击事件
        document.addEventListener('click', function (event) {
            if (event.target && event.target.closest('#download_no_watermark_button')) {
                console.log('下载无水印图按钮被点击');

                // 获取图片容器中的图片元素
                const imageContainer = document.querySelector('div[class="center-content-_0Bhud"]');
                if (!imageContainer) {
                    console.error('无法找到图片容器');
                    return;
                }

                const imgElementin = imageContainer.querySelector('img[data-testid="in_painting_picture"]');
                // 获取原始图片URL
                let imageUrl = imgElementin.src;
                console.log('原始图片URL:', imageUrl);

                async function downloadFile(url, filename) {
                    try {
                        const response = await fetch(url);
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        const blob = await response.blob();
                        const objectUrl = URL.createObjectURL(blob);

                        const a = document.createElement('a');
                        a.href = objectUrl;
                        a.download = filename;
                        a.click();
                        URL.revokeObjectURL(objectUrl);
                    } catch (error) {
                        console.error('下载失败:', error);
                    }
                }

                downloadFile(imageUrl, "imageorgin.png");

                console.log('正在下载大图:', imageUrl);

                // 阻止默认行为
                event.preventDefault();
            }
        });
    });

    function addDownloadNoWatermarkButton(container) {
        // 找到 .right-dVuO4Z 元素
        const targetDiv = container.querySelector('.right-dVuO4Z');
        if (!targetDiv) {
            console.error('未找到具有 right-dVuO4Z 类名的元素');
            return;
        }

        // 创建新的下载无水印图按钮
        const newButton = document.createElement('div');
        newButton.className = 'right-label-btn-wrapper-ryo3eC hover-BfK9He';
        newButton.id = 'download_no_watermark_button';

        // 创建 SVG 图标
        const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgIcon.setAttribute("width", "1em");
        svgIcon.setAttribute("height", "1em");
        svgIcon.setAttribute("fill", "none");
        svgIcon.setAttribute("viewBox", "0 0 24 24");

        // 创建 SVG 路径
        const pathIcon = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathIcon.setAttribute("fill", "currentColor");
        pathIcon.setAttribute("d", "M20.207 12.707a1 1 0 0 0-1.414-1.414L13 17.086V2.5a1 1 0 1 0-2 0v14.586l-5.793-5.793a1 1 0 0 0-1.414 1.414l7.5 7.5c.195.195.45.293.706.293H4a1 1 0 1 0 0 2h16a1 1 0 1 0 0-2h-7.999a1 1 0 0 0 .706-.293z");

        // 将路径添加到 SVG 中
        svgIcon.appendChild(pathIcon);

        // 将 SVG 添加到按钮中
        newButton.appendChild(svgIcon);

        // 创建按钮文本标签
        const spanLabel = document.createElement('span');
        spanLabel.className = 'btn-label-mw0QhY';
        spanLabel.textContent = '下载无水印图';
        // 将文本标签添加到按钮中
        newButton.appendChild(spanLabel);

        // 将新按钮添加到文档中
        targetDiv.appendChild(newButton);

        console.log('下载无水印图按钮已添加');
    }
})();



