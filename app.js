(function () {
  'use strict';

  const CONFIG = {
    FORM_ENDPOINT: '',
    STORAGE_KEY: 'k1_validation_submissions_v3'
  };

  /* ---------- Mobile Drawer ---------- */
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const navToggle = document.getElementById('navToggle');
  const drawerClose = document.getElementById('drawerClose');

  function openDrawer() {
    if (!drawer || !backdrop) return;
    drawer.classList.add('open');
    backdrop.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (!drawer || !backdrop) return;
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (navToggle) navToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  document.querySelectorAll('.drawer-nav a').forEach(a => a.addEventListener('click', closeDrawer));

  /* ---------- Privacy Policy Modal ---------- */
  const privacyModal = document.getElementById('privacyModal');
  const privacyBackdrop = document.getElementById('privacyBackdrop');
  const privacyClose = document.getElementById('privacyClose');
  const privacyConfirmBtn = document.getElementById('privacyConfirmBtn');
  let lastPrivacyTrigger = null;

  function openPrivacyModal(triggerEl) {
    if (!privacyModal || !privacyBackdrop) return;
    lastPrivacyTrigger = triggerEl || document.activeElement;
    privacyModal.classList.add('open');
    privacyBackdrop.classList.add('open');
    privacyModal.setAttribute('aria-hidden', 'false');
    privacyBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (privacyClose) privacyClose.focus();
  }

  function closePrivacyModal() {
    if (!privacyModal || !privacyBackdrop || !privacyModal.classList.contains('open')) return;
    privacyModal.classList.remove('open');
    privacyBackdrop.classList.remove('open');
    privacyModal.setAttribute('aria-hidden', 'true');
    privacyBackdrop.setAttribute('aria-hidden', 'true');
    if (!drawer || !drawer.classList.contains('open')) {
      document.body.style.overflow = '';
    }
    if (lastPrivacyTrigger && typeof lastPrivacyTrigger.focus === 'function') {
      lastPrivacyTrigger.focus();
    }
  }

  document.querySelectorAll('[data-open-privacy]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openPrivacyModal(btn);
    });
  });
  if (privacyClose) privacyClose.addEventListener('click', closePrivacyModal);
  if (privacyConfirmBtn) privacyConfirmBtn.addEventListener('click', closePrivacyModal);
  if (privacyBackdrop) privacyBackdrop.addEventListener('click', closePrivacyModal);
  if (privacyModal) {
    privacyModal.addEventListener('click', e => {
      if (e.target === privacyModal) closePrivacyModal();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (privacyModal && privacyModal.classList.contains('open')) {
      closePrivacyModal();
    } else {
      closeDrawer();
    }
  });

  /* ---------- Scroll Reveal ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- Interactive Hero Packaging Stage ---------- */
  const PKG_VIEWS = {
    hero: {
      src: 'assets/packaging/01-K1-packaging-hero.png',
      cap: {
        ko: 'K1 K-STICK SAMPLER 6개입 박스 & 핵심 스틱 3종 (01 불고기 · 02 떡볶이 · 03 김치찌개)',
        en: 'K1 K-STICK SAMPLER 6-stick carton & Core 3 sticks (01 Bulgogi · 02 Tteokbokki · 03 Kimchi Stew)',
        ja: 'K1 K-STICK SAMPLER 6本入ボックス＆厳選3種スティック',
        zh: 'K1 K-STICK SAMPLER 6条装礼盒与核心3款条装'
      }
    },
    unboxing: {
      src: 'assets/packaging/04-K1-unboxing.png',
      cap: {
        ko: '박스 개봉 연출 — 3가지 맛 × 각 2포 (총 6포) 구성',
        en: 'Unboxing view — 3 signature flavors × 2 sticks each (6 sticks total)',
        ja: '開封イメージ — 3種フレーバー × 各2本（計6本）',
        zh: '开盒展示 — 3种经典口味 × 各2条（共6条）'
      }
    },
    artwork: {
      src: 'assets/packaging/02-K1-stick-artwork.png',
      cap: {
        ko: '스틱 3종 전면·후면 아트워크 — 실제 판독되는 QR 코드 및 3단계 조리 안내 배치',
        en: 'Front & back stick artwork — scannable QR codes and 3-step cooking guide',
        ja: 'スティック表裏アートワーク — 読取可能なQRコードと3ステップ案内',
        zh: '条包正反面设计 — 真实可扫码QR与3步烹饪指南'
      }
    }
  };
  let activePkgView = 'hero';

  function renderPkgStage() {
    const lang = window.K1I18n ? window.K1I18n.language : 'ko';
    const v = PKG_VIEWS[activePkgView];
    const img = document.getElementById('pkgStageImg');
    const cap = document.getElementById('pkgStageCap');
    if (img) img.src = v.src;
    if (cap) cap.textContent = v.cap[lang] || v.cap.ko;
    document.querySelectorAll('[data-pkg-view]').forEach(b => {
      b.classList.toggle('active', b.dataset.pkgView === activePkgView);
    });
  }
  document.querySelectorAll('[data-pkg-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      activePkgView = btn.dataset.pkgView;
      renderPkgStage();
      window.K1Analytics?.track('packaging_view_switch', { view: activePkgView });
    });
  });

  /* ---------- Interactive Unified QR + YouTube Preview ---------- */
  const QR_DATA = {
    bulgogi: {
      backImg: 'assets/packaging/k1-bulgogi-back.png',
      url: 'k1/recipe/#/recipe/bulgogi-dupbap',
      appHref: 'recipe/index.html#/recipe/bulgogi-dupbap',
      title: { ko: '01 불고기 덮밥 (3분 조리)', en: '01 Savory Bulgogi Rice Bowl (3 min)', ja: '01 プルコギ丼（3分）', zh: '01 烤肉盖饭（3分钟）' },
      sub: { ko: 'K1 01 불고기 스틱 1포 · 물 2큰술 · 1~2인분', en: '1 K1 01 Bulgogi stick · 2 tbsp water · 1–2 servings', ja: 'K1 01 プルコギ1本 · 水大さじ2', zh: 'K1 01烤肉1条 · 水2勺' },
      steps: {
        ko: ['팬에 얇은 소고기(또는 닭고기·대체육)와 양파를 볶습니다.', 'K1 01 불고기 스틱 1포와 물 2큰술을 톡! 넣고 1~2분 버무립니다.', '따뜻한 밥 위에 올리고 깨를 뿌리면 정통 불고기 덮밥 완성!'],
        en: ['Sear thin beef (or chicken / plant strips) with sliced onion.', 'Add 1 K1 01 Bulgogi stick + 2 tbsp water and toss 1–2 min.', 'Serve over warm steamed rice with toasted sesame seeds!'],
        ja: ['薄切り肉（または大豆ミート）と玉ねぎを炒めます。', 'K1 01プルコギ1本と水大さじ2を加え1〜2分絡めます。', '温かいご飯にのせて完成！'],
        zh: ['翻炒牛肉薄片（或鸡肉/植物肉）与洋葱丝。', '加入1条K1 01烤肉底料和2勺水翻炒收汁。', '盛在热米饭上即可享用！']
      },
      subs: {
        ko: [{ k: '불고기용 소고기', l: 'Shaved Beef / Chicken / Tofu' }, { k: '양파·당근', l: 'Yellow Onion · Mushrooms' }, { k: '참기름(선택)', l: 'Toasted Sesame Oil' }],
        en: [{ k: 'Bulgogi Ribeye', l: 'Shaved Beef / Chicken / Plant Strips' }, { k: 'Carrot & Onion', l: 'Yellow Onion & Mushrooms' }, { k: 'Sesame Oil', l: 'Toasted Sesame or Neutral Oil' }],
        ja: [{ k: 'プルコギ牛肉', l: '牛こま・豚バラ・鶏もも' }, { k: '野菜', l: '玉ねぎ・きのこ' }, { k: 'ごま油', l: 'ごま油またはサラダ油' }],
        zh: [{ k: '烤肉牛肉片', l: '肥牛卷 / 鸡胸肉 / 豆干丝' }, { k: '配菜', l: '洋葱 / 蘑菇 / 彩椒' }, { k: '香油', l: '芝麻油或食用油' }]
      },
      yt: {
        ko: '유튜브 "백종원식 10분 소불고기" 링크 입력 → 9가지 양념 계량 단계를 자동 분석해 K1 01 불고기 스틱 1포로 단축 추천 및 피드 저장!',
        en: 'Paste any YouTube Bulgogi video → extracts ingredients & timestamps, then simplifies 8 seasoning steps into 1 K1 01 Bulgogi Stick and saves to your feed!',
        ja: 'YouTubeのプルコギ動画URLを貼ると手順と材料を自動抽出し、K1 01プルコギ1本での時短案を自動マッチング！',
        zh: '粘贴任意YouTube烤肉视频链接，自动提取材料与时间轴，并智能匹配K1 01烤肉条装一键保存！'
      },
      ytBadge: { ko: '자동 매칭: K1 01 불고기 스틱 추천', en: 'Auto-Matched: K1 01 Bulgogi Stick', ja: '自動マッチ: K1 01 プルコギ', zh: '智能匹配：K1 01 烤肉底料' }
    },
    tteokbokki: {
      backImg: 'assets/packaging/k1-tteokbokki-back.png',
      url: 'k1/recipe/#/recipe/tteokbokki',
      appHref: 'recipe/index.html#/recipe/tteokbokki',
      title: { ko: '02 국물 떡볶이 정석 (3분 조리)', en: '02 Classic Soupy Tteokbokki (3 min)', ja: '02 定番スープトッポッキ（3分）', zh: '02 经典汤汁辣炒年糕（3分钟）' },
      sub: { ko: 'K1 02 떡볶이 스틱 1포 · 물 350ml · 1~2인분', en: '1 K1 02 Tteokbokki stick · 350ml water · 1–2 servings', ja: 'K1 02 トッポッキ1本 · 水350ml', zh: 'K1 02辣炒年糕1条 · 水350ml' },
      steps: {
        ko: ['물 350ml에 K1 02 떡볶이 스틱 1포를 풀어 끓입니다.', '떡볶이 떡(또는 감자 뇨끼)과 삶은 달걀·대파를 넣습니다.', '소스가 윤기 나게 졸아들 때까지 3분간 끓이면 완성!'],
        en: ['Dissolve 1 K1 02 Tteokbokki stick in 350ml boiling water.', 'Add rice cakes (or potato gnocchi) with boiled egg and scallions.', 'Simmer 3 minutes until glossy and thick!'],
        ja: ['水350mlにK1 02トッポッキ1本を溶かして沸かします。', 'トック（またはニョッキ）とゆで卵・長ネギを加えます。', 'とろみがつくまで3分煮詰めれば完成！'],
        zh: ['350ml水加入1条K1 02辣炒年糕底料煮开。', '放入年糕（或超市意式土豆疙瘩）与水煮蛋。', '煮3分钟收汁浓稠即可出锅！']
      },
      subs: {
        ko: [{ k: '떡볶이 떡', l: 'Potato Gnocchi (감자 뇨끼)' }, { k: '어묵(선택)', l: 'Boiled Egg / Cabbage' }, { k: '대파', l: 'Green Onion / Chives' }],
        en: [{ k: 'Korean Rice Cakes', l: 'Supermarket Potato Gnocchi' }, { k: 'Fish Cake (opt.)', l: 'Boiled Egg or Mozzarella' }, { k: 'Green Onion', l: 'Scallion or Chives' }],
        ja: [{ k: 'トッポッキ餅', l: '切り餅・じゃがいもニョッキ' }, { k: '韓国おでん', l: 'さつま揚げ・ゆで卵' }, { k: '長ネギ', l: '青ネギ' }],
        zh: [{ k: '韩式年糕条', l: '切片年糕 / 意式土豆疙瘩' }, { k: '鱼饼', l: '水煮蛋 / 包菜 / 芝士' }, { k: '大葱', l: '小葱' }]
      },
      yt: {
        ko: '유튜브 "분식집 국물 떡볶이 황금레시피" 링크 입력 → 고추장·고춧가루·물엿 배합을 K1 02 떡볶이 스틱 1포로 자동 매칭해 저장!',
        en: 'Paste any YouTube Tteokbokki link → replaces gochujang, chili flakes & syrup measuring with 1 K1 02 Tteokbokki Stick and saves to your feed!',
        ja: 'YouTubeのトッポッキ動画からコチュジャン配合をK1 02トッポッキ1本へ自動変換して保存！',
        zh: '粘贴YouTube年糕视频，自动省去辣酱糖浆称量，智能匹配K1 02辣炒年糕条装并保存！'
      },
      ytBadge: { ko: '자동 매칭: K1 02 떡볶이 스틱 추천', en: 'Auto-Matched: K1 02 Tteokbokki Stick', ja: '自動マッチ: K1 02 トッポッキ', zh: '智能匹配：K1 02 辣炒年糕底料' }
    },
    kimchi: {
      backImg: 'assets/packaging/k1-kimchi-back.png',
      url: 'k1/recipe/#/recipe/kimchi-jjigae',
      appHref: 'recipe/index.html#/recipe/kimchi-jjigae',
      title: { ko: '03 매콤 김치찌개 (3분 조리)', en: '03 Spicy Kimchi Stew (3 min)', ja: '03 旨辛キムチチゲ（3分）', zh: '03 香辣泡菜汤（3分钟）' },
      sub: { ko: 'K1 03 김치찌개 스틱 1포 · 물 400ml · 1~2인분', en: '1 K1 03 Kimchi stick · 400ml water · 1–2 servings', ja: 'K1 03 キムチチゲ1本 · 水400ml', zh: 'K1 03泡菜汤1条 · 水400ml' },
      steps: {
        ko: ['냄비에 물 400ml를 붓고 K1 03 김치찌개 스틱 1포를 풀어줍니다.', '깍뚝 썬 두부와 대파(취향에 따라 김치·돼지고기)를 넣습니다.', '중강불에서 3분간 바글바글 끓이면 정통 김치찌개 완성!'],
        en: ['Pour 400ml water and dissolve 1 K1 03 Kimchi Stew stick.', 'Add cubed tofu and sliced scallions (plus kimchi/pork if desired).', 'Simmer 3 minutes over medium-high heat and enjoy!'],
        ja: ['水400mlにK1 03キムチチゲ1本を溶かします。', '豆腐と長ネギ（お好みでキムチ・豚肉）を加えます。', '中強火で3分煮込めば完成！'],
        zh: ['400ml水倒入1条K1 03泡菜汤底料搅拌均匀。', '加入豆腐块与葱段（可选加泡菜或猪肉）。', '中大火煮3分钟即成地道泡菜汤！']
      },
      subs: {
        ko: [{ k: '대파', l: 'Scallion / Leek' }, { k: '찌개용 두부', l: 'Firm Tofu / Chickpeas' }, { k: '잘 익은 김치', l: '배추 + 식초 ½스푼' }],
        en: [{ k: 'Korean Green Onion', l: 'Scallion or Leek' }, { k: 'Stew Tofu', l: 'Firm Tofu (any market)' }, { k: 'Aged Kimchi', l: 'Napa Cabbage + ½ tbsp vinegar' }],
        ja: [{ k: '韓国長ネギ', l: '白ネギ・青ネギ' }, { k: 'チゲ用豆腐', l: '木綿・絹ごし豆腐' }, { k: '熟成キムチ', l: '市販キムチ・白菜＋酢' }],
        zh: [{ k: '韩国大葱', l: '小葱 / 京葱' }, { k: '嫩豆腐', l: '超市盒装豆腐' }, { k: '老泡菜', l: '大白菜 + 半勺醋' }]
      },
      yt: {
        ko: '유튜브 "자취생 10분 김치찌개" 링크 입력 → 멸치육수·새우젓·고춧가루 준비를 K1 03 김치찌개 스틱 1포로 자동 추천 및 저장!',
        en: 'Paste any YouTube Kimchi Jjigae video → replaces broth, salted shrimp & seasoning prep with 1 K1 03 Kimchi Stick and saves directly to your feed!',
        ja: 'YouTubeのキムチチゲ動画から出汁・味付け工程をK1 03キムチチゲ1本へ自動マッチングして保存！',
        zh: '粘贴YouTube泡菜汤视频，自动省去高汤与虾酱准备，智能匹配K1 03泡菜汤条装并保存！'
      },
      ytBadge: { ko: '자동 매칭: K1 03 김치찌개 스틱 추천', en: 'Auto-Matched: K1 03 Kimchi Stew Stick', ja: '自動マッチ: K1 03 キムチチゲ', zh: '智能匹配：K1 03 泡菜汤底料' }
    }
  };

  let activeQrSku = 'bulgogi';
  let activeQrTab = 'steps';

  function renderQrStage() {
    const lang = window.K1I18n ? window.K1I18n.language : 'ko';
    const d = QR_DATA[activeQrSku];
    const backImg = document.getElementById('stickBackImg');
    const urlEl = document.getElementById('mwUrl');
    const titleEl = document.getElementById('mwTitle');
    const subEl = document.getElementById('mwSub');
    const listEl = document.getElementById('mwList');
    const linkEl = document.getElementById('mwAppLink');

    if (backImg) backImg.src = d.backImg;
    if (urlEl) urlEl.textContent = d.url;
    if (titleEl) titleEl.textContent = d.title[lang] || d.title.ko;
    if (subEl) subEl.textContent = d.sub[lang] || d.sub.ko;
    if (linkEl) linkEl.href = activeQrTab === 'yt' ? 'recipe/index.html#/import' : d.appHref;

    if (listEl) {
      listEl.innerHTML = '';
      if (activeQrTab === 'steps') {
        (d.steps[lang] || d.steps.ko).forEach((s, i) => {
          const li = document.createElement('li');
          li.className = 'mw-step';
          const b = document.createElement('b'); b.textContent = String(i + 1);
          const span = document.createElement('span'); span.textContent = s;
          li.append(b, span);
          listEl.appendChild(li);
        });
      } else if (activeQrTab === 'subs') {
        (d.subs[lang] || d.subs.ko).forEach(row => {
          const li = document.createElement('li');
          li.className = 'mw-sub-row';
          const k = document.createElement('span'); k.textContent = row.k;
          const a = document.createElement('i'); a.className = 'fa-solid fa-arrow-right'; a.style.color = 'var(--k1-red)';
          const l = document.createElement('span'); l.className = 'loc'; l.textContent = row.l;
          li.append(k, a, l);
          listEl.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.className = 'mw-yt-box';
        const p = document.createElement('div'); p.textContent = d.yt[lang] || d.yt.ko;
        const badge = document.createElement('span');
        badge.className = 'mw-yt-match';
        badge.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> ';
        badge.append(document.createTextNode(d.ytBadge[lang] || d.ytBadge.ko));
        li.append(p, badge);
        listEl.appendChild(li);
      }
    }

    document.querySelectorAll('[data-qr-sku]').forEach(b => b.classList.toggle('active', b.dataset.qrSku === activeQrSku));
    document.querySelectorAll('[data-qr-tab]').forEach(b => b.classList.toggle('active', b.dataset.qrTab === activeQrTab));
  }

  document.querySelectorAll('[data-qr-sku]').forEach(b => b.addEventListener('click', () => {
    activeQrSku = b.dataset.qrSku;
    renderQrStage();
    window.K1Analytics?.track('qr_preview_switch', { sku: activeQrSku, tab: activeQrTab, trigger: 'sku' });
  }));
  document.querySelectorAll('[data-qr-tab]').forEach(b => b.addEventListener('click', () => {
    activeQrTab = b.dataset.qrTab;
    renderQrStage();
    window.K1Analytics?.track('qr_preview_switch', { sku: activeQrSku, tab: activeQrTab, trigger: 'tab' });
  }));

  /* ---------- Form Tabs, Pre-Selection & CSV Export ---------- */
  function switchFormTab(tab) {
    document.querySelectorAll('[data-form-tab]').forEach(b => {
      const on = b.dataset.formTab === tab;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', String(on));
    });
    document.querySelectorAll('.form-pane').forEach(p => p.classList.toggle('active', p.id === `pane-${tab}`));
  }
  document.querySelectorAll('[data-form-tab]').forEach(b => b.addEventListener('click', () => switchFormTab(b.dataset.formTab)));

  document.querySelectorAll('[data-reserve-flavor]').forEach(btn => {
    btn.addEventListener('click', () => {
      switchFormTab('b2c');
      const cb = document.querySelector(`input[name="flavors"][value="${btn.dataset.reserveFlavor}"]`);
      if (cb) cb.checked = true;
      document.getElementById('validate')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-open-b2b]').forEach(btn => {
    btn.addEventListener('click', () => {
      switchFormTab('b2b');
      document.getElementById('validate')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Pre-select flavor if arriving from unified recipe app (?flavor=bulgogi)
  const params = new URLSearchParams(window.location.search);
  const preFlavor = params.get('flavor');
  if (preFlavor) {
    const cb = document.querySelector(`input[name="flavors"][value="${preFlavor}"]`);
    if (cb) cb.checked = true;
  }

  function loadSubs() {
    try { return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '[]'); } catch { return []; }
  }
  function updateCount() {
    const pill = document.getElementById('liveCountPill');
    if (!pill) return;
    const lang = window.K1I18n ? window.K1I18n.language : 'ko';
    const suf = { ko: '건 기록됨', en: 'recorded', ja: '件記録', zh: '条记录' }[lang] || 'recorded';
    pill.textContent = `${loadSubs().length} ${suf}`;
  }
  function saveSub(entry) {
    const list = loadSubs();
    list.push(entry);
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(list));
    updateCount();
  }
  function withAttribution(entry) {
    const attr = window.K1Analytics && typeof window.K1Analytics.getAttribution === 'function'
      ? window.K1Analytics.getAttribution()
      : { utm_source: '', utm_medium: '', utm_campaign: '', utm_content: '', referrer: document.referrer || '', page_url: window.location.href };
    return Object.assign({}, attr, entry);
  }
  async function syncWebhook(entry) {
    const payload = withAttribution(entry);
    if (!CONFIG.FORM_ENDPOINT) return payload;
    try {
      await fetch(CONFIG.FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
    } catch {}
    return payload;
  }
  function setFeedback(id, type, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = `form-feedback ${type}`;
    el.textContent = msg;
  }

  document.getElementById('pane-b2c')?.addEventListener('submit', async e => {
    e.preventDefault();
    const lang = window.K1I18n ? window.K1I18n.language : 'ko';
    const f = e.currentTarget;
    const name = f.querySelector('#b2cName').value.trim();
    const email = f.querySelector('#b2cEmail').value.trim();
    const flavors = Array.from(f.querySelectorAll('input[name="flavors"]:checked')).map(i => i.value);
    const segment = f.querySelector('#b2cSegment').value;
    const pack = f.querySelector('#b2cPack').value;
    const price = f.querySelector('#b2cPrice').value;
    const consent = f.querySelector('#b2cConsent').checked;

    if (!email || !email.includes('@')) return setFeedback('b2cFeedback', 'err', lang === 'ko' ? '올바른 이메일을 입력해 주세요.' : 'Please enter a valid email.');
    if (!flavors.length) return setFeedback('b2cFeedback', 'err', lang === 'ko' ? '핵심 맛을 1개 이상 선택해 주세요.' : 'Select at least one flavor.');
    if (!consent) return setFeedback('b2cFeedback', 'err', lang === 'ko' ? '안내 수신 동의에 체크해 주세요.' : 'Please confirm consent.');

    const labels = {
      bulgogi: window.K1I18n?.t('f.bulgogi') || '불고기',
      tteokbokki: window.K1I18n?.t('f.tteokbokki') || '떡볶이',
      kimchi: window.K1I18n?.t('f.kimchi') || '김치찌개'
    };
    const readable = flavors.map(x => labels[x] || x).join(', ');
    const entry = withAttribution({
      type: 'B2C_PREORDER',
      timestamp: new Date().toISOString(),
      language: lang,
      name: name || '-',
      email,
      flavors: readable,
      segment,
      pack,
      price: price || '-'
    });
    saveSub(entry);
    window.K1Analytics?.track('preorder_submit', {
      flavors: flavors.join(','),
      segment,
      pack,
      price: price || '-',
      language: lang
    });
    await syncWebhook(entry);

    setFeedback('b2cFeedback', 'ok', {
      ko: `6개입 샘플러 사전예약이 접수되었습니다! (${email} · 선택 맛: ${readable})`,
      en: `6-Stick Sampler pre-order recorded! (${email} · ${readable})`,
      ja: `6本サンプラーの先行予約を受け付けました！（${email} · ${readable}）`,
      zh: `6条尝鲜盒预订已登记！（${email} · ${readable}）`
    }[lang]);
    f.reset();
  });

  document.getElementById('pane-b2b')?.addEventListener('submit', async e => {
    e.preventDefault();
    const lang = window.K1I18n ? window.K1I18n.language : 'ko';
    const f = e.currentTarget;
    const company = f.querySelector('#b2bCompany').value.trim();
    const contact = f.querySelector('#b2bContact').value.trim();
    const email = f.querySelector('#b2bEmail').value.trim();
    const category = f.querySelector('#b2bCategory').value;
    const message = f.querySelector('#b2bMessage').value.trim();

    if (!company || !contact || !email) return setFeedback('b2bFeedback', 'err', lang === 'ko' ? '회사명, 담당자명, 연락처를 입력해 주세요.' : 'Please fill in all required fields.');

    const entry = withAttribution({
      type: 'B2B_SUPPLIER',
      timestamp: new Date().toISOString(),
      language: lang,
      company,
      contact,
      email,
      category,
      message: message || '-'
    });
    saveSub(entry);
    window.K1Analytics?.track('b2b_submit', {
      category,
      language: lang
    });
    await syncWebhook(entry);

    setFeedback('b2bFeedback', 'ok', {
      ko: `${company} 담당자님, B2B·공급 협업 문의가 정상 접수되었습니다.`,
      en: `Thank you, ${contact} (${company}). Your B2B inquiry has been recorded.`,
      ja: `${company}様、B2B協業のお問い合わせを受け付けました。`,
      zh: `感谢 ${company} 的合作咨询，我们已记录您的信息！`
    }[lang]);
    f.reset();
  });

  document.getElementById('exportCsvBtn')?.addEventListener('click', () => {
    const list = loadSubs();
    const lang = window.K1I18n ? window.K1I18n.language : 'ko';
    if (!list.length) {
      alert(lang === 'ko' ? '아직 기록된 사전예약/문의 데이터가 없습니다.' : 'No validation responses recorded yet.');
      return;
    }
    const headers = [
      'type', 'timestamp', 'language', 'name', 'company', 'contact', 'email',
      'flavors', 'segment', 'pack', 'price', 'category', 'message',
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'referrer', 'page_url'
    ];
    const esc = v => `"${String(v ?? '').replaceAll('"', '""')}"`;
    const csv = [headers.join(','), ...list.map(r => headers.map(h => esc(r[h])).join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `k1_validation_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const a = item.querySelector('.faq-a');
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      a.style.maxHeight = open ? `${a.scrollHeight}px` : '0px';
    });
  });

  /* ---------- Init ---------- */
  renderPkgStage();
  renderQrStage();
  updateCount();
  document.addEventListener('k1:language', () => { renderPkgStage(); renderQrStage(); updateCount(); });
})();
