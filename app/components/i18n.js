// Simple i18n utility for runtime language switching

// Base English fallback: only include entries where the key is NOT the actual English text.
// This lets us skip a full "en" dictionary and use keys-as-English for simple labels.
const base = {
  'dev_notice_html': '<strong>Development Version</strong> - This application is under active development. Please report any issues on <a href="https://github.com/G1213123/TrafficSign" target="_blank">GitHub</a>.',
  'migration_notice_html': "We're moving from <strong>g1213123.info</strong> to <strong><a href=\"https://roadsignfactory.hk\" target=\"_blank\" class=\"migration-link\">roadsignfactory.hk</a></strong><br>Please update your bookmarks to ensure continued access to our services.",
  'Site Migration Notice': 'Site Migration Notice',
  'hero_subtitle_html': 'Create, customize, and export professional directional signs online. Built with Hong Kong <span class="tpdm-tooltip" data-tooltip="Transport Planning and Design Manual">TPDM</span> standards for precision and compliance.',
  'feature_destination_text': 'Choose destinations from a comprehensive list of common districts, or type in names with authentic fonts.',
  'feature_symbols_text': 'Access a comprehensive library of traffic symbols and glyphs. No hassle for drawing points and shapes.',
  'feature_vector_text': 'Create scalable signs using vector graphics that maintain quality at any size.',
  'feature_export_text': 'Export your designs as PNG, SVG, DXF, or PDF for professional use.',
  'feature_precision_text': 'Built-in measurement tools and grid system for accurate sign dimensions.',
  'feature_save_text': 'Automatic save to browser storage and manual save/load functionality to preserve your work.',
  'demo_click_hint': 'Click any button below to see the feature in action',
  // Homepage/nav (only non-trivial copies)
  'Changelog Intro Text': "Here you'll find detailed information about all the updates, new features, bug fixes, and improvements made to Road Sign Factory. Each entry includes a short summary of what's changed.",
  'Stay Updated Description': 'Want to be notified about new releases? Follow our development on GitHub or check back here regularly for the latest updates.',
  // About page body
  'About Intro Text': 'Road Sign Factory provides traffic engineers, designers, and enthusiasts with a standards-compliant tool for creating professional road signage. It is a web service built and served to meet the modern needs for generating quality designs.',
  'feature_comply_tpdm_html': 'Comply to Hong Kong <span class="tpdm-tooltip" data-tooltip="Transport Planning and Design Manual">TPDM</span>',
  'feature_export_quality': 'Professional Export Quality',
  'feature_no_install': 'No Installation Required',
  'feature_interactive_uiux_html': 'Interactive and Responsive <span class="tpdm-tooltip" data-tooltip="User Interface / User Experience">UI/UX</span>',
  'feature_cad_html': '<span class="tpdm-tooltip" data-tooltip="Computer Aided Design">CAD</span> Tool Grade Functionality',
  'feature_open_source': 'Open Source & Free',
  'feature_save_autosave': 'Save & Load with Auto-Save',
  'Timeline Intro Text': 'Traditionally, traffic signs are designed by professional engineers as a package of a roadworks project with <span class="tpdm-tooltip" data-tooltip="Computer Aided Design">CAD</span>. While <span class="tpdm-tooltip" data-tooltip="Computer Aided Design">CAD</span> is powerful in generating detailed drawings, characters and symbols must still be drawn carefully block by block, stroke by stroke. Sign making was like a renaissance of old technology <a href="https://en.wikipedia.org/wiki/Movable_type"> Movable Printing Press</a> in modern times. A need to speed up the design process within a tight project timeframe is called. This application is the result of seeking a modern and streamlined workflow for road sign design.',
  'Timeline Apr 2022 Desc': 'The original idea for Road Sign Factory was conceived as a solution for creating professional traffic signage with modern web technologies. The project was shelved after prototyping due to the technical difficulties encounter when prototyping.',
  'Timeline May 2024 Desc': 'Transport Department of HKSAR publicly released the Traffic Signs and Road Markings Manual (TPDM), providing comprehensive standards and guidelines that became the foundation for professional traffic sign design.',
  'Timeline Jan 2025 Desc': 'After a period of dormancy, the project was restarted with renewed focus and intensive development efforts to build the complete application.',
  'Timeline Feb 2025 Desc': 'The AI revolution transformed development workflows with advanced coding assistants, enabling rapid prototyping and intuitive "vibe-based" programming approaches that accelerated the project significantly.',
  'Timeline May 2025 Desc': 'The first public prototype was released, marking a major milestone with a functional traffic sign design tool available to users worldwide.',
  'Timeline Future Desc': 'Ongoing development with regular updates, new features, and improvements based on user feedback. See our <a href="changelog.html#upcoming">planned feature list</a>.',
  'Tech Info P1': 'Road Sign Factory is built using modern web technologies including HTML5 Canvas, JavaScript ES6+, and responsive CSS. The application uses the <a href="https://fabricjs.com/" target="_blank" rel="noopener noreferrer">Fabric.js</a> library for advanced canvas manipulation and supports vector graphics export through SVG generation.',
  'Tech Info P2': "The application features an intelligent save system that automatically stores your work in the browser's local storage, preventing data loss. Additionally, manual save and load functionality allows you to manage multiple projects and create backups of your designs.",
  'Tech Info P3': 'The export function supports multiple file formats including PNG (raster), SVG (vector), PDF (document), and DXF (CAD). PDF export is handled using the <a href="https://github.com/MrRio/jsPDF" target="_blank" rel="noopener noreferrer">jsPDF</a> library, which converts the canvas content to high-quality PDF documents suitable for printing and sharing. DXF export is powered by the <a href="https://github.com/tarikjabiri/js-dxf" target="_blank" rel="noopener noreferrer">dxf-writer</a> library, with the aids of <a href="http://paperjs.org/" target="_blank" rel="noopener noreferrer">paper.js</a> for path processing, enabling seamless integration with professional CAD software and engineering workflows.',
  
  // Posters page
  'Posters': 'Posters',
  'Featured Posters': 'Featured Posters',
  'Browse our collection of traffic signs posters.': 'Browse our collection of traffic signs posters.',
  'Central Kowloon Bypass Eastbound': 'Central Kowloon Bypass Eastbound',
  'A map of directional signs in Central Kowloon Bypass Eastbound.': 'A map of directional signs in Central Kowloon Bypass Eastbound.',
  'Central Kowloon Bypass Westbound': 'Central Kowloon Bypass Westbound',
  'A map of directional signs in Central Kowloon Bypass Westbound.': 'A map of directional signs in Central Kowloon Bypass Westbound.',
  'Download Full Size': 'Download Full Size',
  'Download': 'Download',
  'Diverge Sign': 'Diverge Sign',
  'Flag Sign': 'Flag Sign',
  'Gantry Sign': 'Gantry Sign',
  'Lane Sign': 'Lane Sign',
  'Roundabout Sign': 'Roundabout Sign',
  'Spiral Sign': 'Spiral Sign',
  'Stack Sign': 'Stack Sign',
  'Open Full App': 'Open Full App',
  'Footer Disclaimer 1': '© 2025 Road Sign Factory. Open source project.',
  'Footer Disclaimer 2': 'This application is under development and not affiliated with government authorities. Users are responsible for ensuring compliance with local regulations.',
  // Region labels (note: key has a typo kept for compatibility)
  'New Terriitories': 'New Territories',
  'CSDI Disclaimer Content': 'This website / product / service contains information that is copied or extracted from data made available by the Government of Hong Kong Special Administrative Region (the “Government”) at https://DATA.GOV.HK/ (“DATA.GOV.HK”). The provision of information copied or extracted from or a link to DATA.GOV.HK at this website or in relation to the product or service shall not constitute any form of co-operation or affiliation by the Government with any person in relation to this website, the product or the service or any contents herein. Nothing in this website, the product or the service shall give rise to any representation, warranty or implication that the Government agrees with, approves of, recommends or endorses any contents of this website or the product or the service. The Government does not have any liability, obligation or responsibility whatsoever for any loss, destruction or damage (including without limitation consequential loss, destruction or damage) howsoever arising from or in respect of your use or misuse of or reliance on or inability to use any contents herein.',
};

