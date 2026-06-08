[面試題] 為什麼選 Vite 不選 Vue CLI？
Vite 用原生 ES modules + esbuild，dev server 啟動幾乎秒開，HMR 也比 webpack 快很多。Vue CLI
已進入維護模式，新專案官方推薦 Vite。

- create vite@latest — 用 Vite 官方工具建立專案
- --template vue-ts — 選 Vue 3 + TypeScript 模板，跳過互動選單直接建好
- --template vue-ts — 選 Vue 3 + TypeScript 模板，跳過互動選單直接建好

[面試題] 為什麼選 Vite 不選 Vue CLI？

- --template vue-ts — 選 Vue 3 + TypeScript 模板，跳過互動選單直接建好

[面試題] 為什麼選 Vite 不選 Vue CLI？
Vite 用原生 ES modules + esbuild，dev server 啟動幾乎秒開，HMR 也比 webpack 快很多。Vue CLI
已進入維護模式，新專案官方推薦 Vite。

第一行是 runtime 套件（上線後也需要）：

- element-plus — UI 元件庫
- pinia — Vue 3 官方狀態管理，取代 Vuex
- vue-router@4 — Vue 3 對應的路由版本（指定 @4，避免裝到 Vue 2 用的 v3）

第二行是 dev 套件（只有開發時用）：

- unplugin-vue-components + unplugin-auto-import — 讓 Element Plus 元件不用每個都 import，build time 自動處理
- @element-plus/icons-vue — Element Plus 的 icon 套件

[面試題] Pinia 跟 Vuex 差在哪？
Pinia 拿掉了 mutations，只剩 state / getters / actions，寫起來更像普通的 composable。TypeScript
支援是原生的，不需要額外設定。Vue 3 官方已正式推薦 Pinia。

- AutoImport — ref、computed、useRouter、defineStore 這些不用每個 .vue 都手動 import，build time 自動加
- Components + ElementPlusResolver — <el-button>、<el-input> 這些 Element Plus 元件不用 import，直接在
  template 用
- resolve.alias — 讓你可以用 @/ 代替 ../../.. 這種相對路徑

[面試題] @ alias 是什麼？
純粹是路徑別名，讓 import xxx from '@/stores/cart' 永遠指向 src/stores/cart，不管檔案在哪一層都不用數 ../。

這在做什麼：

- "strict": true — 開啟所有嚴格型別檢查（strictNullChecks、noImplicitAny 等），面試官最在意這個
- "baseUrl": "." + "paths" — 告訴 TypeScript @/ 指向 src/，讓 IDE 跳轉和型別推導都能找到正確路徑

[面試題] 為什麼要開 strict mode？
沒有 strict 的 TypeScript 其實漏洞很多，例如 null / undefined 不會報錯。strict mode
才能真正發揮型別系統的保護作用，也是公司 codebase 的標準配置。

這在做什麼：

- 把 fakestoreapi 回傳的資料結構全部用 interface 定義好
- CartItem 是「商品 + 數量」的組合，這是購物車的核心單位
- LoginPayload / AuthToken 對應登入的 request / response

[面試題] interface 跟 type 差在哪？
大部分情況可以互換。慣例上：物件結構用 interface（可被 extend、可 merge declaration）；union type、mapped
type、tuple 用 type。Vue 生態系普遍用 interface 定義資料模型。

axios.create({...}) — 建立一個獨立的 axios instance，設定 baseURL 和 timeout，不污染全域的 axios
設定。

Request interceptor：
每次發出 request 前，自動從 localStorage 拿 token，塞進 Authorization: Bearer xxx
header。元件不用自己處理，完全透明。

Response interceptor：
成功的話直接 pass through；失敗的話檢查是不是 401（未授權），是的話清掉 token
並強制跳回登入頁，這是業界標準的「自動登出」機制。

[面試題] 為什麼用 axios.create() 而不是直接用 axios？
axios.create() 建立獨立 instance，interceptor 只作用在這個 instance
上，不影響其他地方（例如第三方套件也用 axios 的情況）。可擴展性更好，也方便測試時 mock。

- defineStore('auth', () => {...}) — 這是 Setup Store 寫法（跟 Options Store 不同），用法跟 <script
  setup> 幾乎一樣，ref 是 state、computed 是 getters、function 是 actions
- localStorage.getItem(TOKEN_KEY) 放在 ref() 初始值 — 頁面重整後自動恢復登入狀態
- !!token.value — 把 string 或 null 轉成 boolean

