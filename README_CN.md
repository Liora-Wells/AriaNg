[English](README.md)

# AriaNg

[![License](https://img.shields.io/github/license/mayswind/AriaNg.svg?style=flat)](https://github.com/mayswind/AriaNg/blob/master/LICENSE)

AriaNg 是一个让 [aria2](https://github.com/aria2/aria2) 更易于使用的现代 Web 前端。本仓库是基于原版的增强分支，包含 Bug 修复、安全更新和新功能。

## 改进与特色功能

### 新增功能

- **自定义下载路径与文件名** — 新建任务时可指定下载目录，并支持重命名文件
- **HTTPS 部署友好提示** — 当通过 HTTPS 访问 AriaNg（如通过 Cloudflare 部署）时，RPC 设置页面会显示醒目的警告横幅，说明 HTTP/WS 连接被浏览器拦截的原因，并针对第三方 aria2 客户端用户和直接运行 aria2 的用户分别给出解决方案

### Bug 修复

- **HTTP 自定义请求头解析** — 修复了 Header 值中包含冒号时（如 `Date: Tue, 01 Jan 2023 00:00:00 GMT`）被静默跳过的问题，现在正确按第一个冒号分割
- **文件扩展名过滤正则** — 修复了 `.tar.gz` 等多级扩展名无法正确匹配的问题
- **WebSocket 重连内存泄漏** — 新增重连定时器清理机制，避免重复定时器和内存泄漏
- **LocalStorage 拼写错误** — 修正 `localStroage` → `localStorage`（4 处），避免后续维护混淆

### 依赖安全升级

| 依赖 | 升级前 | 升级后 |
|------|--------|--------|
| Angular | 1.6.10 | 1.8.3 |
| jQuery | 3.4.1 | 3.7.1 |

Angular 1.6.x 存在已知安全漏洞，1.8.3 是最终稳定版。jQuery 3.7.1 包含多个安全补丁。

### 代码质量优化

- 将 FileReader 回调中的 `$scope.$apply` 替换为 `$scope.$evalAsync`，防止潜在的 `$digest already in progress` 错误
- 已验证所有 `for...in` 循环均有 `hasOwnProperty` 保护

### 本地化改进

- 补充缺失的中文翻译
- 优化文件名跨平台编码处理

---

## 简介

AriaNg 使用纯 HTML 和 JavaScript 编写，不需要任何编译器或运行时环境。只需将 AriaNg 放入 Web 服务器并在浏览器中打开即可使用。AriaNg 采用响应式布局，支持任何桌面或移动设备。

## 功能特性

1. 纯 HTML 和 JavaScript，无需运行时环境
2. 响应式设计，支持桌面和移动设备
3. 友好的用户界面
    * 按名称、大小、进度、剩余时间、下载速度等排序任务、文件和 BT 节点
    * 搜索任务
    * 重试任务
    * 拖拽调整任务顺序
    * 更丰富的任务信息（健康度、BT 节点客户端信息等）
    * 按文件类型（视频、音频、图片、文档、应用程序、存档等）或扩展名过滤文件
    * 多目录任务的树形视图
    * aria2 或单个任务的下载/上传速度图表
    * 完整支持 aria2 设置
4. 深色主题
5. URL 命令行 API 支持
6. 下载完成通知
7. 多语言支持
8. 多 aria2 RPC 主机支持
9. 导入/导出设置支持
10. 低带宽占用，仅请求增量数据

## 截图

#### 桌面端
![AriaNg](https://raw.githubusercontent.com/mayswind/AriaNg-WebSite/master/screenshots/desktop.png)
#### 移动端
![AriaNg](https://raw.githubusercontent.com/mayswind/AriaNg-WebSite/master/screenshots/mobile.png)

## 安装

AriaNg 提供三个版本：标准版、All-In-One 版和 [AriaNg Native](https://github.com/mayswind/AriaNg-Native)。标准版适合部署在 Web 服务器中，支持按需加载。All-In-One 版适合本地使用，下载后直接在浏览器中打开唯一的 HTML 文件即可。[AriaNg Native](https://github.com/mayswind/AriaNg-Native) 同样适合本地使用，且无需浏览器。

#### 预构建版本

最新发布版：[https://github.com/mayswind/AriaNg/releases](https://github.com/mayswind/AriaNg/releases)

最新每日构建（标准版）：[https://github.com/mayswind/AriaNg-DailyBuild/archive/master.zip](https://github.com/mayswind/AriaNg-DailyBuild/archive/master.zip)

#### 从源码构建

确保已安装 [Node.js](https://nodejs.org/)、[NPM](https://www.npmjs.com/) 和 [Gulp](https://gulpjs.com/)。然后下载源码，按以下步骤操作。

##### 标准版

    $ npm install
    $ gulp clean build

##### All-In-One 版

    $ npm install
    $ gulp clean build-bundle

构建产物将输出到 dist 目录。

#### 使用说明

由于 AriaNg 标准版异步加载语言资源，直接在本地文件系统打开 index.html 可能无法正常运行。建议使用 All-In-One 版本，或将 AriaNg 部署到 Web 容器中，或下载无需浏览器的 [AriaNg Native](https://github.com/mayswind/AriaNg-Native)。

## 翻译

欢迎所有人贡献翻译。所有翻译文件位于 `/src/langs/`，您可以直接修改并提交 Pull Request。

如需翻译为新语言，请在 `/src/scripts/config/languages.js` 中添加语言配置，然后将 `/i18n/en.sample.txt` 复制到 `/src/langs/` 并重命名为目标语言代码，即可开始翻译。

当前可用翻译：

| 标签 | 语言 | 贡献者 |
| --- | --- | --- |
| cz-CZ | Čeština | [@vorm04](https://github.com/vorm04) |
| de-DE | Deutsch | [@Malonsow](https://github.com/Malonsow) |
| en | English | / |
| es | Español | [@castillofrancodamian](https://github.com/castillofrancodamian) |
| fr-FR | Français | [@Valaraukar86](https://github.com/Valaraukar86) |
| it-IT | Italiano | [@ale-saglia](https://github.com/ale-saglia) |
| pl-PL | Polski | [@Pirania3680](https://github.com/Pirania3680) |
| ru-RU | Русский | [@gazizovemil](https://github.com/gazizovemil) |
| zh-Hans | 简体中文 | / |
| zh-Hant | 繁體中文 | [@zhtw2013](https://github.com/zhtw2013) [@ChiaYen-Kan](https://github.com/ChiaYen-Kan) |

没有您的语言？欢迎帮助我们添加！

## 文档

1. [English](http://ariang.mayswind.net)
2. [简体中文](http://ariang.mayswind.net/zh_Hans)

## 演示

请访问 [http://ariang.mayswind.net/latest](http://ariang.mayswind.net/latest)

## 第三方扩展

有一些基于 AriaNg 的第三方应用，让您可以在更多场景和设备上使用 AriaNg。请访问[第三方扩展](http://ariang.mayswind.net/3rd-extensions.html)了解更多信息。

## 许可证

[MIT](https://github.com/mayswind/AriaNg/blob/master/LICENSE)