const dictionaries = {
  zh: {
  'dev_notice_html': '<strong>開發版本</strong>－本應用仍在積極開發中。如有問題，請到 <a href="https://github.com/G1213123/TrafficSign" target="_blank">GitHub</a> 回報。',
  'migration_notice_html': '本網站正從 <strong>g1213123.info</strong> 遷移至 <strong><a href="https://roadsignfactory.hk" target="_blank" class="migration-link">roadsignfactory.hk</a></strong><br>請更新你的書籤以持續存取服務。',
  'Site Migration Notice': '網站遷移通知',
  'hero_subtitle_html': '線上建立、客製與匯出專業方向指示標誌。採用香港運輸策劃及設計手冊標準。',
  'Flag Sign': '旗型標誌',
  'Gantry Sign': '門架標誌',
  'Lane Sign': '車道標誌',
  'Roundabout Sign': '迴旋處標誌',
  'Spiral Sign': '螺旋處標誌',
  'Spiral Roundabout Sign': '螺旋迴旋處標誌',
  'Stack Sign': '長型標誌',
  'Diverge Sign': '支路標誌',
  'Open Full App': '開啟完整應用',
  'Footer Disclaimer 1': '© 2025 Road Sign Factory．開源專案。',
  'Footer Disclaimer 2': '此應用仍在開發中，與政府機構無關；使用者需自行確保符合法規。',
    'feature_destination_text': '從常見地區清單中選擇目的地，或使用真實字型自行輸入。',
    'feature_symbols_text': '提供完整的交通符號與圖標庫，免去繪圖的麻煩。',
    'feature_vector_text': '使用可擴放向量圖，任何尺寸都能維持圖像品質。',
    'feature_export_text': '支援 PNG、SVG、DXF、PDF 等多種匯出格式。',
    'feature_precision_text': '內建量度工具與格線系統，尺寸控制更精準。',
    'feature_save_text': '支援瀏覽器自動儲存與手動儲存/載入，保障你的成果。',
    'demo_click_hint': '點擊下方任一按鈕以查看功能示範',
    'Snap prompt': '對齊提示',
    'Drag & Snap': '拖曳對齊',
    // Posters page
    'Posters': '海報',
    'Featured Posters': '精選海報',
    'Browse our collection of traffic signs posters.': '瀏覽我們的交通標誌海報系列。',
    'Central Kowloon Bypass Eastbound': '中九龍繞道東行',
    'A map of directional signs in Central Kowloon Bypass Eastbound.': '中九龍繞道東行的方向指示標誌地圖。',
    'Central Kowloon Bypass Westbound': '中九龍繞道西行',
    'A map of directional signs in Central Kowloon Bypass Westbound.': '中九龍繞道西行的方向指示標誌地圖。',
    'Download Full Size': '下載原始大小',
    'Download': '下載',
    // Homepage/nav
    'Home': '首頁',
    'Index': '目錄',
    'Sign Index': '標誌索引',
    'Add Text': '新增文字',
    'Getting Started': '快速開始',
    'About': '關於',
    'Changelog': '更新記錄',
    'GitHub': 'GitHub',
    'Launch App': '啟動應用程式',
    'Launch Application': '啟動應用程式',
    'Open Full App': '開啟完整應用',
    'Professional Directional Sign Design Tool': '專業方向指示標誌設計工具',
    'Current Build': '目前版本',
    'Sign Templates': '範例標誌',
    'Symbols': '符號',
    'Destination Names': '目的地名稱',
    'Web-Based': '網頁版',
    'Professional Design Features': '專業設計功能',
    'Comprehensive tools for creating standards-compliant traffic signs': '全面工具，打造合乎規範的交通標誌',
    'Destination Text': '目的地文字',
    'Symbol Library': '符號庫',
    'Vector Graphics': '向量圖形',
    'Multiple Export Formats': '多種匯出格式',
    'Precision Tools': '精準工具',
    'Save & Load': '儲存與載入',
    'See It In Action': '互動示範',
    'Interactive demonstration of key features': '互動示範關鍵功能',
    'Add Symbol': '新增符號',
    'Add Border': '新增邊框',
    'Reset': '重設',
    'Clear': '清除',
    'Undo': '復原',
    'Redo': '重做',
    'No history': '無記錄',
    'Example Signs Gallery': '範例標誌集',
    'Browse through various traffic sign examples': '瀏覽多款交通標誌範例',
    'Road Sign Factory': 'Road Sign Factory',
    'Quick Links': '快速連結',
    'Resources': '資源',
    'Support': '支持',
    'Launch Application - Free': '免費啟動應用程式',
    'About Road Sign Factory': '關於 Road Sign Factory',
    'Key features:': '主要功能：',
    'Development Timeline': '開發時間線',
    'Technical Information': '技術資訊',
    'View on GitHub': '在 GitHub 檢視',
    'Contact Us': '聯絡我們',
    'Release History': '版本歷史',
    'Changelog Intro Text': '在此可查看 Road Sign Factory 的所有更新、新功能、錯誤修正與改進摘要。只提供英文版本。',
    'Stay Updated': '持續關注',
    'Stay Updated Description': '想要接收新版本通知？請在 GitHub 追蹤我們，或不時回來查看最新消息。',
    'Follow on GitHub': '在 GitHub 追蹤',
    'Try the App': '試用應用程式',
    'Getting Started Guide': '快速開始指南',
    'Learn how to create professional traffic signs with our powerful design tool': '了解如何使用我們強大的設計工具製作專業交通標誌',
    'Welcome to Road Sign Factory': '歡迎使用 Road Sign Factory',
    'Follow our step-by-step tutorials to master traffic sign design': '依照逐步教學掌握交通標誌設計',
  // Getting Started page
  'Launch Application': '啟動應用程式',
  'Choose Template': '選擇範本',
  'Open the Road Sign Factory application and explore the intuitive side panel interface and grid canvas designed for precision and ease of use.': '開啟 Road Sign Factory，瀏覽側邊面板介面與格線畫布。',
  'Select from our comprehensive template library. Add text, routes, symbols, and shapes using our powerful editing tools.': '從完整的範本庫中選擇。使用強大的編輯工具加入文字、路線、符號與圖形。',
  'Snap & Lock Shape': '對齊與鎖定圖形',
  'Use precision controls and snapping features to position elements accurately. Lock shapes in place to prevent accidental movement during design.': '利用精準控制與對齊功能，準確定位各元素；鎖定圖形以避免設計過程中誤移。',
  'Frame with Border': '加入邊框',
  'Add professional borders with auto-calculated padding and styling. Choose from various border types to frame your content perfectly.': '加入專業邊框，系統自動計算留白與樣式，提供多種邊框類型讓內容更完美。',
  'Save Design': '儲存設計',
  'Save your design locally to browser storage for quick access, or export as JSON file format for backup and sharing with others.': '將設計儲存在瀏覽器本機空間以便快速存取，或匯出為 JSON 檔以利備份與分享。',
  'Export & Share': '匯出與分享',
  'Export your finished sign in common file formats (PNG, PDF, SVG, DXF) ready for professional printing, sharing, and installation.': '以常見格式（PNG、PDF、SVG、DXF）匯出完成的標誌，便於專業列印、分享與安裝。',
  'Example of Flag Sign': '旗型標誌範例',
  'Flag Sign Tutorial': '旗型標誌教學',
  'Flag Sign Example': '旗型標誌示例',
  'Example of Diverging Sign': '支路標誌範例',
  'Diverging Sign Tutorial': '支路標誌教學',
  'Diverging Sign Example': '支路標誌示例',
  'Example of Roundabout Sign': '迴旋處標誌範例',
  'Roundabout Sign Tutorial': '迴旋處標誌教學',
  'Roundabout Sign Example': '迴旋處標誌示例',
  'Your browser does not support the video tag.': '你的瀏覽器不支援 video 標籤。',
  'View JSON Template': '檢視 JSON 範本',
  'Show Code': '顯示代碼',
  'Hide Code': '隱藏代碼',
  'How to use:': '使用方式：',
  'Copy the JSON code below and paste it into the Road Sign Factory app using the Import function to load this example sign.': '複製下方 JSON 內容，於 Road Sign Factory 的匯入功能貼上即可載入此範例標誌。',
  'Copy All': '複製全部',
  'Copied!': '己複製',
  'Loading...': '正在載入…',
  'Ready to Create Your Own Signs?': '準備好建立專屬的標誌了嗎？',
  "You've seen the tutorials and examples - now it's time to put your knowledge into practice! Launch the application and start designing professional traffic signs.": '你已看過教學與示例—現在是實作的時候！啟動應用程式，開始設計專業交通標誌吧。',
  'Learn More': '瞭解更多',    // About page headers/buttons
    'About Road Sign Factory': '關於 Road Sign Factory',
    'Key features:': '主要功能：',
    'Development Timeline': '開發歷程',
    'Technical Information': '技術資訊',
    'View on GitHub': '在 GitHub 上查看',
    'Contact Us': '聯絡我們',
    // Changelog page
    'Release History': '版本歷史',
    'Stay Updated': '保持更新',
    'Upcoming Features': '即將推出的功能',
    'In Development': '開發中',
    'Future Improvements': '未來改進',
    "We're continuously working on improving Road Sign Factory. Here are some features and improvements we're considering for future releases.": '我們持續致力於改善 Road Sign Factory。以下是我們考慮在未來版本中加入的功能與改進。',
    'Planned Features': '規劃中的功能',
    'Language support for traditional Chinese': '繁體中文語言支援',
    'Hint for sign creation best practices': '標誌製作最佳實務提示',
    'Extended symbol and template libraries': '擴充符號與範本庫',
    'Export DXF function optimized for font character': '優化 DXF 匯出的字型字元',
    'Redo and Undo function optimization': '重做與復原功能優化',
    'Unit tests and integration tests': '單元測試與整合測試',
    'Documentation of codebase': '程式碼庫文件',
    'AI tools to assist with sign design': 'AI 輔助標誌設計工具',
    // Sign Index page
    'Index': '索引',
    'Browse, preview and download traffic signs and road markings graphics.': '瀏覽、預覽與下載交通標誌及道路標記圖檔。',
    'Data provided by': '資料來源：',
    'View terms of use': '查看使用條款',
    'Data Attribution & Terms of Use': '資料歸屬與使用條款',
    'Traffic signs and road marking data used in this index are provided by the Government of the Hong Kong Special Administrative Region via the Common Spatial Data Infrastructure (CSDI) Portal.': '本索引使用的交通標誌及道路標記資料由香港特別行政區政府透過空間數據共享平台 (CSDI Portal) 提供。',
    'The Government and relevant organisations are the owners of the intellectual property rights in the Data. You are allowed to browse, download, and use the Data provided you comply with the CSDI Portal Terms of Use. By using this data, you agree to indemnify the Government and relevant organisations against any allegations, claims of infringement, costs, losses, or damages arising directly or indirectly in relation to your use, reproduction, and/or distribution of the Data.': '政府及相關機構擁有該等數據的知識產權。只要遵守 CSDI Portal 使用條款，閣下即可瀏覽、下載及使用數據。使用此數據即表示閣下同意就因使用、複製及/或分發數據而直接或間接引起的任何指控、侵權索賠、成本、損失或損害，向政府及相關機構作出賠償。',
    // Posters page
    'Featured Posters': '精選海報',
    'Browse our collection of traffic signs posters.': '瀏覽我們精選的交通標誌海報系列。',
    'Central Kowloon Bypass Eastbound': '中九龍幹線東行',
    'A map of directional signs in Central Kowloon Bypass Eastbound.': '中九龍幹線東行方向指示標誌地圖。',
    'Central Kowloon Bypass Westbound': '中九龍幹線西行',
    'A map of directional signs in Central Kowloon Bypass Westbound.': '中九龍幹線西行方向指示標誌地圖。',
    'Download': '下載',
    'Download Original': '下載原圖',
    // About page body
    'About Intro Text': 'Road Sign Factory 為交通工程師、設計師與愛好者提供一套符合標準的專業交通標誌製作工具。這是一個以現代需求為目標而建置與提供的網頁服務，致力於生成高品質設計。',
    'feature_comply_tpdm_html': '符合香港 <span class="tpdm-tooltip" data-tooltip="運輸策劃及設計手冊">TPDM</span> 標準',
    'feature_export_quality': '專業級匯出品質',
    'feature_no_install': '免安裝即可使用',
    'feature_interactive_uiux_html': '互動式及回應式 <span class="tpdm-tooltip" data-tooltip="使用者介面/經驗">UI/UX</span>',
    'feature_cad_html': '<span class="tpdm-tooltip" data-tooltip="電腦輔助設計軟件">CAD</span> 等級的工具功能',
    'feature_open_source': '開源與免費',
    'feature_save_autosave': '支援儲存/載入與自動儲存',
    'Timeline Intro Text': '傳統上，交通標誌通常由專業工程師以 <span class="tpdm-tooltip" data-tooltip="電腦輔助設計軟件">CAD</span> 作為道路工程專案的一部分來設計。雖然 <span class="tpdm-tooltip" data-tooltip="電腦輔助設計軟件">CAD</span> 在產生細節圖面上非常強大，但字符與符號仍需逐一細緻描繪。某種程度上，標誌製作就如同古老技術——<a href="https://zh.wikipedia.org/zh-hk/%E6%B4%BB%E5%AD%97%E5%8D%B0%E5%88%B7%E6%9C%AF">活字印刷</a>——於現代重新應用一樣，複雜費時。為了在緊迫的工期內加速設計流程，本應用致力於探索更現代且順暢的工作流程。',
    'Initial Idea': '初步構想',
    'First Concept': '首個概念',
    'Timeline Apr 2022 Desc': 'Road Sign Factory 的原始理念是以現代網頁技術，提供專業交通標誌設計的解決方案。該專案在原型設計後，因技術挑戰而暫時擱置。',
    'TPDM Release': 'TPDM 發布',
    'HKSAR TPDM Public Release': '香港 TPDM 公開發布',
    'Timeline May 2024 Desc': '香港運輸署公開《運輸策劃及設計手冊（TPDM）》，提供完整的標準與指引，成為專業交通標誌設計的重要基礎。',
    'Restart': '重新啟動',
    'Project Revival & Development': '專案重啟與開發',
    'Timeline Jan 2025 Desc': '在擱置一段時期以後，專案重啟以注重新焦點及功能，並展開開發以建置完整應用。',
    'AI Boom': 'AI 熱潮',
    'AI-Powered Vibe Coding Era': 'AI 驅動的 Vibe Coding 時代',
    'Timeline Feb 2025 Desc': 'AI 革命改變了開發流程，透過先進的輔助工具加速原型製作與更直覺的「氛圍」程式設計，大幅推進專案。',
    'Public Prototype': '公開原型',
    'First Public Release': '首次公開版本',
    'Timeline May 2025 Desc': '首次公開原型發布，具備可用的交通標誌設計功能，為專案發展的重要里程碑。',
    'Future': '未來',
    'Ongoing': '持續進行',
    'Continuous Enhancement': '持續開發',
    'Timeline Future Desc': '持續開發，定期推出更新、新功能與改進，並根據使用者回饋調整。詳見<a href="changelog.html#upcoming">規劃功能清單</a>。',
    'Tech Info P1': '本專案以 HTML5 Canvas、JavaScript ES6+ 與 RWD CSS 等現代網頁技術打造。應用程式使用 <a href="https://fabricjs.com/" target="_blank" rel="noopener noreferrer">Fabric.js</a> 進行進階畫布操作，並支援以 SVG 產生向量輸出。',
    'Tech Info P2': '應用內建智慧型儲存系統，會自動將您的作品保存在瀏覽器的本機儲存空間，避免資料遺失；同時提供手動儲存/載入功能，方便管理多個專案與備份設計。',
    'Tech Info P3': '支援 PNG（點陣）、SVG（向量）、PDF（文件）與 DXF（CAD）等多種輸出格式。PDF 輸出使用 <a href="https://github.com/MrRio/jsPDF" target="_blank" rel="noopener noreferrer">jsPDF</a> 將畫布內容轉為高品質 PDF；DXF 輸出採用 <a href="https://github.com/tarikjabiri/js-dxf" target="_blank" rel="noopener noreferrer">dxf-writer</a>，並輔以 <a href="http://paperjs.org/" target="_blank" rel="noopener noreferrer">paper.js</a> 進行圖形路徑處理，與專業 CAD 軟體與工程流程無縫整合。',
    // Footer/common
    'Professional traffic sign design tool for modern web browsers.': '專為現代瀏覽器打造的專業交通標誌設計工具。',
    'HK TPDM Guidelines': '香港 TPDM 指南',
    'UK Traffic Signs Manual': '英國交通標誌手冊',
    'Help support this project:': '支持此專案：',

    // Sign Gallery
    'Traffic Signs': '交通標誌',
    'Traffic Sign': '交通標誌',
    'Road Marking': '道路標記',
    'Search...': '搜尋...',
    'Go to #': '跳至編號',
    'Go': '前往',
    'Size:': '大小：',
    'Shuffle 🔀': '隨機 🔀',
    'Categories': '分類',
    'Others': '其他',
    'Description': '說明',
    'Reference No.': '參考編號',
    'Disclaimer': '免責聲明',
    'CSDI Disclaimer Content': '本網站/產品/服務載有由香港特別行政區政府（下稱「政府」）在 https://DATA.GOV.HK/ （下稱「DATA.GOV.HK」）提供的數據複製或提取的資料。在本網站或產品或服務內提供從 DATA.GOV.HK 複製或提取的資料或連結到 DATA.GOV.HK，並不構成政府與任何人士就本網站、產品或服務或其中任何內容有任何形式的合作或聯繫。本網站、產品或服務中的任何內容均不構成政府同意、批准、推薦或認可本網站、產品或服務的任何內容的申述、保證或暗示。政府不對任何因使用或未能使用本網站內容而引致的損失、破壞或損害（包括但不限於相應而生的損失、破壞或損害）承擔任何法律責任、義務或責任。',
  },
};

