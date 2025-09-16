document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const markdownFileInput = document.getElementById('markdown-file');
    const markdownContent = document.getElementById('markdown-content');
    const themeToggle = document.getElementById('theme-toggle');
    const increaseFont = document.getElementById('increase-font');
    const decreaseFont = document.getElementById('decrease-font');
    const printContent = document.getElementById('print-content');
    const highlightStyle = document.getElementById('highlight-style');
    const toggleToc = document.getElementById('toggle-toc');
    const tocDropdown = document.getElementById('toc');
    const tocSidebar = document.getElementById('toc-sidebar');
    const tocContent = document.getElementById('toc-content');
    const aboutLink = document.getElementById('about-link');
    const aboutModal = document.getElementById('about-modal');
    const closeModal = document.querySelector('.close-modal');
    const highlightTheme = document.getElementById('highlight-theme');
    
    // 设置marked选项，使其更接近GitHub风格
    marked.setOptions({
        renderer: new marked.Renderer(),
        highlight: function(code, language) {
            const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
            return hljs.highlight(code, { language: validLanguage }).value;
        },
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
    });
    
    // 初始化主题
    initTheme();
    
    // 初始化字体大小
    let fontSize = localStorage.getItem('md-fontSize') || 16;
    updateFontSize(fontSize);
    
    // 初始化响应式布局
    handleResponsiveLayout();
    
    // 创建返回顶部按钮
    createBackToTopButton();
    
    // 添加窗口大小变化事件监听
    window.addEventListener('resize', function() {
        handleResponsiveLayout();
    });
    
    // 文件选择事件处理
    markdownFileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        
        if (!file) return;
        
        // 只处理Markdown文件
        if (!file.name.match(/\.(md|markdown|txt)$/i)) {
            alert('请选择Markdown文件 (.md, .markdown, .txt)');
            return;
        }
        
        const reader = new FileReader();
        
        // 文件读取完成后处理
        reader.onload = function(e) {
            const content = e.target.result;
            
            // 清除占位符
            markdownContent.innerHTML = '';
            
            // 渲染Markdown
            markdownContent.innerHTML = marked.parse(content);
            
            // 处理代码块的语法高亮
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });

            // 处理任务列表
            handleTaskLists();
            
            // 为图片添加点击放大功能
            setupImageZoom();
            
            // 为代码块添加现代化的复制功能
            setupCodeCopy();
            
            // 生成目录
            generateTableOfContents();
        };
        
        reader.readAsText(file);
    });
    
    // 主题切换
    themeToggle.addEventListener('click', function() {
        const darkMode = document.body.classList.toggle('dark-theme');
        localStorage.setItem('md-dark-mode', darkMode ? 'true' : 'false');
        
        // 调整代码高亮主题
        updateCodeHighlightTheme(darkMode);
    });
    
    // 增大字体
    increaseFont.addEventListener('click', function() {
        fontSize = Math.min(24, parseInt(fontSize) + 1);
        updateFontSize(fontSize);
    });
    
    // 减小字体
    decreaseFont.addEventListener('click', function() {
        fontSize = Math.max(12, parseInt(fontSize) - 1);
        updateFontSize(fontSize);
    });
    
    // 打印内容
    printContent.addEventListener('click', function() {
        window.print();
    });
    
    // 切换高亮样式
    highlightStyle.addEventListener('change', function() {
        const style = this.value;
        highlightTheme.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/${style}.min.css`;
        localStorage.setItem('md-highlight-style', style);
    });
    
    // 切换目录显示（下拉菜单）
    toggleToc.addEventListener('click', function(e) {
        e.stopPropagation();
        tocDropdown.classList.toggle('active');
        
        // 修改：切换侧边栏目录显示/隐藏，不受屏幕大小限制
        tocSidebar.classList.toggle('active');
    });
    
    // 点击文档其他位置关闭目录下拉菜单
    document.addEventListener('click', function() {
        tocDropdown.classList.remove('active');
    });
    
    // 阻止点击目录下拉内容时关闭
    tocDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // 显示关于模态框
    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();
        aboutModal.style.display = 'block';
    });
    
    // 关闭关于模态框
    closeModal.addEventListener('click', function() {
        aboutModal.style.display = 'none';
    });
    
    // 点击模态框背景关闭
    aboutModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
    
    // 处理任务列表 (GitHub风格的复选框)
    function handleTaskLists() {
        const lis = document.querySelectorAll('li');
        
        lis.forEach(function(li) {
            if (li.textContent.startsWith('[ ] ')) {
                const text = li.innerHTML.replace('[ ] ', '');
                li.innerHTML = '<input type="checkbox" disabled> ' + text;
                li.classList.add('task-list-item');
            } else if (li.textContent.startsWith('[x] ') || li.textContent.startsWith('[X] ')) {
                const text = li.innerHTML.replace(/\[(x|X)\] /, '');
                li.innerHTML = '<input type="checkbox" checked disabled> ' + text;
                li.classList.add('task-list-item');
            }
        });
    }

    // 添加简单的拖放支持
    const dropZone = document.querySelector('.markdown-container');
    
    dropZone.addEventListener('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        this.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', function(e) {
        e.stopPropagation();
        e.preventDefault();
        this.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            markdownFileInput.files = files;
            
            // 手动触发change事件
            const event = new Event('change');
            markdownFileInput.dispatchEvent(event);
        }
    });

    // 处理响应式布局
    function handleResponsiveLayout() {
        const windowWidth = window.innerWidth;
        
        // 修改：不根据屏幕大小自动显示侧边栏目录
        // 只有用户点击目录按钮时才显示
        if (windowWidth < 768) {
            tocSidebar.classList.remove('active');
        }
        
        // 注释掉自动显示侧边栏的代码
        /*
        if (windowWidth >= 768) {
            if (markdownContent.innerHTML !== '' && !markdownContent.querySelector('.placeholder')) {
                tocSidebar.classList.add('active');
            }
        } else {
            tocSidebar.classList.remove('active');
        }
        */
    }

    // 样式增强
    addDragoverStyle();
    
    // 创建图片查看模态框
    createImageModal();
    
    // 从本地存储加载高亮样式
    loadHighlightStyle();
});

// 初始化主题设置
function initTheme() {
    const darkMode = localStorage.getItem('md-dark-mode');
    if (darkMode === 'true') {
        document.body.classList.add('dark-theme');
        updateCodeHighlightTheme(true);
    } else if (darkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // 如果未设置主题但系统是暗色主题
        document.body.classList.add('dark-theme');
        updateCodeHighlightTheme(true);
    }
}

// 更新代码高亮主题
function updateCodeHighlightTheme(darkMode) {
    const highlightTheme = document.getElementById('highlight-theme');
    const currentStyle = localStorage.getItem('md-highlight-style');
    
    if (darkMode) {
        if (currentStyle && currentStyle !== 'github') {
            // 保持当前选择的样式
            return;
        }
        highlightTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css';
        document.getElementById('highlight-style').value = 'github-dark';
    } else {
        if (currentStyle && currentStyle !== 'github-dark') {
            // 保持当前选择的样式
            return;
        }
        highlightTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github.min.css';
        document.getElementById('highlight-style').value = 'github';
    }
}

// 更新字体大小
function updateFontSize(size) {
    document.documentElement.style.setProperty('--content-font-size', `${size}px`);
    localStorage.setItem('md-fontSize', size);
}

// 加载高亮样式
function loadHighlightStyle() {
    const style = localStorage.getItem('md-highlight-style');
    if (style) {
        document.getElementById('highlight-style').value = style;
        document.getElementById('highlight-theme').href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/${style}.min.css`;
    }
}

