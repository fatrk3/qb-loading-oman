--[[
    ════════════════════════════════════════════════════════════════════
      qb-loading-oman  ·  شاشة تحميل اليوم الوطني العُماني
      النسخة 1.0.0  ·  متوافقة مع QBCore وأي إطار عمل آخر
    ════════════════════════════════════════════════════════════════════
      كل ما تحتاج تعديله موجود في هذا الملف فقط.
      احفظ الملف بترميز UTF-8 عشان تظهر العربية صح.
    ════════════════════════════════════════════════════════════════════
--]]

-- ── الهوية ─────────────────────────────────────────────────────────
Config.ServerName      = 'عُمان رول بلاي'          -- اسم السيرفر في الأعلى
Config.Version         = '1.0.0'
Config.DefaultLanguage = 'ar'                      -- 'ar' عربي | 'en' إنجليزي

-- ── الألوان (HEX) ──────────────────────────────────────────────────
Config.Theme = {
    red   = '#CE1126',      -- أحمر العلم
    green = '#0B7A3E',      -- أخضر العلم
    gold  = '#E3B95B',      -- الذهبي (اللون الأساسي للواجهة)
    bg    = '#05070A',      -- خلفية الاحتياط
}

-- ── العدّاد التنازلي لليوم الوطني ───────────────────────────────────
-- اليوم الوطني في سلطنة عُمان: 18 نوفمبر
Config.Countdown = {
    enabled         = true,
    month           = 11,
    day             = 18,
    celebrationDays = 2,     -- عدد أيام حالة الاحتفال بعد التاريخ
    startYear       = 1970,  -- سنة انطلاق النهضة (لحساب رقم اليوم)
}

-- ── الخلفيات ───────────────────────────────────────────────────────
Config.Backgrounds = {
    interval = 9000,         -- مدة بقاء كل خلفية (مللي ثانية)
    images = {
        'img/bg-fort.jpg',
        'img/bg-mosque.jpg',
        'img/bg-dhow.jpg',
        'img/bg-silk.jpg',
    },
}

-- ── حسابات التواصل ─────────────────────────────────────────────────
-- الأيقونات المتاحة: discord | youtube | tiktok | instagram | x | globe
-- اترك url فاضي '' لإخفاء الزر.
Config.Socials = {
    { icon = 'discord',   label = 'Discord',   url = 'https://discord.gg/YOUR-INVITE' },
    { icon = 'youtube',   label = 'YouTube',   url = 'https://youtube.com/@YOUR-CHANNEL' },
    { icon = 'tiktok',    label = 'TikTok',    url = 'https://tiktok.com/@YOUR-ACCOUNT' },
    { icon = 'instagram', label = 'Instagram', url = '' },
}

-- ── نصائح تظهر بالأسفل (تُبدَّل تلقائيًا) ───────────────────────────
Config.Tips = {
    { ar = 'قلعة نزوى بُنيت في القرن السابع عشر، وتُعدّ من أضخم قلاع عُمان وأقدمها.',
      en = 'Nizwa Fort was built in the 17th century and is one of Oman\'s oldest and grandest forts.' },
    { ar = 'الخنجر العُماني رمز للفخر والهوية، ويظهر على العلم الوطني.',
      en = 'The khanjar is a symbol of Omani pride and identity, and it appears on the national flag.' },
    { ar = 'عُمان من أقدم الأمم البحرية في المحيط الهندي، واشتهرت بسفن الداو.',
      en = 'Oman is one of the oldest maritime nations of the Indian Ocean, famous for its dhows.' },
    { ar = 'اللبان العُماني من أجود أنواع اللبان في العالم، ويُستخرج من أشجار ظفار.',
      en = 'Omani frankincense is among the finest in the world, harvested from the trees of Dhofar.' },
    { ar = 'الجامع الأكبر في مسقط يتسع لأكثر من عشرين ألف مُصلٍّ.',
      en = 'The Sultan Qaboos Grand Mosque in Muscat holds more than 20,000 worshippers.' },
    { ar = 'جبل شمس أعلى قمم عُمان، ويرتفع نحو ثلاثة آلاف متر.',
      en = 'Jebel Shams is Oman\'s highest peak, rising nearly 3,000 metres.' },
    { ar = 'قلعة بهلاء مدرجة في قائمة التراث العالمي لليونسكو منذ عام 1987.',
      en = 'Bahla Fort has been a UNESCO World Heritage Site since 1987.' },
    { ar = 'القهوة العُمانية والحلوى العُمانية من أبرز عادات الضيافة في السلطنة.',
      en = 'Omani coffee and halwa are at the heart of Omani hospitality.' },
}

-- ── رسائل حالة التحميل (تُبدَّل أثناء التحميل) ──────────────────────
Config.StatusMessages = {
    { ar = 'جارٍ تجهيز العالم…',       en = 'Preparing the world…' },
    { ar = 'تحميل الموارد…',           en = 'Loading assets…' },
    { ar = 'تجهيز المدن والمركبات…',   en = 'Streaming cities and vehicles…' },
    { ar = 'مزامنة بيانات السيرفر…',   en = 'Syncing server data…' },
    { ar = 'اللمسات الأخيرة…',          en = 'Final touches…' },
}

Config.ReadyMessage = { ar = 'أهلًا بك، جاهزون للانطلاق', en = 'Welcome — you are ready to go' }

-- ── الموسيقى ───────────────────────────────────────────────────────
-- مقطعان مرفقان داخل html/audio/:
--   m1.mp3 = «يا عمان حن لك فداء» — أسعد البطحري   (المقطع النشِط)
--   m2.mp3 = «احكم سلاطين الأرض» — محمد بن غرمان
-- بدّل القيمة إلى 'audio/m2.mp3' لتشغيل الثاني.
-- تنبيه: المقطعان محميّان بحقوق، استخدم مقطعًا تملك حقوقه قبل النشر العام.
Config.Music = {
    enabled  = true,
    file     = 'audio/m1.mp3',
    tracks   = { 'audio/m1.mp3', 'audio/m2.mp3' },  -- لتبديل المقاطع من الواجهة
    volume   = 0.30,   -- من 0.0 إلى 1.0
    autoplay = true,
}

-- ── عناصر الواجهة ──────────────────────────────────────────────────
Config.UI = {
    playerName     = true,   -- ترحيب باسم اللاعب
    playerCount    = true,   -- عدد اللاعبين المتصلين
    status         = true,   -- حالة السيرفر
    languageToggle = true,   -- زر تبديل اللغة
    musicToggle    = true,   -- زر الموسيقى
    fireworks      = true,   -- الألعاب النارية والغبار الذهبي
}