let currentLocale = 'en';

const i18n = {
  t(key) {
    if (!key) return '';
    const dict = dictionaries[currentLocale] || {};
    // Prefer current locale, then base (English), then the key itself
    return dict[key] || base[key] || key;
  },
  setLocale(locale) {
    // Allow 'en' even without a dictionary (it will use base/keys)
    if (locale === 'en' || (locale && dictionaries[locale])) {
      currentLocale = locale;
    } else {
      currentLocale = 'en';
    }
  },
  getLocale() {
    return currentLocale;
  },
  applyTranslations(root = document) {
    if (!root) return;
    // Text content
    root.querySelectorAll('[data-i18n]')?.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = i18n.t(key);
    });
    // HTML content
    root.querySelectorAll('[data-i18n-html]')?.forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (key) el.innerHTML = i18n.t(key);
    });
    // Placeholders
    root.querySelectorAll('[data-i18n-placeholder]')?.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.setAttribute('placeholder', i18n.t(key));
    });
    // Tooltips (data-tooltip and title)
    root.querySelectorAll('[data-i18n-tooltip]')?.forEach(el => {
      const key = el.getAttribute('data-i18n-tooltip');
      if (key) {
        const val = i18n.t(key);
        el.setAttribute('data-tooltip', val);
        el.setAttribute('title', val);
      }
    });
  }
};

export { i18n };

// Also expose globally for inline scripts that cannot import modules
if (typeof window !== 'undefined') {
  window.i18n = i18n;
}