// 生成目录
function generateTableOfContents() {
    const headings = document.querySelectorAll('.markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6');
    
    if (headings.length === 0) {
        document.getElementById('toggle-toc').style.display = 'inline-flex';
        
        // 添加：在目录为空时显示提示信息
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'toc-empty-message';
        emptyMessage.textContent = '文档中未找到标题，无法生成目录';
        emptyMessage.style.color = 'var(--text-muted)';
        emptyMessage.style.padding = '10px';
        emptyMessage.style.textAlign = 'center';
        
        document.getElementById('toc-content').innerHTML = '';
        document.getElementById('toc-content').appendChild(emptyMessage);
        
        document.getElementById('toc').innerHTML = '';
        const dropdownMessage = emptyMessage.cloneNode(true);
        document.getElementById('toc').appendChild(dropdownMessage);
        
        return;
    } else {
        document.getElementById('toggle-toc').style.display = 'inline-flex';
    }
    
    const toc = document.createElement('ul');
    let currentLevel = 0;
    let currentList = toc;
    let listStack = [toc];
    
    headings.forEach((heading, index) => {
        // 获取标题级别
        const level = parseInt(heading.tagName.substring(1));
        
        // 为标题添加ID
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        // 创建目录项
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.addEventListener('click', function(e) {
            // 关闭下拉菜单
            document.getElementById('toc').classList.remove('active');
            
            // 在小屏幕上点击目录项后自动隐藏侧边栏目录
            if (window.innerWidth < 768) {
                document.getElementById('toc-sidebar').classList.remove('active');
            }
            
            // 平滑滚动到标题位置
            e.preventDefault();
            const targetHeading = document.getElementById(heading.id);
            const targetPosition = targetHeading.getBoundingClientRect().top + window.pageYOffset;
            
            window.scrollTo({
                top: targetPosition - 20,
                behavior: 'smooth'
            });
        });
        listItem.appendChild(link);
        
        // 处理嵌套层次
        if (level > currentLevel) {
            // 创建子列表
            const newList = document.createElement('ul');
            listStack[listStack.length - 1].lastChild.appendChild(newList);
            listStack.push(newList);
            currentList = newList;
        } else if (level < currentLevel) {
            // 返回上一级
            const steps = currentLevel - level;
            for (let i = 0; i < steps; i++) {
                listStack.pop();
            }
            currentList = listStack[listStack.length - 1];
        }
        
        currentLevel = level;
        currentList.appendChild(listItem);
    });
    
    // 更新侧边栏和下拉菜单的目录
    document.getElementById('toc-content').innerHTML = '';
    document.getElementById('toc-content').appendChild(toc.cloneNode(true));
    
    document.getElementById('toc').innerHTML = '';
    document.getElementById('toc').appendChild(toc);
    
    // 显示侧边栏（仅在大屏幕上）
    handleResponsiveLayout();
}

