// ==UserScript==
// @name        豆包下载无水印
// @namespace    https://github.com/xiaowang96-github/doubaoNowatermark
// @version      1.0
// @description  尝试从豆包下载不带水印的大图
// @author      xiaowang
// @match        *://www.doubao.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面完全加载
    window.addEventListener('load', function() {
        console.log('页面已加载');

        // 使用MutationObserver监视DOM变化
        const observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const downloadButton = node.querySelector('[data-testid="edit_image_download_button"]');
                            if (downloadButton) {
                                console.log('下载原图按钮已出现');
                                addDownloadNoWatermarkButton(downloadButton);
                                observer.disconnect(); // 停止观察，因为我们已经找到了按钮
                                observeImageChanges();
                            }
                        }
                    });
                }
            }
        });

        // 开始观察body元素及其子节点的变化
        observer.observe(document.body, { childList: true, subtree: true });

        // 监听所有的点击事件
        document.addEventListener('click', function(event) {
            // 检查是否点击了下载无水印图按钮
            if (event.target && event.target.closest('#download_no_watermark_button')) {
                console.log('下载无水印图按钮被点击');

                // 获取图片容器中的图片元素
                const imageContainer = document.querySelector('div[class="center-content-_0Bhud"]');
                if (!imageContainer) {
                    console.error('无法找到图片容器');
                    return;
                }

                const imgElement = imageContainer.querySelector('div[data-testid="canvas_image_container"]');
                const imgElementin = imgElement.querySelector('img[data-testid="in_painting_picture"]');
                if (!imgElement) {
                    console.error('无法找到图片元素');
                    return;
                }

                // 获取原始图片URL
                let imageUrl = imgElementin.src;
                const urlWithoutWatermark = imageUrl;

                // 创建一个隐藏的链接用于下载
                //    const link = document.createElement('a');
                //     link.style.display='none';
                //      link.href = imageUrl;
                //     document.body.appendChild(link);
                // link.download = 'image.jpg';

                // 触发点击事件
                //       link.click();
                async function downloadFile(url, filename) {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    const objectUrl = URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = objectUrl;
                    a.download = filename;
                    a.click();
                    URL.revokeObjectURL(objectUrl);
                }
                downloadFile(imageUrl,"imageorgin.png");

                console.log('正在下载大图:', urlWithoutWatermark);

                // 阻止默认行为
                event.preventDefault();
            }
        });
    });

    function addDownloadNoWatermarkButton(downloadButton) {
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
        const targetDiv = document.querySelector('.right-dVuO4Z');
        // 将新按钮添加到文档中
        if (targetDiv) {
            targetDiv.appendChild(newButton);
        } else {
            console.error('未找到具有 right-Mn0KqP right-top-FrGw1E 类名的元素');
        }


        console.log('下载无水印图按钮已添加');
    }

    function observeImageChanges() {
        const imageContainer = document.querySelector('[data-testid="canvas_image_container"]');
        if (!imageContainer) {
            console.error('无法找到图片容器');
            return;
        }

        const imgElement = imageContainer.querySelector('img[data-testid="in_painting_picture"]');
        if (!imgElement) {
            console.error('无法找到图片元素');
            return;
        }

        const imageObserver = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    console.log('图片URL已更改');
                    updateDownloadLink(imgElement);
                }
            }
        });

        // 开始观察图片元素的src属性变化
        imageObserver.observe(imgElement, { attributes: true });
    }

    function updateDownloadLink(imgElement) {
        const imageUrl = imgElement.src;
        const urlWithoutWatermark = imageUrl.split('?')[0];
        const downloadLink = document.getElementById('download_link');
        if (downloadLink) {
            downloadLink.href = urlWithoutWatermark;
        } else {
            console.error('下载链接未找到');
        }
    }
})();
