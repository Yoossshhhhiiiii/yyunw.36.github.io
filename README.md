# FUJI — 三張來自山頂的明信片

富士山三張明信片的互動網站。選擇照片或星點可閱讀對應的原文故事，並播放使用者提供的音樂。故事視窗提供暫停／繼續、停止及關閉控制。網站支援手機與桌面瀏覽。

公開網址：<https://yoossshhhhiiiii.github.io/yyunw.36.github.io/>

## 檔案

- 根目錄的 `index.html` 與 `assets/` 是 GitHub Pages 直接發布的版本。
- `_source/` 是 React／Vite 原始碼，包含三張圖片、音樂、星圖背景及文字資料。
- `captions.json` 保留原始明信片文字的獨立資料副本。

## 本機開發與重新建置

```sh
cd _source
npm ci
npm run dev
npm run build:pages
```

建置後，把 `_source/dist-pages/index.html` 和 `_source/dist-pages/assets/` 複製到倉庫根目錄，再提交並推送 `main`。`build:pages` 已設定 GitHub Pages 專案子路徑 `/yyunw.36.github.io/`。