[面試題] Pinia Setup Store 跟 Options Store 差在哪？
Options Store 用 state()/getters/actions 分開定義，結構清楚但比較囉唆。Setup Store 用 composable
風格，ref/computed/function 直接寫，和 Vue 3 <script setup> 風格一致，TypeScript
支援更好，也更容易複用 composable。

這在做什麼：

- loadCart() 在 store 初始化時從 localStorage 還原購物車，重整不會消失
- try/catch 包住 JSON.parse，避免 localStorage 裡有損毀資料時整個爆掉
- persist() 每次修改後都手動存回 localStorage，這是刻意不用第三方 plugin
  的寫法，面試時可以清楚解釋每一行在做什麼
- updateQuantity 裡，數量 <= 0 直接呼叫 removeItem，邏輯收在一處

[面試題] 為什麼不用 pinia-plugin-persistedstate？
Plugin 是黑盒子，面試官問你「怎麼做持久化」你只能說「裝了 plugin」。手動寫 persist()
雖然多幾行，但每一行你都能解釋，也能控制哪些 store 要存、哪些不要。

- loading / error 是 UI 狀態，元件根據這兩個值顯示 loading spinner 或錯誤訊息
- try/catch/finally — finally 確保不管成功或失敗，loading 一定會被關掉，不會卡在 loading 狀態
- fetchCategories 開頭判斷 if (categories.value.length) return — 簡單的
  cache，分類只需要抓一次，切換分類時不重複呼叫 API
- category? 用可選參數，有傳就打分類 API，沒傳就抓全部，一個 function 處理兩種情境

[面試題] 為什麼 error 要用 e instanceof Error ? e.message : '...'？
catch 拿到的 e 型別是 unknown（TypeScript strict mode 下），不能直接 .message。先判斷是不是 Error
instance，才能安全存取 message，這是 TS strict mode 的正確寫法。

- createWebHistory — 用 HTML5 History mode（URL 沒有 #），比 Hash mode 更乾淨，SEO 友好
- () => import('@/views/...') — 動態 import（lazy loading），每個頁面各自打包成獨立
  chunk，只有使用者進到那頁才載入，首頁載入速度更快
- scrollBehavior: () => ({ top: 0 }) — 每次換頁自動捲回頂部
- meta: { requiresAuth: true } — 在路由設定上標記「需要登入」
- router.beforeEach — navigation guard，進入每個頁面前執行，檢查需要登入的頁面，未登入就導向
  /login?redirect=原本要去的路徑，登入後可以自動跳回去

[面試題] 動態 import 跟一般 import 差在哪？
一般 import 在 build time 全部打包進同一個 JS 檔，首次載入就要下載全部。動態 import() 讓 Vite
自動做 code splitting，每個頁面是獨立 chunk，使用者只下載當前頁需要的程式碼，改善 LCP（Largest
Contentful Paint）。

src/assets/main.css 注意：Vite 預設的 style.css 不要用，我們用自己的）：
這是全域 CSS reset，確保所有瀏覽器 margin/padding 一致，box-sizing: border-box 讓寬度計算更直觀。

src/main.ts
順序很重要：createPinia() 要在 router 之前，因為 router 的 beforeEach 裡用了 Pinia store，Pinia
必須先初始化。

- cartStore.totalCount 直接從 Pinia 拿，badge 數字自動響應更新
- :hidden="cartStore.totalCount === 0" — 購物車是空的時候不顯示 badge
- v-if / v-else 根據登入狀態切換「登出按鈕」或「登入連結」
- router-link-active — Vue Router 自動加在當前頁的 <router-link> 上，我們直接用 CSS 給它藍色

[面試題] <style scoped> 的作用？
讓 CSS 只作用在這個元件內，Vue 會自動在 selector 加上 hash attribute（如
[data-v-xxxxxx]），不會污染其他元件的樣式。

- watch(selectedCategory, ...) — 監聽分類變化，切換時重置到第一頁再重新抓資料
- paginatedProducts — computed 做 client-side 分頁，slice 切出當前頁的資料
- v-loading="productStore.loading" — Element Plus 指令，loading 期間自動在區塊上顯示 spinner
- :deep(.el-radio-button\_\_inner) — SCSS 穿透 scoped，修改 Element Plus 內部元素的樣式，這是用
  scoped CSS 操作第三方元件的標準做法

[面試題] :deep() 是什麼？

<style scoped> 的 CSS 只作用在當前元件，但 Element Plus 元件的內部 DOM 不屬於你的元件，所以 scoped
CSS 打不到。:deep(.selector) 可以穿透這個限制，讓樣式套用到子元件內部。