// 添加拖放区域的样式
function addDragoverStyle() {
    const style = document.createElement('style');
    style.textContent = `
        .markdown-container.dragover {
            border: 2px dashed #0366d6;
            background-color: rgba(3, 102, 214, 0.05);
        }
        
        .task-list-item {
            list-style-type: none;
            margin-left: -20px;
        }
        
        .task-list-item input {
            margin-right: 8px;
        }
        
        /* 图片悬停样式 */
        .markdown-content img {
            cursor: zoom-in;
            transition: filter 0.2s, transform 0.2s;
            border-radius: 3px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .markdown-content img:hover {
            filter: brightness(0.95);
            transform: scale(1.01);
        }
        
        /* 图片模态框样式 */
        .image-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            padding: 40px;
            box-sizing: border-box;
            overflow: hidden;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            backdrop-filter: blur(5px);
        }
        
        .image-modal.active {
            display: flex;
            opacity: 1;
            flex-direction: column;
        }
        
        .modal-image {
            max-width: 90%;
            max-height: 85vh;
            object-fit: contain;
            border-radius: 6px;
            cursor: zoom-in;
            transition: transform 0.3s ease;
            transform: scale(0.9);
        }
        
        .image-modal.active .modal-image {
            transform: scale(1);
        }
        
        .close-modal {
            position: absolute;
            top: 20px;
            right: 20px;
            color: white;
            font-size: 30px;
            font-weight: bold;
            cursor: pointer;
            background: none;
            border: none;
            padding: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
            z-index: 10;
        }
        
        .close-modal:hover {
            transform: scale(1.1);
        }
        
        .image-caption {
            margin-top: 16px;
            color: white;
            text-align: center;
            font-size: 16px;
            max-width: 90%;
            word-break: break-word;
        }
        
        /* GitHub风格代码块 */
        .markdown-content pre {
            position: relative;
            margin-bottom: 16px;
            background-color: #f6f8fa;
            border: 1px solid #d0d7de;
            border-radius: 6px;
            overflow: visible;
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
        }
        
        .markdown-content pre::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        
        .markdown-content pre::-webkit-scrollbar-track {
            background-color: transparent;
        }
        
        .markdown-content pre::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 4px;
        }
        
        .markdown-content pre::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0, 0, 0, 0.2);
        }
        
        .markdown-content pre code {
            padding: 12px 16px;
            display: block;
            line-height: 1.45;
            font-size: 85%;
            tab-size: 2;
            overflow-x: auto;
            white-space: pre;
            word-wrap: normal;
        }
        
        /* 代码语言标签 - GitHub风格 */
        .code-language-tag {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 12px;
            color: #57606a;
            background-color: #f6f8fa;
            border-left: 1px solid #d0d7de;
            border-bottom: 1px solid #d0d7de;
            border-bottom-left-radius: 6px;
            padding: 4px 10px;
            user-select: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            z-index: 5;
        }
        
        /* 复制按钮 - GitHub风格 */
        .gh-clipboard {
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 10;
            opacity: 0;
            color: #57606a;
            background-color: transparent;
            border: none;
            padding: 0;
            cursor: pointer;
            transition: opacity 0.2s ease;
        }
        
        .markdown-content pre:hover .gh-clipboard {
            opacity: 1;
        }
        
        .gh-clipboard:hover {
            color: #0969da;
        }
        
        .gh-clipboard:active {
            transform: scale(0.97);
        }
        
        .gh-clipboard--success {
            color: #1a7f37;
        }
        
        /* 代码语法高亮 - GitHub风格 */
        .markdown-content pre code .hljs-comment,
        .markdown-content pre code .hljs-quote {
            color: #6e7781;
            font-style: italic;
        }
        
        .markdown-content pre code .hljs-keyword,
        .markdown-content pre code .hljs-selector-tag {
            color: #cf222e;
        }
        
        .markdown-content pre code .hljs-string,
        .markdown-content pre code .hljs-attr {
            color: #0a3069;
        }
        
        .markdown-content pre code .hljs-variable,
        .markdown-content pre code .hljs-template-variable {
            color: #953800;
        }
        
        .markdown-content pre code .hljs-type,
        .markdown-content pre code .hljs-built_in {
            color: #8250df;
        }
        
        /* 响应式适配 */
        @media (max-width: 768px) {
            .markdown-content pre {
                overflow: visible;
            }
            
            .markdown-content pre code {
                padding: 10px 12px;
                font-size: 80%;
            }
            
            .code-language-tag {
                font-size: 10px;
                padding: 3px 8px;
            }
        }
        
        /* 暗色模式适配 - GitHub风格 */
        body.dark-theme .markdown-content pre,
        @media (prefers-color-scheme: dark) {
            body:not(.light-theme) .markdown-content pre {
                background-color: #161b22;
                border-color: #30363d;
            }
            
            body:not(.light-theme) .markdown-content pre::-webkit-scrollbar-thumb {
                background-color: rgba(255, 255, 255, 0.1);
            }
            
            body:not(.light-theme) .markdown-content pre::-webkit-scrollbar-thumb:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
            
            body:not(.light-theme) .code-language-tag {
                color: #8b949e;
                background-color: #161b22;
                border-color: #30363d;
            }
            
            body:not(.light-theme) .gh-clipboard {
                color: #8b949e;
            }
            
            body:not(.light-theme) .gh-clipboard:hover {
                color: #58a6ff;
            }
            
            body:not(.light-theme) .gh-clipboard--success {
                color: #2ea043;
            }
            
            body:not(.light-theme) .markdown-content pre code .hljs-comment,
            body:not(.light-theme) .markdown-content pre code .hljs-quote {
                color: #8b949e;
            }
            
            body:not(.light-theme) .markdown-content pre code .hljs-keyword,
            body:not(.light-theme) .markdown-content pre code .hljs-selector-tag {
                color: #ff7b72;
            }
            
            body:not(.light-theme) .markdown-content pre code .hljs-string,
            body:not(.light-theme) .markdown-content pre code .hljs-attr {
                color: #a5d6ff;
            }
            
            body:not(.light-theme) .markdown-content pre code .hljs-variable,
            body:not(.light-theme) .markdown-content pre code .hljs-template-variable {
                color: #ffa657;
            }
            
            body:not(.light-theme) .markdown-content pre code .hljs-type,
            body:not(.light-theme) .markdown-content pre code .hljs-built_in {
                color: #d2a8ff;
            }
        }
        
        /* 返回顶部按钮 */
        .back-to-top {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 40px;
            height: 40px;
            background-color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.14);
            cursor: pointer;
            z-index: 99;
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: all 0.2s ease;
            border: 1px solid rgba(0, 0, 0, 0.05);
            color: #777;
            padding: 0;
        }
        
        .back-to-top.text-button {
            gap: 6px;
            min-width: 120px;
        }
        
        .back-to-top svg {
            display: inline-block;
            vertical-align: middle;
        }
        
        .back-text {
            display: inline-block;
            font-weight: 500;
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .back-to-top:hover {
            background-color: #f5f5f5;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        .back-to-top:active {
            transform: scale(0.98);
        }
        
        /* 暗色模式下的返回顶部按钮 */
        body.dark-theme .back-to-top,
        @media (prefers-color-scheme: dark) {
            body:not(.light-theme) .back-to-top {
                background-color: #333;
                color: #eee;
                border-color: #444;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }
            
            body:not(.light-theme) .back-to-top:hover {
                background-color: #444;
            }
        }
        
        @media (max-width: 900px) {
            .back-to-top {
                right: 16px;
            }
        }

        @media (max-width: 768px) {
            .back-to-top {
                bottom: 16px;
                right: 16px;
            }
        }
    `;
    document.head.appendChild(style);
}

