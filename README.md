# Markdown阅读器

一个功能丰富的本地Markdown文档阅读器，支持GitHub风格语法、代码高亮、主题切换等多种特性。

## ✨ 特性

- 📝 **GitHub风格Markdown** - 完整支持GFM语法，包括表格、任务列表、代码块等
- 🎨 **多种代码高亮主题** - 支持GitHub、Visual Studio、Atom One Dark等多种主题
- 🌓 **主题切换** - 支持亮色/暗色主题，自动跟随系统偏好
- 📑 **自动目录生成** - 根据文档标题自动生成可点击导航目录
- 🔍 **图片预览** - 点击图片可全屏预览，支持缩放
- 📋 **代码复制** - 一键复制代码块内容，GitHub风格设计
- 🖨️ **打印支持** - 优化的打印样式
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🎯 **拖拽上传** - 支持直接拖拽文件到页面
- ⚡ **纯前端运行** - 无需服务器，完全在浏览器中运行

## 🚀 快速开始

1. **下载项目**
   ```bash
   git clone https://github.com/your-username/markdown-reader.git
   cd markdown-reader
   ```

2. **打开应用**
   - 直接用浏览器打开 `src/index.html` 文件
   - 或者使用本地服务器（推荐）

3. **选择文件**
   - 点击"选择Markdown文件"按钮选择文件
   - 或者直接拖拽 `.md`、`.markdown`、`.txt` 文件到页面

## 📖 使用说明

### 文件支持
- `.md` - 标准Markdown文件
- `.markdown` - Markdown文件
- `.txt` - 纯文本文件

### 功能说明

#### 🎨 主题和样式
- **主题切换**：点击顶部的 🌓 按钮在亮色/暗色主题间切换
- **字体调节**：使用 A+ 和 A- 按钮调整阅读字体大小
- **代码高亮主题**：在工具栏下拉菜单中选择喜欢的代码高亮风格

#### 📑 目录导航
- **自动生成**：基于文档的 H1-H6 标题自动生成目录
- **侧边栏目录**：桌面端显示可折叠的侧边栏目录
- **下拉目录**：移动端和小屏设备使用下拉式目录
- **平滑滚动**：点击目录项平滑滚动到对应位置

#### 💻 代码块功能
- **语法高亮**：支持多种编程语言的语法高亮
- **代码标题**：支持带标题的代码块（使用 `title="标题"` 语法）
- **一键复制**：鼠标悬停显示复制按钮，点击复制代码内容
- **语言标签**：自动显示代码块的编程语言

#### 🖼️ 图片处理
- **点击预览**：点击文档中的图片可全屏预览
- **缩放功能**：预览模式下点击图片可放大2倍
- **键盘操作**：按 ESC 键关闭图片预览

### 🔧 代码块标题语法

支持为代码块添加标题：

````markdown
```javascript title="示例代码"
function hello() {
    console.log('Hello, World!');
}
```
````

## 🏗️ 项目结构

```
markdown-reader/
├── src/
│   ├── index.html      # 主页面
│   ├── main.js         # 核心JavaScript逻辑
│   └── style.css       # 样式文件（如果存在）
├── README.md           # 项目说明
├── LICENSE             # 许可证文件
└── .gitignore          # Git忽略文件
```

## 🛠️ 技术栈

- **Markdown解析**: [Marked.js](https://marked.js.org/) - 快速的Markdown解析器
- **代码高亮**: [highlight.js](https://highlightjs.org/) - 语法高亮库
- **原生技术**: HTML5, CSS3, JavaScript (ES6+)
- **无依赖**: 除了CDN引入的库，无其他依赖

## 🎯 支持的Markdown语法

### 基础语法
- **标题**: # H1 到 ###### H6
- **强调**: *斜体* 和 **粗体**
- **列表**: 有序和无序列表
- **链接**: [链接文本](URL)
- **图片**: ![替代文本](图片URL)
- **代码**: `行内代码` 和 ```代码块```

### 扩展语法（GFM）
- **表格**: 支持对齐方式
- **任务列表**: - [x] 已完成 - [ ] 未完成
- **删除线**: ~~删除的文本~~
- **自动链接**: 自动识别URL

## 🔧 自定义配置

### 本地存储设置
应用会自动保存以下用户偏好：
- 主题选择（亮色/暗色）
- 字体大小设置
- 代码高亮主题选择

### 添加更多语言支持
要支持更多编程语言的语法高亮，可以在 `index.html` 中添加对应的highlight.js语言包：

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/languages/你的语言.min.js"></script>
```

## 📱 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

1. Fork 这个仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

这个项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关资源

- [Markdown语法指南](https://www.markdownguide.org/)
- [GitHub风格Markdown规范](https://github.github.com/gfm/)
- [Marked.js文档](https://marked.js.org/)
- [highlight.js主题预览](https://highlightjs.org/static/demo/)
