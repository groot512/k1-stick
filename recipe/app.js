(function () {
  'use strict';

  const API_URL = 'https://k1-api.onrender.com';
  const IMPORTED_KEY = 'k1_unified_imported_recipes_v1';
  const LIKES_KEY = 'k1_unified_likes_v1';
  const COMMENTS_KEY = 'k1_unified_comments_v1';

  /* ========================================================================
     1. 4-Language UI Dictionary (synced with landing via localStorage k1Lang)
     ======================================================================== */
  const LANGS = {
    ko: { flag: '🇰🇷', name: '한국어', html: 'ko' },
    en: { flag: '🇺🇸', name: 'English', html: 'en' },
    ja: { flag: '🇯🇵', name: '日本語', html: 'ja' },
    zh: { flag: '🇨🇳', name: '中文', html: 'zh-CN' }
  };

  const UI = {
    ko: {
      'nav.feed': 'K1 레시피',
      'nav.import': '+ 유튜브 가져오기',
      'nav.brand': 'K1 브랜드 홈',
      'hero.kicker': 'UNIFIED K1 RECIPE WEB · QR + YOUTUBE',
      'hero.title': '패키지 QR 3분 레시피부터<br>유튜브 레시피 추출까지 한 곳에서',
      'hero.sub': '앱 설치 없이 01 불고기 · 02 떡볶이 · 03 김치찌개 공식 레시피와 현지 대체 식재료를 확인하고, 좋아하는 유튜브 한식 영상도 K1 스틱에 맞춰 저장하세요.',
      'hero.ctaTitle': '좋아하는 유튜브 한식 영상이 있나요?',
      'hero.ctaSub': '링크만 붙여넣으면 재료·타임스탬프를 추출하고 어울리는 K1 스틱을 자동 매칭해 드립니다.',
      'hero.ctaBtn': '+ 유튜브 레시피 가져오기',
      'filter.all': '전체',
      'filter.core': '핵심 3종 (QR 공식)',
      'filter.phase2': 'Phase 2 확장',
      'filter.yt': '유튜브 가져옴',
      'search.ph': '요리명·스틱 검색...',
      'badge.core': 'QR 공식 핵심 3종',
      'badge.phase2': 'Phase 2 예정',
      'badge.yt': '유튜브 추출 · K1 매칭',
      'meta.min': '분',
      'meta.servings': '인분',
      'detail.back': '← 레시피 목록으로',
      'detail.tabIng': '재료 체크',
      'detail.tabSteps': '조리 순서',
      'detail.tabSubs': '현지 대체재료',
      'detail.tabTips': '요리 팁',
      'detail.matchTitle': '이 요리에 딱 맞는 K1 스틱',
      'detail.matchBtn': '6개입 샘플러 사전예약 →',
      'detail.like': '좋아요',
      'detail.comments': '요리 후기',
      'detail.commentPh': '요리 후기나 팁을 남겨보세요...',
      'detail.post': '등록',
      'import.kicker': 'INTEGRATED YOUTUBE RECIPE EXTRACTOR',
      'import.title': '유튜브 레시피 가져오기 + K1 스틱 자동 매칭',
      'import.sub': '유튜브 링크를 넣으면 재료·조리 순서·타임스탬프를 자동 추출하고, 어울리는 K1 스틱소스를 추천해 통합 레시피 피드에 바로 저장합니다.',
      'import.ph': '유튜브 링크를 붙여넣으세요 (예: https://youtu.be/...)',
      'import.btn': '추출 + 매칭',
      'import.samples': '바로 체험하기:',
      'import.save': 'K1 레시피 피드에 저장하고 열기',
      'import.savedOk': '내 K1 레시피 피드에 저장되었습니다!',
      'import.loading': '유튜브 자막 분석 및 K1 스틱 매칭 중...',
      'import.fallbackNote': '실시간 분석 서버(Render)가 대기 상태여서 즉시 시연용 추출 모드로 결과를 구성했습니다.',
      'import.liveNote': '실시간 API 추출 완료! 어울리는 K1 스틱이 자동 매칭되었습니다.',
      'empty': '조건에 맞는 레시피가 없습니다.'
    },
    en: {
      'nav.feed': 'K1 Recipes',
      'nav.import': '+ Import YouTube',
      'nav.brand': 'K1 Brand Home',
      'hero.kicker': 'UNIFIED K1 RECIPE WEB · QR + YOUTUBE',
      'hero.title': 'Official 3-Min QR Recipes &<br>YouTube Extractor in One Place',
      'hero.sub': 'Explore 01 Bulgogi, 02 Tteokbokki, and 03 Kimchi Stew with local supermarket swaps—or import any YouTube Korean recipe with automatic K1 stick matching.',
      'hero.ctaTitle': 'Have a favorite Korean YouTube recipe?',
      'hero.ctaSub': 'Paste a link to extract ingredients, clickable timestamps, and auto-match a K1 stick.',
      'hero.ctaBtn': '+ Import YouTube Recipe',
      'filter.all': 'All',
      'filter.core': 'Core 3 (QR Official)',
      'filter.phase2': 'Phase 2',
      'filter.yt': 'From YouTube',
      'search.ph': 'Search recipes or sticks...',
      'badge.core': 'QR Official Core 3',
      'badge.phase2': 'Phase 2 Roadmap',
      'badge.yt': 'YouTube · K1 Matched',
      'meta.min': 'min',
      'meta.servings': 'servings',
      'detail.back': '← Back to Recipes',
      'detail.tabIng': 'Ingredients',
      'detail.tabSteps': 'Steps',
      'detail.tabSubs': 'Local Swaps',
      'detail.tabTips': 'Tips',
      'detail.matchTitle': 'Matched K1 Stick for This Dish',
      'detail.matchBtn': 'Reserve 6-Stick Sampler →',
      'detail.like': 'Like',
      'detail.comments': 'Cooking Notes',
      'detail.commentPh': 'Share a cooking note or swap tip...',
      'detail.post': 'Post',
      'import.kicker': 'INTEGRATED YOUTUBE RECIPE EXTRACTOR',
      'import.title': 'Import YouTube Recipe + Auto-Match K1 Stick',
      'import.sub': 'Paste any YouTube URL to extract ingredients & timestamped steps, automatically match the right K1 Stick Sauce, and save it straight into your unified feed.',
      'import.ph': 'Paste a YouTube link (e.g., https://youtu.be/...)',
      'import.btn': 'Extract & Match',
      'import.samples': 'Try 1-click demo:',
      'import.save': 'Save to K1 Recipe Feed & Open',
      'import.savedOk': 'Saved to your unified K1 Recipe feed!',
      'import.loading': 'Analyzing transcript & matching K1 Stick Sauce...',
      'import.fallbackNote': 'Live API server is waking up — displaying instant demo extraction with K1 stick matching.',
      'import.liveNote': 'Live extraction complete! Matched with the best K1 Stick Sauce.',
      'empty': 'No matching recipes found.'
    },
    ja: {
      'nav.feed': 'K1レシピ',
      'nav.import': '+ YouTube取込',
      'nav.brand': 'K1ブランドホーム',
      'hero.kicker': 'UNIFIED K1 RECIPE WEB · QR + YOUTUBE',
      'hero.title': '公式QR 3分レシピも<br>YouTubeレシピ抽出もひとつに',
      'hero.sub': '01プルコギ・02トッポッキ・03キムチチゲの公式レシピと現地代替食材に加え、好みのYouTube動画もK1スティックに紐づけて保存できます。',
      'hero.ctaTitle': 'お気に入りのYouTube韓国料理動画がありますか？',
      'hero.ctaSub': 'URLを貼るだけで材料・タイムスタンプを抽出し、最適なK1スティックを提案します。',
      'hero.ctaBtn': '+ YouTubeレシピを取り込む',
      'filter.all': 'すべて',
      'filter.core': '厳選3種 (QR公式)',
      'filter.phase2': 'Phase 2',
      'filter.yt': 'YouTube取込',
      'search.ph': 'レシピ・スティック検索...',
      'badge.core': 'QR公式 厳選3種',
      'badge.phase2': 'Phase 2 予定',
      'badge.yt': 'YouTube抽出・K1一致',
      'meta.min': '分',
      'meta.servings': '人前',
      'detail.back': '← レシピ一覧へ',
      'detail.tabIng': '材料チェック',
      'detail.tabSteps': '作り方',
      'detail.tabSubs': '現地代替食材',
      'detail.tabTips': 'コツ',
      'detail.matchTitle': 'この料理に最適なK1スティック',
      'detail.matchBtn': '6本サンプラー先行予約 →',
      'detail.like': 'いいね',
      'detail.comments': 'みんなのレビュー',
      'detail.commentPh': '作った感想をシェア...',
      'detail.post': '投稿',
      'import.kicker': 'INTEGRATED YOUTUBE RECIPE EXTRACTOR',
      'import.title': 'YouTubeレシピ取込＋K1スティック自動提案',
      'import.sub': 'YouTubeリンクから材料と手順を自動抽出し、最適なK1スティックをマッチングしてフィードへ保存します。',
      'import.ph': 'YouTubeリンクを貼り付け...',
      'import.btn': '抽出・マッチ',
      'import.samples': 'ワンクリック体験:',
      'import.save': 'K1レシピフィードに保存して開く',
      'import.savedOk': 'K1レシピフィードに保存しました！',
      'import.loading': '字幕を解析してK1スティックをマッチング中...',
      'import.fallbackNote': 'APIサーバー待機中のため、即時デモ抽出モードで表示しています。',
      'import.liveNote': 'リアルタイム抽出完了！最適なK1スティックを提案しました。',
      'empty': '該当するレシピが見つかりません。'
    },
    zh: {
      'nav.feed': 'K1食谱',
      'nav.import': '+ 导入YouTube',
      'nav.brand': 'K1品牌主页',
      'hero.kicker': 'UNIFIED K1 RECIPE WEB · QR + YOUTUBE',
      'hero.title': '官方QR 3分钟食谱与<br>YouTube提取全面整合',
      'hero.sub': '免装App查看01烤肉·02辣炒年糕·03泡菜汤公式与当地替代食材，也能直接粘贴YouTube视频链接自动匹配K1条装并保存。',
      'hero.ctaTitle': '想用K1复刻喜欢的YouTube韩餐视频？',
      'hero.ctaSub': '粘贴链接即可提取材料与时间轴步骤，自动匹配最合适的K1条装酱料。',
      'hero.ctaBtn': '+ 导入YouTube食谱',
      'filter.all': '全部',
      'filter.core': '核心3款 (QR官方)',
      'filter.phase2': 'Phase 2',
      'filter.yt': 'YouTube导入',
      'search.ph': '搜索食谱或酱料...',
      'badge.core': 'QR官方 核心3款',
      'badge.phase2': 'Phase 2 计划',
      'badge.yt': 'YouTube提取·K1匹配',
      'meta.min': '分钟',
      'meta.servings': '人份',
      'detail.back': '← 返回食谱列表',
      'detail.tabIng': '食材清单',
      'detail.tabSteps': '烹饪步骤',
      'detail.tabSubs': '当地替代',
      'detail.tabTips': '小贴士',
      'detail.matchTitle': '本菜品匹配的K1条装',
      'detail.matchBtn': '预订6条尝鲜盒 →',
      'detail.like': '点赞',
      'detail.comments': '料理笔记',
      'detail.commentPh': '分享你的制作心得...',
      'detail.post': '发布',
      'import.kicker': 'INTEGRATED YOUTUBE RECIPE EXTRACTOR',
      'import.title': '导入YouTube食谱 + K1条装自动匹配',
      'import.sub': '输入YouTube链接自动提取材料与时间轴，智能推荐K1条装酱料并一键保存至食谱列表。',
      'import.ph': '粘贴YouTube视频链接...',
      'import.btn': '提取并匹配',
      'import.samples': '一键体验示例:',
      'import.save': '保存到K1食谱列表并打开',
      'import.savedOk': '已保存至您的K1食谱列表！',
      'import.loading': '正在分析字幕并匹配K1条装酱料...',
      'import.fallbackNote': '在线分析服务休眠中，已切换即时演示提取模式展示完整流程。',
      'import.liveNote': '实时提取完成！已为您自动匹配K1条装酱料。',
      'empty': '没有找到匹配的食谱。'
    }
  };

  let lang = localStorage.getItem('k1Lang');
  if (!LANGS[lang]) lang = (navigator.language || '').toLowerCase().startsWith('ko') ? 'ko' : 'en';
  const t = k => (UI[lang] && UI[lang][k]) || UI.ko[k] || k;
  const pick = obj => (typeof obj === 'string' ? obj : (obj && (obj[lang] || obj.ko || obj.en)) || '');

  /* ========================================================================
     2. K1 Stick Catalog (for Auto-Matching YouTube Recipes!)
     ======================================================================== */
  const STICKS = {
    bulgogi: {
      key: 'bulgogi',
      num: '01',
      color: '#68351f',
      frontImg: '../assets/packaging/k1-bulgogi-front.png',
      name: { ko: 'K1 01 불고기 베이스', en: 'K1 01 Bulgogi Base', ja: 'K1 01 プルコギベース', zh: 'K1 01 烤肉底料' },
      pitch: { ko: '간장·설탕·다진마늘 계량 없이 스틱 1포(12g)로 3분 완성', en: 'Replace soy, sugar & garlic prep with 1 measured 12g stick', ja: '醤油・砂糖の計量不要で1本(12g)で完成', zh: '无需称量酱油蒜末，1条12g搞定' }
    },
    tteokbokki: {
      key: 'tteokbokki',
      num: '02',
      color: '#ae2d18',
      frontImg: '../assets/packaging/k1-tteokbokki-front.png',
      name: { ko: 'K1 02 떡볶이 베이스', en: 'K1 02 Tteokbokki Base', ja: 'K1 02 トッポッキベース', zh: 'K1 02 辣炒年糕底料' },
      pitch: { ko: '고추장·고춧가루·물엿 배합 없이 스틱 1포(15g)로 분식집 맛 구현', en: 'Skip gochujang & syrup measuring—1 stick gives glossy street sauce', ja: 'コチュジャン配合不要で屋台の味を1本で再現', zh: '免调辣酱糖浆，1条还原街头甜辣汁' }
    },
    kimchi: {
      key: 'kimchi',
      num: '03',
      color: '#722039',
      frontImg: '../assets/packaging/k1-kimchi-front.png',
      name: { ko: 'K1 03 김치찌개 베이스', en: 'K1 03 Kimchi Stew Base', ja: 'K1 03 キムチチゲベース', zh: 'K1 03 泡菜汤底料' },
      pitch: { ko: '육수·새우젓·고춧가루 없이 스틱 1포(12g)로 깊은 찌개 완성', en: 'Deep stew broth in 1 stick—no anchovy stock or salted shrimp needed', ja: '出汁やアミ塩辛なしで深いチゲを1本で完成', zh: '无需高汤虾酱，1条煮出浓郁泡菜汤' }
    }
  };

  function matchStickFromText(text) {
    const s = (text || '').toLowerCase();
    if (/떡볶이|tteok|고추장|어묵|라볶이|spicy rice cake|トッポッキ|年糕/.test(s)) return STICKS.tteokbokki;
    if (/김치|kimchi|찌개|두부|부대|jjigae|stew|キムチ|泡菜/.test(s)) return STICKS.kimchi;
    return STICKS.bulgogi;
  }

  /* ========================================================================
     3. Official Core 3 QR Recipes (Matching Printed Packaging QR URLs 100%!)
        + Phase 2 Preview Recipes
     ======================================================================== */
  const BUILTIN_RECIPES = [
    {
      id: 'bulgogi-dupbap',
      tier: 'core',
      stickKey: 'bulgogi',
      youtubeId: 'bIRnM6s4GNo',
      cookTime: 3,
      servings: 2,
      img: '../assets/images/dish-bulgogi.jpg',
      title: { ko: '01 불고기 덮밥 (3분 컷)', en: '01 Savory Bulgogi Rice Bowl (3-Min)', ja: '01 プルコギ丼（3分）', zh: '01 烤肉盖饭（3分钟）' },
      desc: { ko: 'K1 01 불고기 스틱 1포로 달콤 짭짤한 간장 감칠맛을 완성하는 초간단 덮밥입니다.', en: 'Sweet-savory Korean bulgogi over warm rice in 3 minutes using one K1 01 Bulgogi stick.', ja: 'K1 01プルコギスティック1本で作る甘辛プルコギ丼。', zh: '用1条K1 01烤肉底料3分钟完成的咸甜烤肉盖饭。' },
      ingredients: {
        ko: ['K1 01 불고기 베이스 스틱 1포 (12g)', '얇은 소고기 (또는 닭고기·대체육) 200g', '양파 ½개', '물 2큰술', '따뜻한 밥 2공기', '통깨·쪽파 약간 (선택)'],
        en: ['1 K1 01 Bulgogi Base stick (12g)', '200g shaved beef (or chicken / plant strips)', '½ yellow onion, sliced', '2 tbsp water', '2 bowls warm steamed rice', 'Toasted sesame & scallions (optional)'],
        ja: ['K1 01プルコギスティック 1本 (12g)', '薄切り牛肉（または鶏肉・大豆ミート）200g', '玉ねぎ ½個', '水 大さじ2', 'ご飯 2杯', 'ごま・ネギ 少々'],
        zh: ['K1 01烤肉底料 1条 (12g)', '牛肉薄片（或鸡肉/植物肉）200g', '洋葱 半个', '水 2汤匙', '热米饭 2碗', '熟芝麻与葱花 少许']
      },
      steps: [
        { ts: '0:15', text: { ko: '달군 팬에 기름을 살짝 두르고 고기와 채 썬 양파를 센 불에서 1분간 볶습니다.', en: 'Sear sliced meat and onions in a lightly oiled hot skillet for 1 minute.', ja: '熱したフライパンで肉と玉ねぎを強火で1分炒めます。', zh: '热锅少油大火翻炒肉片与洋葱1分钟。' } },
        { ts: '0:55', text: { ko: 'K1 01 불고기 스틱 1포와 물 2큰술을 톡! 넣고 소스가 고루 배도록 2분간 볶습니다.', en: 'Tear in 1 K1 01 Bulgogi stick with 2 tbsp water and toss for 2 minutes until glazed.', ja: 'K1 01プルコギ1本と水大さじ2を加えて2分絡めます。', zh: '倒入1条K1 01烤肉底料与2勺水翻炒2分钟收汁。' } },
        { ts: '1:45', text: { ko: '따뜻한 밥 위에 올리고 통깨와 대파를 뿌리면 3분 불고기 덮밥 완성!', en: 'Spoon over steamed rice, finish with sesame seeds, and enjoy!', ja: 'ご飯にのせてごまを振れば完成！', zh: '盖在热米饭上撒上芝麻即可开吃！' } }
      ],
      subs: {
        ko: [{ k: '불고기용 소고기', l: 'Shaved Beef / Chicken / Tofu Strips' }, { k: '양파·당근', l: 'Yellow Onion · Mushrooms · Bell Pepper' }, { k: '참기름', l: 'Toasted Sesame Oil or Neutral Oil' }],
        en: [{ k: 'Bulgogi Ribeye', l: 'Shaved Beef, Chicken, or Plant Strips' }, { k: 'Carrot & Pear', l: 'Yellow Onion & Sliced Mushrooms' }, { k: 'Sesame Oil', l: 'Toasted Sesame or Olive Oil' }],
        ja: [{ k: 'プルコギ牛肉', l: '牛こま・豚バラ・鶏もも' }, { k: '野菜', l: '玉ねぎ・きのこ・ピーマン' }, { k: 'ごま油', l: 'ごま油またはサラダ油' }],
        zh: [{ k: '烤肉牛肉片', l: '肥牛卷 / 鸡胸肉 / 豆干丝' }, { k: '配菜', l: '洋葱 / 蘑菇 / 彩椒' }, { k: '香油', l: '芝麻油或食用油' }]
      },
      likes: 71,
      comments: [
        { user: 'Mike', flag: '🇬🇧', text: 'Used supermarket shaved beef + onion and it tasted just like Seoul!' },
        { user: '지민', flag: '🇰🇷', text: '자취방에 간장 설탕 없어도 스틱 하나로 끝나요.' }
      ]
    },
    {
      id: 'tteokbokki',
      tier: 'core',
      stickKey: 'tteokbokki',
      youtubeId: 'mVzTaFTKKfQ',
      cookTime: 3,
      servings: 2,
      img: '../assets/images/dish-tteokbokki.jpg',
      title: { ko: '02 국물 떡볶이 정석 (3분 컷)', en: '02 Classic Soupy Tteokbokki (3-Min)', ja: '02 定番スープトッポッキ（3分）', zh: '02 经典汤汁辣炒年糕（3分钟）' },
      desc: { ko: 'K1 02 떡볶이 스틱 1포로 매콤달콤 분식집 국물 떡볶이를 완성합니다. 해외에서는 감자 뇨끼로 대체 가능!', en: 'Glossy sweet-spicy street-style tteokbokki in 3 minutes. Swap rice cakes with potato gnocchi anywhere abroad!', ja: 'K1 02トッポッキ1本で屋台の甘辛スープ味を再現。ニョッキ代替もOK！', zh: '1条K1 02辣炒年糕底料还原街头甜辣味，海外可用土豆疙瘩替代！' },
      ingredients: {
        ko: ['K1 02 떡볶이 베이스 스틱 1포 (15g)', '물 350ml', '떡볶이 떡 250g (또는 감자 뇨끼)', '어묵·삶은 달걀 (선택)', '대파 약간'],
        en: ['1 K1 02 Tteokbokki Base stick (15g)', '350ml water', '250g rice cakes (or potato gnocchi)', 'Fish cake or boiled egg (optional)', 'Sliced scallions'],
        ja: ['K1 02トッポッキスティック 1本 (15g)', '水 350ml', 'トック 250g（またはニョッキ）', 'おでん・ゆで卵（任意）', '長ネギ'],
        zh: ['K1 02辣炒年糕底料 1条 (15g)', '水 350ml', '年糕 250g（或土豆疙瘩Gnocchi）', '鱼饼/水煮蛋（可选）', '葱花']
      },
      steps: [
        { ts: '0:20', text: { ko: '팬에 물 350ml를 붓고 K1 02 떡볶이 스틱 1포를 풀어 끓입니다.', en: 'Bring 350ml water to a boil and stir in 1 K1 02 Tteokbokki stick.', ja: '水350mlにK1 02トッポッキ1本を溶かして沸かします。', zh: '锅中加350ml水与1条K1 02辣炒年糕底料煮沸。' } },
        { ts: '1:05', text: { ko: '말랑한 떡(또는 뇨끼)과 어묵·삶은 달걀을 넣고 중불에서 3분간 졸입니다.', en: 'Add soft rice cakes (or gnocchi) and toppings; simmer 3 minutes until glossy.', ja: 'トック（またはニョッキ）と具材を加え中火で3分煮詰めます。', zh: '加入年糕（或土豆疙瘩）与配料中火煮3分钟收汁。' } },
        { ts: '2:10', text: { ko: '대파와 깨를 올려 마무리하면 매콤달콤 국물 떡볶이 완성!', en: 'Top with scallions and sesame seeds—serve bubbling hot!', ja: '長ネギとごまを添えて完成！', zh: '撒上葱花芝麻即可享用！' } }
      ],
      subs: {
        ko: [{ k: '떡볶이 떡', l: 'Potato Gnocchi (이탈리아 감자 뇨끼)' }, { k: '어묵', l: 'Boiled Egg / Cabbage / Mozzarella' }, { k: '대파', l: 'Green Onion / Chives' }],
        en: [{ k: 'Korean Rice Cakes', l: 'Supermarket Potato Gnocchi' }, { k: 'Fish Cake', l: 'Boiled Egg, Cabbage, or Mozzarella' }, { k: 'Korean Scallion', l: 'Green Onion or Chives' }],
        ja: [{ k: 'トッポッキ餅', l: '切り餅・じゃがいもニョッキ' }, { k: '韓国おでん', l: 'さつま揚げ・ゆで卵・チーズ' }, { k: '長ネギ', l: '青ネギ' }],
        zh: [{ k: '韩式年糕条', l: '切片年糕 / 意式土豆疙瘩' }, { k: '韩国鱼饼', l: '水煮蛋 / 包菜 / 芝士片' }, { k: '大葱', l: '小葱' }]
      },
      likes: 112,
      comments: [
        { user: 'Emma', flag: '🇫🇷', text: 'Tried this with potato gnocchi in Paris — unbelievable texture and spice!' }
      ]
    },
    {
      id: 'kimchi-jjigae',
      tier: 'core',
      stickKey: 'kimchi',
      youtubeId: 'T6sHn-MGRzY',
      cookTime: 3,
      servings: 2,
      img: '../assets/images/dish-kimchi.jpg',
      title: { ko: '03 매콤 김치찌개 (3분 컷)', en: '03 Spicy Kimchi Stew (3-Min)', ja: '03 旨辛キムチチゲ（3分）', zh: '03 香辣泡菜汤（3分钟）' },
      desc: { ko: 'K1 03 김치찌개 스틱 1포와 물·두부·대파만으로 서울 집밥 같은 칼칼한 김치찌개를 완성합니다.', en: 'Deep homestyle kimchi stew in 3 minutes with just water, tofu, scallions, and 1 K1 03 Kimchi stick.', ja: 'K1 03キムチチゲ1本と豆腐・ネギだけで本場の味を3分で完成。', zh: '只需1条K1 03泡菜汤底料、豆腐与葱花，3分钟煮出首尔家常味。' },
      ingredients: {
        ko: ['K1 03 김치찌개 베이스 스틱 1포 (12g)', '물 400ml', '두부 ½모', '대파 1대', '김치 100g 또는 돼지고기 (선택)'],
        en: ['1 K1 03 Kimchi Stew Base stick (12g)', '400ml water', '½ block firm tofu', '1 scallion', '100g kimchi or pork (optional)'],
        ja: ['K1 03キムチチゲスティック 1本 (12g)', '水 400ml', '豆腐 ½丁', '長ネギ 1本', 'キムチ100gまたは豚肉（任意）'],
        zh: ['K1 03泡菜汤底料 1条 (12g)', '水 400ml', '豆腐 半块', '大葱 1根', '泡菜100g或猪肉（可选）']
      },
      steps: [
        { ts: '0:12', text: { ko: '냄비에 물 400ml를 붓고 K1 03 김치찌개 스틱 1포를 풀어 끓입니다.', en: 'Pour 400ml water into a pot and dissolve 1 K1 03 Kimchi Stew stick.', ja: '鍋に水400mlとK1 03キムチチゲ1本を入れて沸かします。', zh: '锅中加400ml水倒入1条K1 03泡菜汤底料煮开。' } },
        { ts: '0:50', text: { ko: '깍뚝 썬 두부와 어슷 썬 대파(취향에 따라 김치·돼지고기)를 넣습니다.', en: 'Add cubed tofu and sliced scallions (plus kimchi or pork if desired).', ja: 'さいの目の豆腐と長ネギを加えます。', zh: '加入豆腐块与葱段（可选加泡菜或猪肉）。' } },
        { ts: '1:50', text: { ko: '중강불에서 3분간 바글바글 끓이면 정통 김치찌개 완성!', en: 'Simmer 3 minutes over medium-high heat and enjoy with rice!', ja: '中強火で3分煮込めば完成！', zh: '中大火煮3分钟即可配米饭享用！' } }
      ],
      subs: {
        ko: [{ k: '대파', l: 'Scallion / Leek' }, { k: '찌개용 두부', l: 'Firm Tofu / Canned Chickpeas' }, { k: '잘 익은 김치', l: '배추 + 식초 ½스푼 또는 마트 김치' }],
        en: [{ k: 'Korean Green Onion', l: 'Scallion or Leek' }, { k: 'Stew Tofu', l: 'Firm Tofu (any market)' }, { k: 'Aged Kimchi (opt.)', l: 'Napa Cabbage + ½ tbsp vinegar' }],
        ja: [{ k: '韓国長ネギ', l: '白ネギ・青ネギ' }, { k: 'チゲ用豆腐', l: '木綿・絹ごし豆腐' }, { k: '熟成キムチ', l: '市販キムチ・白菜＋酢' }],
        zh: [{ k: '韩国大葱', l: '小葱 / 京葱' }, { k: '嫩豆腐', l: '超市盒装豆腐' }, { k: '老泡菜', l: '大白菜 + 半勺米醋' }]
      },
      likes: 94,
      comments: [
        { user: 'Sarah', flag: '🇺🇸', text: 'So comforting on a cold night—literally took 3 minutes!' }
      ]
    },
    {
      id: 'doenjang-jjigae',
      tier: 'phase2',
      stickKey: 'kimchi',
      youtubeId: 'qWbHSOplcvY',
      cookTime: 5,
      servings: 2,
      emoji: '🥘',
      grad: 'linear-gradient(135deg,#3d3200,#8d710a)',
      title: { ko: '[Phase 2] 바글바글 된장찌개', en: '[Phase 2] Savory Doenjang Stew', ja: '[Phase 2] テンジャンチゲ', zh: '[Phase 2] 浓郁大酱汤' },
      desc: { ko: 'Phase 2 확장 예정 된장찌개 베이스 레시피 미리보기입니다.', en: 'Preview of our upcoming Phase 2 Doenjang Stew Base recipe.', ja: 'Phase 2拡張予定のテンジャンチゲプレビュー。', zh: 'Phase 2 扩展计划的大酱汤食谱预览。' },
      ingredients: {
        ko: ['K1 된장찌개 베이스 1포 (Phase 2)', '물 400ml', '애호박 ¼개', '두부 ¼모', '감자 ½개'],
        en: ['1 K1 Doenjang Base stick (Phase 2)', '400ml water', '¼ zucchini', '¼ block tofu', '½ potato'],
        ja: ['K1テンジャンベース1本(Phase 2)', '水400ml', 'ズッキーニ¼', '豆腐¼', 'じゃがいも½'],
        zh: ['K1大酱汤底料1条(Phase 2)', '水400ml', '西葫芦¼', '豆腐¼', '土豆½']
      },
      steps: [
        { ts: '0:20', text: { ko: '물 400ml에 감자와 K1 된장 베이스를 넣고 끓입니다.', en: 'Boil 400ml water with diced potato and K1 Doenjang stick.', ja: '水400mlにじゃがいもとベースを入れて沸かします。', zh: '400ml水加土豆与大酱底料煮开。' } },
        { ts: '1:40', text: { ko: '호박과 두부를 넣고 5분 끓이면 완성!', en: 'Add zucchini and tofu, simmer 5 minutes!', ja: 'ズッキーニと豆腐を入れて5分煮込めば完成！', zh: '加入西葫芦和豆腐煮5分钟即可！' } }
      ],
      subs: {
        ko: [{ k: '애호박', l: 'Zucchini' }, { k: '청양고추', l: 'Jalapeño / Serrano' }],
        en: [{ k: 'Korean Squash', l: 'Zucchini' }, { k: 'Cheongyang Chili', l: 'Jalapeño or Serrano' }],
        ja: [{ k: 'エホバク', l: 'ズッキーニ' }],
        zh: [{ k: '韩式角瓜', l: '西葫芦' }]
      },
      likes: 41,
      comments: []
    }
  ];

  /* ========================================================================
     4. One-Click Demo YouTube Presets (Guaranteed Demo Reliability)
     ======================================================================== */
  const YT_DEMO_PRESETS = [
    {
      label: { ko: '10분 소불고기 영상', en: '10-Min Beef Bulgogi YT', ja: '10分牛プルコギ動画', zh: '10分钟牛肉烤肉视频' },
      url: 'https://www.youtube.com/watch?v=bIRnM6s4GNo',
      videoId: 'bIRnM6s4GNo',
      channel: 'K-Home Cooking Demo',
      title: { ko: '초간단 소불고기 황금레시피 (유튜브 추출)', en: 'Quick Korean Beef Bulgogi (Imported from YouTube)', ja: '簡単プルコギ黄金レシピ（YouTube抽出）', zh: '超简单韩式烤肉食谱（YouTube提取）' },
      cookTime: 5,
      servings: 2,
      ingredients: [
        { name: '소고기 불고기감', amount: '250g' },
        { name: '양파', amount: '½개' },
        { name: '대파', amount: '½대' },
        { name: '진간장·설탕·다진마늘·배즙 (→ K1 01 불고기 스틱 1포로 대체!)', amount: '1포 (12g)' }
      ],
      steps: [
        { ts: '0:25', text: '소고기를 키친타월로 핏물을 뺀 뒤 한입 크기로 썹니다.' },
        { ts: '1:10', text: '복잡한 양념장 대신 K1 01 불고기 스틱 1포 + 물 2큰술을 바로 버무립니다.' },
        { ts: '2:20', text: '양파와 대파를 넣고 중강불에서 3분간 볶아 마무리합니다.' }
      ],
      tips: ['유튜브 원 영상의 7가지 액상 양념 계량을 K1 01 불고기 스틱 1포로 줄일 수 있습니다.']
    },
    {
      label: { ko: '분식집 국물 떡볶이 영상', en: 'Street Tteokbokki YT', ja: '屋台トッポッキ動画', zh: '街头辣炒年糕视频' },
      url: 'https://www.youtube.com/watch?v=mVzTaFTKKfQ',
      videoId: 'mVzTaFTKKfQ',
      channel: 'Seoul Street Food Lab',
      title: { ko: '실패 없는 분식집 국물 떡볶이 (유튜브 추출)', en: 'Foolproof Street Soupy Tteokbokki (Imported)', ja: '失敗しない屋台トッポッキ（YouTube抽出）', zh: '零失败街头汤汁炒年糕（YouTube提取）' },
      cookTime: 5,
      servings: 2,
      ingredients: [
        { name: '밀떡 또는 쌀떡', amount: '250g' },
        { name: '물', amount: '350ml' },
        { name: '고추장·고춧가루·설탕·물엿 (→ K1 02 떡볶이 스틱 1포로 대체!)', amount: '1포 (15g)' },
        { name: '대파·삶은 달걀', amount: '취향껏' }
      ],
      steps: [
        { ts: '0:18', text: '떡을 찬물에 살짝 헹궈 준비합니다.' },
        { ts: '0:58', text: '물 350ml에 K1 02 떡볶이 스틱 1포를 풀어 끓입니다.' },
        { ts: '2:05', text: '떡과 어묵을 넣고 3분간 졸여 윤기 나게 완성합니다.' }
      ],
      tips: ['고추장·물엿 계량 없이 K1 02 떡볶이 스틱 1포로 동일한 분식집 농도가 나옵니다.']
    },
    {
      label: { ko: '자취생 5분 김치찌개 영상', en: '5-Min Kimchi Stew YT', ja: '5分キムチチゲ動画', zh: '5分钟泡菜汤视频' },
      url: 'https://www.youtube.com/watch?v=T6sHn-MGRzY',
      videoId: 'T6sHn-MGRzY',
      channel: 'Everyday K-Table',
      title: { ko: '깊은 맛 5분 김치찌개 (유튜브 추출)', en: 'Deep Flavor 5-Min Kimchi Jjigae (Imported)', ja: '深い味わいの5分キムチチゲ（YouTube抽出）', zh: '浓郁5分钟泡菜汤（YouTube提取）' },
      cookTime: 4,
      servings: 2,
      ingredients: [
        { name: '물', amount: '400ml' },
        { name: '두부', amount: '½모' },
        { name: '멸치육수·새우젓·고춧가루 (→ K1 03 김치찌개 스틱 1포로 대체!)', amount: '1포 (12g)' },
        { name: '김치·대파', amount: '적당량' }
      ],
      steps: [
        { ts: '0:15', text: '냄비에 물 400ml와 K1 03 김치찌개 스틱 1포를 넣고 끓입니다.' },
        { ts: '0:52', text: '두부와 대파를 넣고 중불에서 3분간 더 끓입니다.' },
        { ts: '1:45', text: '취향에 따라 참치나 돼지고기를 추가하면 더욱 풍성합니다.' }
      ],
      tips: ['멸치 육수를 따로 우리지 않아도 K1 03 김치찌개 스틱으로 깊은 감칠맛이 납니다.']
    }
  ];

  /* ========================================================================
     5. State & Persistence
     ======================================================================== */
  let activeFilter = 'all';
  let searchQuery = '';
  let detailTab = 'ing';
  let pendingExtract = null;
  let lastTrackedRecipeId = null;

  function loadImported() {
    try { return JSON.parse(localStorage.getItem(IMPORTED_KEY) || '[]'); } catch { return []; }
  }
  function saveImported(recipeObj) {
    const list = loadImported().filter(r => r.id !== recipeObj.id);
    list.unshift(recipeObj);
    localStorage.setItem(IMPORTED_KEY, JSON.stringify(list));
  }
  function getAllRecipes() {
    return [...loadImported(), ...BUILTIN_RECIPES];
  }

  function loadLikes() {
    try { return JSON.parse(localStorage.getItem(LIKES_KEY) || '{}'); } catch { return {}; }
  }
  function toggleLike(id) {
    const map = loadLikes();
    map[id] = !map[id];
    localStorage.setItem(LIKES_KEY, JSON.stringify(map));
    return map[id];
  }
  function loadComments() {
    try { return JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}'); } catch { return {}; }
  }
  function addComment(id, text) {
    const map = loadComments();
    if (!map[id]) map[id] = [];
    map[id].unshift({ user: 'You', flag: LANGS[lang].flag, text });
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(map));
  }

  function parseVideoId(url) {
    const m = (url || '').match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  function tsToSec(ts) {
    const p = String(ts || '0:00').split(':').map(Number);
    return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : (p[0] || 0) * 60 + (p[1] || 0);
  }

  /* ========================================================================
     6. Router & Renderers (100% Compatible with Printed QR URLs!)
     ======================================================================== */
  function parseRoute() {
    const raw = (window.location.hash || '#/').replace(/^#\/?/, '');
    if (raw === 'import') return { view: 'import' };
    if (raw.startsWith('recipe/')) return { view: 'detail', id: decodeURIComponent(raw.slice(7)) };
    return { view: 'feed' };
  }

  function syncNavUI(view) {
    document.documentElement.lang = LANGS[lang].html;
    const f = document.getElementById('langFlag');
    const n = document.getElementById('langName');
    if (f) f.textContent = LANGS[lang].flag;
    if (n) n.textContent = LANGS[lang].name;
    document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    document.querySelectorAll('[data-ui]').forEach(el => { el.textContent = t(el.dataset.ui); });
    document.querySelectorAll('[data-nav-view]').forEach(a => {
      a.classList.toggle('active', a.dataset.navView === (view === 'detail' ? 'feed' : view));
    });
  }

  function render() {
    const route = parseRoute();
    syncNavUI(route.view);
    const app = document.getElementById('app');
    if (!app) return;
    if (route.view !== 'detail') lastTrackedRecipeId = null;
    if (route.view === 'import') renderImportView(app);
    else if (route.view === 'detail') renderDetailView(app, route.id);
    else renderFeedView(app);
  }

  /* ---------- View A: Unified Recipe Feed ---------- */
  function renderFeedView(app) {
    const all = getAllRecipes();
    const q = searchQuery.trim().toLowerCase();
    const filtered = all.filter(r => {
      if (activeFilter !== 'all' && r.tier !== activeFilter) return false;
      if (!q) return true;
      const hay = `${pick(r.title)} ${pick(r.desc)} ${pick(STICKS[r.stickKey]?.name)}`.toLowerCase();
      return hay.includes(q);
    });

    app.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'wrap';

    // Hero Box
    const hero = document.createElement('section');
    hero.className = 'feed-hero';
    hero.innerHTML = `
      <div>
        <span class="feed-kicker">✦ ${t('hero.kicker')}</span>
        <h1>${t('hero.title')}</h1>
        <p>${t('hero.sub')}</p>
      </div>
      <div class="feed-cta-panel">
        <strong>${t('hero.ctaTitle')}</strong>
        <span>${t('hero.ctaSub')}</span>
        <a class="btn btn-red" href="#/import"><i class="fa-brands fa-youtube"></i><span>${t('hero.ctaBtn')}</span></a>
      </div>`;
    wrap.appendChild(hero);

    // Toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';

    const chips = document.createElement('div');
    chips.className = 'filter-chips';
    const filters = [
      ['all', t('filter.all')],
      ['core', t('filter.core')],
      ['phase2', t('filter.phase2')],
      ['yt', `${t('filter.yt')} (${loadImported().length})`]
    ];
    filters.forEach(([key, label]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `f-chip ${activeFilter === key ? 'active' : ''}`;
      btn.textContent = label;
      btn.addEventListener('click', () => { activeFilter = key; renderFeedView(app); });
      chips.appendChild(btn);
    });

    const search = document.createElement('div');
    search.className = 'search-box';
    const si = document.createElement('i'); si.className = 'fa-solid fa-magnifying-glass'; si.style.color = 'var(--ink-55)';
    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = t('search.ph');
    input.value = searchQuery;
    input.addEventListener('input', e => { searchQuery = e.target.value; renderFeedCards(grid, app); });
    search.append(si, input);

    toolbar.append(chips, search);
    wrap.appendChild(toolbar);

    const grid = document.createElement('div');
    grid.className = 'recipe-grid';
    wrap.appendChild(grid);
    app.appendChild(wrap);

    renderFeedCards(grid, app);
  }

  function renderFeedCards(grid) {
    const all = getAllRecipes();
    const q = searchQuery.trim().toLowerCase();
    const filtered = all.filter(r => {
      if (activeFilter !== 'all' && r.tier !== activeFilter) return false;
      if (!q) return true;
      const hay = `${pick(r.title)} ${pick(r.desc)} ${pick(STICKS[r.stickKey]?.name)}`.toLowerCase();
      return hay.includes(q);
    });

    grid.innerHTML = '';
    if (!filtered.length) {
      const empty = document.createElement('p');
      empty.style.color = 'var(--ink-55)';
      empty.textContent = t('empty');
      grid.appendChild(empty);
      return;
    }

    const likesMap = loadLikes();
    filtered.forEach(r => {
      const stick = STICKS[r.stickKey] || STICKS.bulgogi;
      const card = document.createElement('article');
      card.className = 'r-card';
      card.addEventListener('click', () => { window.location.hash = `#/recipe/${encodeURIComponent(r.id)}`; });

      const thumb = document.createElement('div');
      thumb.className = 'r-thumb';
      if (r.img) {
        const img = document.createElement('img');
        img.className = 'dish';
        img.src = r.img;
        img.alt = pick(r.title);
        img.loading = 'lazy';
        thumb.appendChild(img);
      } else {
        const fb = document.createElement('div');
        fb.className = 'grad-fallback';
        fb.style.background = r.grad || 'linear-gradient(135deg,#3a1508,#a92717)';
        fb.textContent = r.emoji || '🍲';
        thumb.appendChild(fb);
      }

      const badge = document.createElement('span');
      badge.className = `r-badge ${r.tier === 'yt' ? 'yt' : (r.tier === 'phase2' ? 'p2' : '')}`;
      badge.textContent = r.tier === 'core' ? t('badge.core') : (r.tier === 'yt' ? t('badge.yt') : t('badge.phase2'));
      if (r.tier === 'core') badge.style.background = stick.color;
      thumb.appendChild(badge);

      if (r.tier !== 'phase2') {
        const mini = document.createElement('img');
        mini.className = 'r-stick-mini';
        mini.src = stick.frontImg;
        mini.alt = pick(stick.name);
        thumb.appendChild(mini);
      }

      const body = document.createElement('div');
      body.className = 'r-body';
      const sTag = document.createElement('div');
      sTag.className = 'r-sauce-tag';
      sTag.style.color = stick.color;
      sTag.textContent = pick(stick.name);

      const h3 = document.createElement('h3');
      h3.textContent = pick(r.title);

      const p = document.createElement('p');
      p.textContent = pick(r.desc);

      const meta = document.createElement('div');
      meta.className = 'r-meta';
      const m1 = document.createElement('span');
      m1.textContent = `⏱ ${r.cookTime}${t('meta.min')} · ${r.servings}${t('meta.servings')}`;
      const m2 = document.createElement('span');
      const likeCount = (r.likes || 0) + (likesMap[r.id] ? 1 : 0);
      m2.textContent = `♥ ${likeCount}`;
      meta.append(m1, m2);

      body.append(sTag, h3, p, meta);
      card.append(thumb, body);
      grid.appendChild(card);
    });
  }

  /* ---------- View B: Unified Recipe Detail ---------- */
  function renderDetailView(app, id) {
    const recipe = getAllRecipes().find(r => r.id === id) || BUILTIN_RECIPES[0];
    if (lastTrackedRecipeId !== recipe.id) {
      lastTrackedRecipeId = recipe.id;
      window.K1Analytics?.track('qr_recipe_open', {
        recipe_id: recipe.id,
        tier: recipe.tier,
        stick_key: recipe.stickKey,
        language: lang
      });
    }
    const stick = STICKS[recipe.stickKey] || STICKS.bulgogi;
    const likesMap = loadLikes();
    const isLiked = !!likesMap[recipe.id];
    const userComments = loadComments()[recipe.id] || [];
    const allComments = [...userComments, ...(recipe.comments || [])];

    app.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'wrap';

    const backRow = document.createElement('div');
    backRow.className = 'back-row';
    const backBtn = document.createElement('a');
    backBtn.className = 'btn btn-outline';
    backBtn.href = '#/';
    backBtn.textContent = t('detail.back');
    const importBtn = document.createElement('a');
    importBtn.className = 'btn btn-red';
    importBtn.href = '#/import';
    importBtn.innerHTML = `<i class="fa-brands fa-youtube"></i><span>${t('nav.import')}</span>`;
    backRow.append(backBtn, importBtn);
    wrap.appendChild(backRow);

    const grid = document.createElement('div');
    grid.className = 'detail-grid';

    // Left: Video + Meta + Comments
    const left = document.createElement('div');
    const playerCard = document.createElement('div');
    playerCard.className = 'player-card';

    const vbox = document.createElement('div');
    vbox.className = 'video-box';
    const iframe = document.createElement('iframe');
    iframe.id = 'detailYtFrame';
    iframe.src = `https://www.youtube.com/embed/${recipe.youtubeId}?enablejsapi=1`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    vbox.appendChild(iframe);

    const dmeta = document.createElement('div');
    dmeta.className = 'detail-meta';
    const tag = document.createElement('span');
    tag.className = 'feed-kicker';
    tag.style.color = stick.color;
    tag.textContent = recipe.tier === 'yt' ? t('badge.yt') : `${t('badge.core')} · ${pick(stick.name)}`;
    const h1 = document.createElement('h1');
    h1.textContent = pick(recipe.title);
    const desc = document.createElement('p');
    desc.style.color = 'var(--ink-75)';
    desc.style.fontSize = '0.92rem';
    desc.textContent = pick(recipe.desc);
    const pills = document.createElement('div');
    pills.className = 'detail-pills';
    [
      `⏱ ${recipe.cookTime}${t('meta.min')}`,
      `🍽 ${recipe.servings}${t('meta.servings')}`,
      '1 STICK / 1 RECIPE'
    ].forEach(txt => {
      const s = document.createElement('span'); s.textContent = txt; pills.appendChild(s);
    });
    dmeta.append(tag, h1, desc, pills);
    playerCard.append(vbox, dmeta);
    left.appendChild(playerCard);

    // Social / Comments card
    const socialCard = document.createElement('div');
    socialCard.className = 'd-card';
    const srow = document.createElement('div');
    srow.className = 'social-row';
    const cTitle = document.createElement('strong');
    cTitle.textContent = `${t('detail.comments')} (${allComments.length})`;
    const lBtn = document.createElement('button');
    lBtn.type = 'button';
    lBtn.className = `like-btn ${isLiked ? 'liked' : ''}`;
    lBtn.textContent = `♥ ${t('detail.like')} ${(recipe.likes || 0) + (isLiked ? 1 : 0)}`;
    lBtn.addEventListener('click', () => { toggleLike(recipe.id); renderDetailView(app, recipe.id); });
    srow.append(cTitle, lBtn);

    const cForm = document.createElement('form');
    cForm.className = 'comment-form';
    const cIn = document.createElement('input');
    cIn.type = 'text';
    cIn.placeholder = t('detail.commentPh');
    const cBtn = document.createElement('button');
    cBtn.type = 'submit';
    cBtn.className = 'btn btn-ink';
    cBtn.textContent = t('detail.post');
    cForm.append(cIn, cBtn);
    cForm.addEventListener('submit', e => {
      e.preventDefault();
      const val = cIn.value.trim();
      if (!val) return;
      addComment(recipe.id, val);
      renderDetailView(app, recipe.id);
    });

    const cList = document.createElement('div');
    cList.className = 'comment-list';
    allComments.forEach(c => {
      const item = document.createElement('div');
      item.className = 'c-item';
      const head = document.createElement('div');
      head.className = 'c-head';
      const b = document.createElement('b'); b.textContent = `${c.flag || '🌍'} ${c.user}`;
      head.appendChild(b);
      const txt = document.createElement('div'); txt.textContent = c.text;
      item.append(head, txt);
      cList.appendChild(item);
    });

    socialCard.append(srow, cForm, cList);
    left.appendChild(socialCard);

    // Right: K1 Stick Match + Ingredients / Steps / Local Substitutes
    const right = document.createElement('div');
    const matchCard = document.createElement('div');
    matchCard.className = 'stick-match-card';
    const mImg = document.createElement('img'); mImg.src = stick.frontImg; mImg.alt = pick(stick.name);
    const mBody = document.createElement('div');
    const mStrong = document.createElement('strong'); mStrong.textContent = `${t('detail.matchTitle')}: ${pick(stick.name)}`;
    const mP = document.createElement('p'); mP.textContent = pick(stick.pitch);
    const mLink = document.createElement('a');
    mLink.className = 'btn btn-red';
    mLink.style.padding = '0.52rem 1rem';
    mLink.style.fontSize = '0.8rem';
    mLink.href = `../index.html?flavor=${stick.key}#validate`;
    mLink.textContent = t('detail.matchBtn');
    mBody.append(mStrong, mP, mLink);
    matchCard.append(mImg, mBody);
    right.appendChild(matchCard);

    const tabCard = document.createElement('div');
    tabCard.className = 'd-card';
    const tabs = document.createElement('div');
    tabs.className = 'd-tabs';
    const thirdLabel = (recipe.subs && pick(recipe.subs).length) ? t('detail.tabSubs') : t('detail.tabTips');
    [['ing', t('detail.tabIng')], ['steps', t('detail.tabSteps')], ['extra', thirdLabel]].forEach(([k, lbl]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `d-tab ${detailTab === k ? 'active' : ''}`;
      b.textContent = lbl;
      b.addEventListener('click', () => { detailTab = k; renderDetailView(app, recipe.id); });
      tabs.appendChild(b);
    });
    tabCard.appendChild(tabs);

    if (detailTab === 'ing') {
      const ul = document.createElement('ul');
      ul.className = 'ing-list';
      const ings = Array.isArray(recipe.ingredients) ? recipe.ingredients : (recipe.ingredients[lang] || recipe.ingredients.ko);
      ings.forEach(item => {
        const li = document.createElement('li');
        li.className = 'ing-item';
        const lbl = document.createElement('label');
        lbl.style.display = 'flex'; lbl.style.alignItems = 'center'; lbl.style.cursor = 'pointer'; lbl.style.width = '100%';
        const cb = document.createElement('input'); cb.type = 'checkbox';
        cb.addEventListener('change', () => li.classList.toggle('checked', cb.checked));
        const sp = document.createElement('span');
        sp.textContent = typeof item === 'string' ? item : `${item.name}${item.amount ? ` (${item.amount})` : ''}`;
        lbl.append(cb, sp);
        li.appendChild(lbl);
        ul.appendChild(li);
      });
      tabCard.appendChild(ul);
    } else if (detailTab === 'steps') {
      const list = document.createElement('div');
      list.className = 'step-list';
      (recipe.steps || []).forEach((st, idx) => {
        const card = document.createElement('div');
        card.className = 'step-item';
        const top = document.createElement('div');
        top.className = 'step-top';
        const sIdx = document.createElement('span');
        sIdx.className = 'step-idx';
        sIdx.textContent = `STEP 0${idx + 1}`;
        top.appendChild(sIdx);
        if (st.ts) {
          const tsBtn = document.createElement('button');
          tsBtn.type = 'button';
          tsBtn.className = 'ts-btn';
          tsBtn.textContent = `▶ ${st.ts}`;
          tsBtn.addEventListener('click', () => {
            const sec = tsToSec(st.ts);
            const f = document.getElementById('detailYtFrame');
            if (f) f.src = `https://www.youtube.com/embed/${recipe.youtubeId}?start=${sec}&autoplay=1`;
          });
          top.appendChild(tsBtn);
        }
        const p = document.createElement('p');
        p.textContent = pick(st.text || st.description || '');
        card.append(top, p);
        list.appendChild(card);
      });
      tabCard.appendChild(list);
    } else {
      const ul = document.createElement('ul');
      ul.className = 'sub-list';
      const subs = recipe.subs ? (recipe.subs[lang] || recipe.subs.ko) : null;
      if (subs && subs.length) {
        subs.forEach(s => {
          const li = document.createElement('li');
          li.className = 'sub-row';
          const k = document.createElement('span'); k.textContent = s.k;
          const a = document.createElement('i'); a.className = 'fa-solid fa-arrow-right'; a.style.color = 'var(--k1-red)';
          const l = document.createElement('span'); l.className = 'loc'; l.textContent = s.l;
          li.append(k, a, l);
          ul.appendChild(li);
        });
      } else {
        (recipe.tips || [pick(stick.pitch)]).forEach(tip => {
          const li = document.createElement('li');
          li.className = 'sub-row';
          li.textContent = `💡 ${tip}`;
          ul.appendChild(li);
        });
      }
      tabCard.appendChild(ul);
    }

    right.appendChild(tabCard);
    grid.append(left, right);
    wrap.appendChild(grid);
    app.appendChild(wrap);
  }

  /* ---------- View C: Integrated YouTube Extractor + K1 Auto-Match ---------- */
  function renderImportView(app) {
    app.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'wrap import-shell';

    const hero = document.createElement('section');
    hero.className = 'import-hero';

    const kicker = document.createElement('span');
    kicker.className = 'feed-kicker';
    kicker.textContent = `✦ ${t('import.kicker')}`;
    const h1 = document.createElement('h1');
    h1.textContent = t('import.title');
    const p = document.createElement('p');
    p.textContent = t('import.sub');

    const bar = document.createElement('form');
    bar.className = 'yt-input-bar';
    const inp = document.createElement('input');
    inp.id = 'ytUrlInput';
    inp.type = 'text';
    inp.placeholder = t('import.ph');
    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'btn btn-red';
    btn.id = 'ytExtractBtn';
    btn.textContent = t('import.btn');
    bar.append(inp, btn);

    const samples = document.createElement('div');
    samples.className = 'sample-yt-row';
    const sLbl = document.createElement('span');
    sLbl.textContent = t('import.samples');
    samples.appendChild(sLbl);
    YT_DEMO_PRESETS.forEach(pr => {
      const sb = document.createElement('button');
      sb.type = 'button';
      sb.className = 'sample-yt-btn';
      sb.textContent = `▶ ${pick(pr.label)}`;
      sb.addEventListener('click', () => {
        inp.value = pr.url;
        runExtraction(pr.url, pr);
      });
      samples.appendChild(sb);
    });

    hero.append(kicker, h1, p, bar, samples);
    wrap.appendChild(hero);

    const status = document.createElement('div');
    status.id = 'importStatus';
    status.className = 'status-banner';
    wrap.appendChild(status);

    const resultMount = document.createElement('div');
    resultMount.id = 'importResultMount';
    wrap.appendChild(resultMount);

    app.appendChild(wrap);

    bar.addEventListener('submit', e => {
      e.preventDefault();
      runExtraction(inp.value.trim(), null);
    });

    if (pendingExtract) renderExtractResult(resultMount, pendingExtract);
  }

  async function runExtraction(url, preset) {
    const statusEl = document.getElementById('importStatus');
    const mount = document.getElementById('importResultMount');
    const btn = document.getElementById('ytExtractBtn');
    const vid = parseVideoId(url);

    if (!vid) {
      statusEl.className = 'status-banner err';
      statusEl.textContent = lang === 'ko' ? '올바른 유튜브 URL을 입력해 주세요. (예: https://youtu.be/...)' : 'Please enter a valid YouTube URL.';
      return;
    }

    statusEl.className = 'status-banner info';
    statusEl.textContent = t('import.loading');
    if (btn) btn.disabled = true;

    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 6500);
      const resp = await fetch(`${API_URL}/api/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, language: lang }),
        signal: ctrl.signal
      });
      clearTimeout(timer);
      const data = await resp.json();
      if (!resp.ok || data.error || !data.recipe) throw new Error(data.error || 'API unavailable');

      const title = data.recipe.title || (data.videoInfo && data.videoInfo.title) || 'YouTube Recipe';
      const ingText = (data.recipe.ingredients || []).map(i => i.name).join(' ');
      const matched = matchStickFromText(`${title} ${ingText}`);

      pendingExtract = {
        id: `yt-${data.videoId || vid}`,
        tier: 'yt',
        stickKey: matched.key,
        youtubeId: data.videoId || vid,
        cookTime: parseInt(data.recipe.cookTime, 10) || 5,
        servings: parseInt(data.recipe.servings, 10) || 2,
        img: `https://img.youtube.com/vi/${data.videoId || vid}/hqdefault.jpg`,
        title,
        desc: `${(data.videoInfo && data.videoInfo.channel) ? `${data.videoInfo.channel} · ` : ''}${pick(matched.name)}`,
        ingredients: (data.recipe.ingredients || []).map(i => ({ name: i.name, amount: i.amount || '' })),
        steps: (data.recipe.steps || []).map(s => ({ ts: s.timestamp || '', text: `${s.title ? `${s.title} — ` : ''}${s.description || ''}` })),
        tips: data.recipe.tips || [pick(matched.pitch)],
        likes: 1,
        comments: []
      };

      window.K1Analytics?.track('youtube_extract', {
        matched_stick: matched.key,
        mode: 'live',
        video_id: data.videoId || vid
      });

      statusEl.className = 'status-banner ok';
      statusEl.textContent = t('import.liveNote');
      renderExtractResult(mount, pendingExtract);
    } catch {
      const base = preset || YT_DEMO_PRESETS.find(p => p.videoId === vid) || YT_DEMO_PRESETS[0];
      const title = pick(base.title);
      const matched = matchStickFromText(`${title} ${base.ingredients.map(i => i.name).join(' ')}`);
      pendingExtract = {
        id: `yt-${vid}`,
        tier: 'yt',
        stickKey: matched.key,
        youtubeId: vid,
        cookTime: base.cookTime,
        servings: base.servings,
        img: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
        title,
        desc: `${base.channel} · ${pick(matched.name)}`,
        ingredients: base.ingredients,
        steps: base.steps,
        tips: base.tips,
        likes: 1,
        comments: []
      };
      window.K1Analytics?.track('youtube_extract', {
        matched_stick: matched.key,
        mode: 'demo',
        video_id: vid
      });
      statusEl.className = 'status-banner info';
      statusEl.textContent = t('import.fallbackNote');
      renderExtractResult(mount, pendingExtract);
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function renderExtractResult(mount, data) {
    if (!mount) return;
    const stick = STICKS[data.stickKey] || STICKS.bulgogi;
    mount.innerHTML = '';

    const box = document.createElement('div');
    box.className = 'extract-result';

    const top = document.createElement('div');
    top.className = 'extract-top';
    const h2 = document.createElement('h2');
    h2.style.fontSize = '1.22rem';
    h2.textContent = pick(data.title);
    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn-red';
    saveBtn.innerHTML = `<i class="fa-solid fa-bookmark"></i><span>${t('import.save')}</span>`;
    saveBtn.addEventListener('click', () => {
      saveImported(data);
      window.K1Analytics?.track('youtube_save_to_feed', {
        recipe_id: data.id,
        matched_stick: data.stickKey,
        video_id: data.youtubeId
      });
      detailTab = 'steps';
      window.location.hash = `#/recipe/${encodeURIComponent(data.id)}`;
    });
    top.append(h2, saveBtn);

    const matchStrip = document.createElement('div');
    matchStrip.className = 'match-strip';
    const mLeft = document.createElement('div');
    mLeft.className = 'match-strip-left';
    const mImg = document.createElement('img'); mImg.src = stick.frontImg; mImg.alt = pick(stick.name);
    const mTxt = document.createElement('div');
    const ms = document.createElement('strong'); ms.textContent = `✦ ${t('detail.matchTitle')}: ${pick(stick.name)}`;
    const mp = document.createElement('div'); mp.style.fontSize = '0.82rem'; mp.style.color = 'var(--ink-75)'; mp.textContent = pick(stick.pitch);
    mTxt.append(ms, mp);
    mLeft.append(mImg, mTxt);
    const mReserve = document.createElement('a');
    mReserve.className = 'btn btn-ink';
    mReserve.href = `../index.html?flavor=${stick.key}#validate`;
    mReserve.textContent = t('detail.matchBtn');
    matchStrip.append(mLeft, mReserve);

    const ingHead = document.createElement('h3');
    ingHead.style.fontSize = '0.95rem'; ingHead.style.marginBottom = '0.55rem';
    ingHead.textContent = `🥬 ${t('detail.tabIng')} (${data.ingredients.length})`;
    const ingUl = document.createElement('ul');
    ingUl.className = 'ing-list';
    ingUl.style.marginBottom = '1.15rem';
    data.ingredients.forEach(i => {
      const li = document.createElement('li');
      li.className = 'ing-item';
      const n = document.createElement('span'); n.textContent = i.name;
      const a = document.createElement('strong'); a.style.color = 'var(--k1-red)'; a.textContent = i.amount || '';
      li.append(n, a);
      ingUl.appendChild(li);
    });

    const stHead = document.createElement('h3');
    stHead.style.fontSize = '0.95rem'; stHead.style.marginBottom = '0.55rem';
    stHead.textContent = `👨‍🍳 ${t('detail.tabSteps')} (${data.steps.length})`;
    const stList = document.createElement('div');
    stList.className = 'step-list';
    data.steps.forEach((s, idx) => {
      const card = document.createElement('div');
      card.className = 'step-item';
      const stTop = document.createElement('div');
      stTop.className = 'step-top';
      const idxEl = document.createElement('span'); idxEl.className = 'step-idx'; idxEl.textContent = `STEP 0${idx + 1}`;
      stTop.appendChild(idxEl);
      if (s.ts) {
        const tsEl = document.createElement('span'); tsEl.className = 'ts-btn'; tsEl.textContent = s.ts;
        stTop.appendChild(tsEl);
      }
      const p = document.createElement('p'); p.textContent = pick(s.text);
      card.append(stTop, p);
      stList.appendChild(card);
    });

    box.append(top, matchStrip, ingHead, ingUl, stHead, stList);
    mount.appendChild(box);
  }

  /* ---------- Language Selector Init ---------- */
  const lSel = document.getElementById('langSelector');
  const lBtn = document.getElementById('langBtn');
  if (lSel && lBtn) {
    lBtn.addEventListener('click', e => { e.stopPropagation(); lSel.classList.toggle('open'); });
    document.addEventListener('click', () => lSel.classList.remove('open'));
  }
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      lang = btn.dataset.lang;
      localStorage.setItem('k1Lang', lang);
      if (lSel) lSel.classList.remove('open');
      render();
    });
  });

  window.addEventListener('hashchange', render);
  render();
})();