// 创建图片查看模态框
function createImageModal() {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <button class="close-modal">&times;</button>
        <img class="modal-image" src="" alt="">
        <div class="image-caption"></div>
    `;
    document.body.appendChild(modal);
    
    // 关闭模态框事件
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        closeImageModal(modal);
    });
    
    // 点击模态框背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeImageModal(modal);
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeImageModal(modal);
        }
    });
}

// 关闭图片模态框
function closeImageModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }, 300);
}

// 为图片添加点击放大功能
function setupImageZoom() {
    const images = document.querySelectorAll('.markdown-content img');
    const modal = document.querySelector('.image-modal');
    const modalImage = modal.querySelector('.modal-image');
    const imageCaption = modal.querySelector('.image-caption');
    
    // 简单的缩放状态
    let isZoomed = false;
    
    // 图片点击缩放功能
    modalImage.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (isZoomed) {
            // 缩小回原始大小
            isZoomed = false;
            modalImage.style.transform = 'scale(1)';
            modalImage.style.cursor = 'zoom-in';
        } else {
            // 放大图片
            isZoomed = true;
            modalImage.style.transform = 'scale(2)';
            modalImage.style.cursor = 'zoom-out';
        }
    });
    
    // 为每个图片添加点击事件
    images.forEach((img) => {
        // 添加点击事件
        img.addEventListener('click', () => {
            // 重置缩放状态
            isZoomed = false;
            modalImage.style.transform = 'scale(1)';
            modalImage.style.cursor = 'zoom-in';
            
            // 设置图片源
            modalImage.src = img.src;
            
            // 设置图片说明文字（如果有alt或title属性）
            const caption = img.alt || img.title || '';
            imageCaption.textContent = caption;
            
            // 显示模态框
            modal.classList.add('active');
            modal.style.opacity = '1';
            document.body.style.overflow = 'hidden'; // 防止页面滚动
        });
        
        // 添加图片加载指示器
        img.addEventListener('load', () => {
            img.style.opacity = 1;
        });
        
        // 设置初始透明度
        img.style.opacity = 0;
        img.style.transition = 'opacity 0.3s';
    });
}

// 为代码块添加现代化的复制功能
function setupCodeCopy() {
    const codeBlocks = document.querySelectorAll('.markdown-content pre code');
    
    // 为每个代码块添加复制按钮和语言标签
    codeBlocks.forEach((codeBlock) => {
        const preElement = codeBlock.parentElement;
        
        // 设置pre元素为相对定位，以便定位复制按钮
        preElement.style.position = 'relative';
        
        // 获取代码语言
        let language = '';
        if (codeBlock.className) {
            const langMatch = codeBlock.className.match(/language-(\w+)/);
            if (langMatch && langMatch[1]) {
                language = langMatch[1];
                if (language === 'plaintext') language = 'text';
                if (language === 'shell') language = 'bash';
            }
        }
        
        // 如果找到语言，添加语言标签
        if (language && language !== 'hljs') {
            const langTag = document.createElement('div');
            langTag.className = 'code-language-tag';
            langTag.textContent = language;
            preElement.appendChild(langTag);
        }
        
        // 创建复制按钮 - GitHub风格
        const copyButton = document.createElement('button');
        copyButton.className = 'gh-clipboard';
        copyButton.setAttribute('aria-label', '复制代码');
        copyButton.innerHTML = `
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16">
                <path fill="currentColor" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25v-7.5Z"></path>
                <path fill="currentColor" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25v-7.5Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25h-7.5Z"></path>
            </svg>
        `;
        
        // 添加复制功能
        copyButton.addEventListener('click', (e) => {
            // 阻止事件冒泡
            e.stopPropagation();
            
            // 获取代码内容
            const codeText = codeBlock.textContent;
            
            // 复制到剪贴板
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(codeText)
                    .then(() => showCopySuccess(copyButton))
                    .catch((err) => {
                        console.error('复制失败:', err);
                        fallbackCopyTextToClipboard(codeText, copyButton);
                    });
            } else {
                fallbackCopyTextToClipboard(codeText, copyButton);
            }
        });
        
        // 将复制按钮添加到代码块
        preElement.appendChild(copyButton);
    });
    
    // 兼容旧浏览器的复制方法
    function fallbackCopyTextToClipboard(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // 设置样式使其不可见
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopySuccess(button);
            }
        } catch (err) {
            console.error('复制失败:', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    // 显示复制成功 - GitHub风格
    function showCopySuccess(button) {
        // 添加成功类
        button.classList.add('gh-clipboard--success');
        
        // 更改图标为对勾
        const originalIcon = button.innerHTML;
        button.innerHTML = `
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16">
                <path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
            </svg>
        `;
        
        // 显示成功提示词
        button.setAttribute('aria-label', '已复制!');
        
        // 恢复原状
        setTimeout(() => {
            button.classList.remove('gh-clipboard--success');
            button.innerHTML = originalIcon;
            button.setAttribute('aria-label', '复制代码');
        }, 1500);
    }
}

// 创建返回顶部按钮
function createBackToTopButton() {
    // 创建按钮元素
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.setAttribute('aria-label', '返回顶部');
    backToTopButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 15l-6-6-6 6"/>
        </svg>
    `;
    
    // 添加到文档
    document.body.appendChild(backToTopButton);
    
    // 添加点击事件
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 监听滚动事件，控制按钮显示和隐藏
    const scrollThreshold = 300; // 滚动超过这个距离时显示按钮
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
} 