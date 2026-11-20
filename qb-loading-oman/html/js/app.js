(() => {
    'use strict';

    /* ── أدوات ─────────────────────────────────────────────────── */
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const pad2 = (value) => String(value).padStart(2, '0');

    const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── النصوص الثابتة ────────────────────────────────────────── */
    const I18N = {
        ar: {
            dir: 'rtl',
            htmlLang: 'ar',
            langLabel: 'EN',
            brandSub: 'اليوم الوطني العُماني',
            eyebrow: 'سلطنة عُمان · الثامن عشر من نوفمبر',
            titleA: 'اليوم عُمان',
            titleB: 'الوطني',
            subtitle: 'في الثامن عشر من نوفمبر انطلقت مسيرة النهضة الحديثة… فكل عام وعُمان في عزٍّ ومجد.',
            countdownTitle: 'باقٍ على اليوم الـ{n}',
            days: 'يوم',
            hours: 'ساعة',
            minutes: 'دقيقة',
            seconds: 'ثانية',
            celebration: 'كل عام وعُمان بخير',
            celebrationSub: 'اليوم الوطني الـ{n}',
            welcome: 'مرحبًا بك',
            loading: 'جارٍ التحميل…',
            tipLabel: 'هل تعلم؟',
            online: 'السيرفر متصل',
            players: 'لاعب',
            musicPlay: 'تشغيل الموسيقى',
            musicMute: 'كتم الموسيقى',
            trackSwitch: 'تبديل المقطع',
            langSwitch: 'تبديل اللغة',
        },
        en: {
            dir: 'ltr',
            htmlLang: 'en',
            langLabel: 'ع',
            brandSub: 'OMANI NATIONAL DAY',
            eyebrow: 'SULTANATE OF OMAN · 18 NOVEMBER',
            titleA: 'OMAN',
            titleB: 'NATIONAL DAY',
            subtitle: 'On the 18th of November, the modern renaissance began. May Oman always stand proud.',
            countdownTitle: 'COUNTDOWN TO THE {n} NATIONAL DAY',
            days: 'DAYS',
            hours: 'HOURS',
            minutes: 'MINUTES',
            seconds: 'SECONDS',
            celebration: 'HAPPY NATIONAL DAY, OMAN',
            celebrationSub: 'The {n} National Day',
            welcome: 'WELCOME',
            loading: 'LOADING…',
            tipLabel: 'DID YOU KNOW?',
            online: 'SERVER ONLINE',
            players: 'players',
            musicPlay: 'Play music',
            musicMute: 'Mute music',
            trackSwitch: 'Switch track',
            langSwitch: 'Switch language',
        },
    };

    /* ── إعدادات احتياطية (تُستخدم فقط خارج FiveM) ─────────────── */
    const DEFAULT_CONFIG = {
        serverName: 'OMAN ROLEPLAY',
        version: '1.0.0',
        lang: 'ar',
        theme: { red: '#CE1126', green: '#0B7A3E', gold: '#E3B95B', bg: '#05070A' },
        countdown: { enabled: true, month: 11, day: 18, celebrationDays: 2, startYear: 1970 },
        backgrounds: {
            interval: 9000,
            images: ['img/bg-fort.jpg', 'img/bg-mosque.jpg', 'img/bg-dhow.jpg', 'img/bg-silk.jpg'],
        },
        socials: [
            { icon: 'discord', label: 'Discord', url: 'https://discord.gg/your-invite' },
            { icon: 'youtube', label: 'YouTube', url: 'https://youtube.com/@your-channel' },
            { icon: 'tiktok', label: 'TikTok', url: 'https://tiktok.com/@your-account' },
        ],
        tips: [
            { ar: 'قلعة نزوى بُنيت في القرن السابع عشر، وتُعدّ من أضخم قلاع عُمان وأقدمها.',
              en: 'Nizwa Fort was built in the 17th century and is one of Oman’s oldest and grandest forts.' },
            { ar: 'الخنجر العُماني رمز للفخر والهوية، ويظهر على العلم الوطني.',
              en: 'The khanjar is a symbol of Omani pride and identity, and it appears on the national flag.' },
            { ar: 'عُمان من أقدم الأمم البحرية في المحيط الهندي، واشتهرت بسفن الداو.',
              en: 'Oman is one of the oldest maritime nations of the Indian Ocean, famous for its dhows.' },
            { ar: 'اللبان العُماني من أجود أنواع اللبان في العالم، ويُستخرج من أشجار ظفار.',
              en: 'Omani frankincense is among the finest in the world, harvested from the trees of Dhofar.' },
        ],
        statusMessages: [
            { ar: 'جارٍ تجهيز العالم…', en: 'Preparing the world…' },
            { ar: 'تحميل الموارد…', en: 'Loading assets…' },
            { ar: 'اللمسات الأخيرة…', en: 'Final touches…' },
        ],
        readyMessage: { ar: 'أهلًا بك، جاهزون للانطلاق', en: 'Welcome — you are ready to go' },
        music: { enabled: true, file: 'audio/m1.mp3', tracks: ['audio/m1.mp3', 'audio/m2.mp3'], volume: 0.3, autoplay: true },
        ui: {
            playerName: true,
            playerCount: true,
            status: true,
            languageToggle: true,
            musicToggle: true,
            fireworks: true,
        },
    };

    /* ── الحالة ────────────────────────────────────────────────── */
    const state = {
        lang: 'ar',
        config: {},
        userChoseLang: false,
        socialSig: '',
        bgSig: '',
        musicSig: '',
        tips: [],
        tipsSig: '',
        tipIndex: 0,
        tipToken: 0,
        statusMessages: [],
        statusSig: '',
        statusIndex: 0,
        statusToken: 0,
        statusFrozen: false,
        progress: 0,
        target: 0,
        ready: false,
        lastPct: -1,
        startedAt: performance.now(),
        playerName: '',
        players: null,
        maxPlayers: 0,
        musicTracks: [],
        trackIndex: 0,
    };

    let audioEl = null;
    let audioFaded = false;

    /* ── مساعدات النص ──────────────────────────────────────────── */
    function t(key) {
        const dict = I18N[state.lang] || I18N.ar;
        const value = dict[key] != null ? dict[key] : I18N.ar[key];
        return value != null ? value : key;
    }

    function localize(entry) {
        if (!entry) return '';
        return entry[state.lang] || entry.ar || entry.en || '';
    }

    function num(value) {
        const text = String(value);
        if (state.lang !== 'ar') return text;
        return text.replace(/[0-9]/g, (digit) => AR_DIGITS[Number(digit)]);
    }

    function ordinalEn(n) {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    }

    function ordinalFor(n) {
        return state.lang === 'ar' ? num(n) : ordinalEn(n);
    }

    function deepMerge(base, extra) {
        if (Array.isArray(extra)) return extra.slice();
        if (!extra || typeof extra !== 'object') return base;
        const out = base && typeof base === 'object' && !Array.isArray(base) ? { ...base } : {};
        for (const key of Object.keys(extra)) {
            const value = extra[key];
            out[key] = value && typeof value === 'object' && !Array.isArray(value)
                ? deepMerge(out[key], value)
                : value;
        }
        return out;
    }

    /* ── اللغة ─────────────────────────────────────────────────── */
    function applyLang(lang, persist) {
        state.lang = lang === 'en' ? 'en' : 'ar';
        const dict = I18N[state.lang];

        root.lang = dict.htmlLang;
        root.dir = dict.dir;

        $$('[data-i18n]').forEach((el) => {
            const key = el.dataset.i18n;
            if (dict[key] != null) el.textContent = dict[key];
        });

        const langBtn = $('#langBtn');
        $('#langLabel').textContent = dict.langLabel;
        langBtn.title = dict.langSwitch;
        langBtn.setAttribute('aria-label', dict.langSwitch);

        const musicBtn = $('#musicBtn');
        musicBtn.title = audioEl && !audioEl.paused ? dict.musicMute : dict.musicPlay;
        musicBtn.setAttribute('aria-label', musicBtn.title);

        const trackBtn = $('#trackBtn');
        if (trackBtn) {
            trackBtn.title = dict.trackSwitch;
            trackBtn.setAttribute('aria-label', trackBtn.title);
        }

        renderSocials();
        renderTip(false);
        renderStatus(false);
        renderPlayerCount();
        updateCountdown();

        if (persist) {
            try { localStorage.setItem('omLoading.lang', state.lang); } catch (e) { /* ignore */ }
        }
    }

    /* ── الخلفيات ──────────────────────────────────────────────── */
    function setupBackgrounds() {
        const cfg = state.config.backgrounds || {};
        const images = Array.isArray(cfg.images) ? cfg.images.filter(Boolean) : [];
        if (!images.length) return;

        const sig = JSON.stringify(images) + '|' + cfg.interval;
        if (sig === state.bgSig) return;
        state.bgSig = sig;

        images.forEach((src) => {
            const img = new Image();
            img.src = src;
        });

        const layers = $$('#bgStack .bg');
        if (!layers.length) return;

        layers.forEach((layer, index) => {
            if (index < images.length) {
                layer.style.backgroundImage = 'url("' + images[index] + '")';
                layer.hidden = false;
            } else {
                layer.hidden = true;
            }
            layer.classList.remove('is-active');
        });

        let index = 0;
        layers[index].classList.add('is-active');

        if (state.bgTimer) clearInterval(state.bgTimer);
        const visible = Math.min(images.length, layers.length);
        if (visible < 2) return;

        const interval = clamp(Number(cfg.interval) || 9000, 3000, 60000);
        state.bgTimer = window.setInterval(() => {
            layers[index].classList.remove('is-active');
            index = (index + 1) % visible;
            layers[index].classList.add('is-active');
        }, interval);
    }

    /* ── التواصل ───────────────────────────────────────────────── */
    const SOCIAL_ICONS = new Set(['discord', 'youtube', 'tiktok', 'instagram', 'x', 'globe']);

    function renderSocials() {
        const host = $('#socials');
        const list = Array.isArray(state.config.socials)
            ? state.config.socials.filter((item) => item && item.url)
            : [];

        const sig = state.lang + '|' + JSON.stringify(list);
        if (sig === state.socialSig) return;
        state.socialSig = sig;

        host.innerHTML = '';
        host.hidden = list.length === 0;

        list.forEach((item) => {
            const icon = SOCIAL_ICONS.has(item.icon) ? item.icon : 'globe';
            const link = document.createElement('a');
            link.className = 'social';
            link.href = item.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.title = item.label || '';
            link.setAttribute('aria-label', item.label || 'Link');
            link.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-' + icon + '"/></svg>';
            link.addEventListener('click', (event) => {
                event.preventDefault();
                try { window.open(item.url, '_blank', 'noopener'); } catch (e) { /* ignore */ }
            });
            host.appendChild(link);
        });
    }

    /* ── النصائح ورسائل الحالة ─────────────────────────────────── */
    function renderTip(fade) {
        const el = $('#tipText');
        if (!state.tips.length) {
            el.textContent = '';
            return;
        }
        const text = localize(state.tips[state.tipIndex % state.tips.length]);
        const token = ++state.tipToken;

        if (!fade) {
            el.textContent = text;
            el.classList.remove('is-out');
            return;
        }

        el.classList.add('is-out');
        window.setTimeout(() => {
            if (token !== state.tipToken) return;
            el.textContent = text;
            el.classList.remove('is-out');
        }, 240);
    }

    function renderStatus(fade) {
        if (state.statusFrozen) return;
        const el = $('#statusText');
        if (!state.statusMessages.length) return;

        const text = localize(state.statusMessages[state.statusIndex % state.statusMessages.length]);
        const token = ++state.statusToken;

        if (!fade) {
            el.textContent = text;
            el.classList.remove('is-out');
            return;
        }

        el.classList.add('is-out');
        window.setTimeout(() => {
            if (token !== state.statusToken) return;
            el.textContent = text;
            el.classList.remove('is-out');
        }, 240);
    }

    function setStatusText(text) {
        const el = $('#statusText');
        const token = ++state.statusToken;
        el.classList.add('is-out');
        window.setTimeout(() => {
            if (token !== state.statusToken) return;
            el.textContent = text;
            el.classList.remove('is-out');
        }, 240);
    }

    /* ── اللاعبون ──────────────────────────────────────────────── */
    function setPlayerName(name) {
        state.playerName = String(name || '').trim();
        const el = $('#playerName');
        if (!state.playerName || (state.config.ui || {}).playerName === false) {
            el.hidden = true;
            return;
        }
        el.hidden = false;
        el.textContent = state.playerName;
    }

    function setStats(players, maxPlayers) {
        state.players = Number(players);
        state.maxPlayers = Number(maxPlayers) || 0;
        renderPlayerCount();
    }

    function renderPlayerCount() {
        const chip = $('#playerCount');
        if ((state.config.ui || {}).playerCount === false || state.players == null || Number.isNaN(state.players)) {
            chip.hidden = true;
            return;
        }
        chip.hidden = false;
        $('#playerCountText').textContent = state.maxPlayers
            ? num(state.players) + ' / ' + num(state.maxPlayers)
            : num(state.players);
        chip.title = t('players');
    }

    /* ── العدّاد التنازلي ──────────────────────────────────────── */
    const OMAN_OFFSET = 4 * 3600 * 1000; // توقيت عُمان UTC+4 بدون توقيت صيفي
    const DAY_MS = 86400000;

    function updateCountdown() {
        const wrap = $('#countdownWrap');
        const cfg = state.config.countdown || {};

        if (cfg.enabled === false) {
            wrap.hidden = true;
            return;
        }
        wrap.hidden = false;

        const month = clamp(Number(cfg.month) || 11, 1, 12);
        const day = clamp(Number(cfg.day) || 18, 1, 31);
        const celebrationDays = Math.max(1, Number(cfg.celebrationDays) || 1);

        const now = Date.now() + OMAN_OFFSET;
        let year = new Date(now).getUTCFullYear();
        let start = Date.UTC(year, month - 1, day);

        if (now >= start + celebrationDays * DAY_MS) {
            year += 1;
            start = Date.UTC(year, month - 1, day);
        }

        const ordinal = year - (Number(cfg.startYear) || 1970);
        const celebrating = now >= start && now < start + celebrationDays * DAY_MS;

        $('#countdown').hidden = celebrating;
        $('#cdTitle').hidden = celebrating;
        $('#celebration').hidden = !celebrating;

        if (celebrating) {
            $('#celebrationSub').textContent =
                t('celebrationSub').replace('{n}', ordinalFor(ordinal));
            return;
        }

        $('#cdTitle').textContent = t('countdownTitle').replace('{n}', ordinalFor(ordinal));

        const diff = Math.max(0, start - now);
        const days = Math.floor(diff / DAY_MS);
        const hours = Math.floor((diff % DAY_MS) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        $('#cdDays').textContent = num(pad2(days));
        $('#cdHours').textContent = num(pad2(hours));
        $('#cdMinutes').textContent = num(pad2(minutes));
        $('#cdSeconds').textContent = num(pad2(seconds));
    }

    /* ── التقدّم ───────────────────────────────────────────────── */
    function progressLoop() {
        const elapsed = (performance.now() - state.startedAt) / 1000;

        if (state.ready) {
            state.target = 100;
        } else {
            const cap = 93 * (1 - Math.exp(-elapsed / 6.5));
            if (cap > state.target) state.target = cap;
        }

        state.progress += (state.target - state.progress) * 0.06;
        if (state.target - state.progress < 0.08) state.progress = state.target;

        $('#progressFill').style.width = state.progress.toFixed(2) + '%';

        const pct = Math.floor(state.progress);
        if (pct !== state.lastPct) {
            state.lastPct = pct;
            $('#progressPct').textContent = num(pct) + '%';
        }

        window.requestAnimationFrame(progressLoop);
    }

    function markReady() {
        if (state.ready) return;
        state.ready = true;
        state.target = 100;
        state.statusFrozen = true;
        const message = state.config.readyMessage;
        if (message) setStatusText(localize(message));
    }

    /* ── الموسيقى ──────────────────────────────────────────────── */
    function attemptPlay() {
        if (!audioEl) return;
        audioEl.autoplay = true;
        audioEl.preload = 'auto';
        const promise = audioEl.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(() => {
                // If autoplay is blocked, start on the first available interaction.
                const start = () => { audioEl.play().catch(() => {}); };
                ['pointerdown', 'pointermove', 'mousemove', 'keydown', 'touchstart', 'wheel'].forEach((eventName) => {
                    document.addEventListener(eventName, start, { once: true, passive: true });
                });
            });
        }
    }

    function fadeInAudio() {
        if (audioFaded || !audioEl) return;
        audioFaded = true;

        const target = audioEl.volume;
        const started = performance.now();
        audioEl.volume = 0;

        const timer = window.setInterval(() => {
            if (!audioEl) { clearInterval(timer); return; }
            if (audioEl.paused) {
                audioEl.volume = target;
                clearInterval(timer);
                return;
            }
            const k = Math.min(1, (performance.now() - started) / 1600);
            audioEl.volume = target * k;
            if (k >= 1) {
                audioEl.volume = target;
                clearInterval(timer);
            }
        }, 50);
    }

    function setupMusic() {
        const cfg = state.config;
        const music = cfg.music || {};
        const ui = cfg.ui || {};
        const btn = $('#musicBtn');
        const slider = $('#volumeSlider');
        const trackBtn = $('#trackBtn');

        const enabled = music.enabled !== false && ui.musicToggle !== false;
        const tracks = Array.isArray(music.tracks) && music.tracks.filter(Boolean).length
            ? music.tracks.filter(Boolean)
            : [music.file || 'audio/m1.mp3'];
        state.musicTracks = tracks;
        if (music.file && tracks.indexOf(music.file) >= 0) state.trackIndex = tracks.indexOf(music.file);
        else if (state.trackIndex >= tracks.length) state.trackIndex = 0;

        const sig = [enabled, music.file, tracks.join(','), music.volume, music.autoplay].join('|');

        if (!enabled) {
            btn.hidden = true;
            if (slider) slider.hidden = true;
            if (trackBtn) trackBtn.hidden = true;
            if (audioEl) audioEl.pause();
            state.musicSig = sig;
            return;
        }

        if (state.musicSig === sig && audioEl) {
            btn.hidden = false;
            if (slider) slider.hidden = false;
            if (trackBtn) trackBtn.hidden = tracks.length < 2;
            return;
        }
        state.musicSig = sig;

        if (!audioEl) {
            audioEl = $('#theme');
            audioEl.addEventListener('error', () => { btn.hidden = true; if (slider) slider.hidden = true; if (trackBtn) trackBtn.hidden = true; });
            audioEl.addEventListener('loadeddata', () => { attemptPlay(); });
            audioEl.addEventListener('canplay', () => {
                btn.hidden = false;
                if (slider) slider.hidden = false;
                if (trackBtn) trackBtn.hidden = state.musicTracks.length < 2;
                attemptPlay();
            });
            audioEl.addEventListener('playing', () => {
                btn.hidden = false;
                if (slider) slider.hidden = false;
                if (trackBtn) trackBtn.hidden = state.musicTracks.length < 2;
                btn.dataset.on = 'true';
                btn.title = t('musicMute');
                btn.setAttribute('aria-label', btn.title);
                fadeInAudio();
            });
            audioEl.addEventListener('pause', () => {
                btn.dataset.on = 'false';
                btn.title = t('musicPlay');
                btn.setAttribute('aria-label', btn.title);
            });
            btn.addEventListener('click', (event) => {
                event.preventDefault();
                if (!audioEl) return;
                if (audioEl.paused) audioEl.play().catch(() => {});
                else audioEl.pause();
            });
            if (slider && !slider.dataset.bound) {
                slider.dataset.bound = 'true';
                slider.addEventListener('input', () => {
                    if (!audioEl) return;
                    const value = clamp(Number(slider.value) / 100, 0, 1);
                    audioEl.volume = value;
                    if (state.config && state.config.music) state.config.music.volume = value;
                });
            }
            if (trackBtn && !trackBtn.dataset.bound) {
                trackBtn.dataset.bound = 'true';
                trackBtn.title = t('trackSwitch');
                trackBtn.setAttribute('aria-label', trackBtn.title);
                trackBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    switchTrack();
                });
            }
        }

        const initialFile = tracks[state.trackIndex] || music.file || 'audio/m1.mp3';
        audioEl.src = initialFile;
        audioEl.loop = true;
        audioEl.volume = clamp(Number(music.volume == null ? 0.35 : music.volume), 0, 1);
        if (slider) {
            slider.value = Math.round(audioEl.volume * 100);
            slider.hidden = true;
        }
        if (trackBtn) {
            trackBtn.hidden = tracks.length < 2;
            trackBtn.title = t('trackSwitch');
            trackBtn.setAttribute('aria-label', trackBtn.title);
        }
        btn.dataset.on = 'false';
        btn.title = t('musicPlay');
        btn.setAttribute('aria-label', btn.title);
        btn.hidden = true;

        if (music.autoplay !== false) attemptPlay();
    }

    /* ── تبديل المقطع ─────────────────────────────────────────── */
    function switchTrack() {
        if (!audioEl || !state.musicTracks || state.musicTracks.length < 2) return;
        state.trackIndex = (state.trackIndex + 1) % state.musicTracks.length;
        const file = state.musicTracks[state.trackIndex];
        audioFaded = false;
        audioEl.src = file;
        audioEl.loop = true;
        if (state.config && state.config.music) {
            state.config.music.file = file;
            audioEl.volume = clamp(Number(state.config.music.volume == null ? 0.3 : state.config.music.volume), 0, 1);
        }
        const slider = $('#volumeSlider');
        if (slider) slider.value = Math.round(audioEl.volume * 100);
        state.musicSig = [true, file, state.musicTracks.join(','), audioEl.volume, state.config.music.autoplay].join('|');
        audioEl.play().catch(() => {});
    }

    /* ── الجزيئات والألعاب النارية ─────────────────────────────── */
    function initFX() {
        const canvas = $('#fx');
        const ctx = canvas ? canvas.getContext('2d') : null;
        if (!ctx || reduceMotion) {
            if (canvas) canvas.style.display = 'none';
            return;
        }

        let width = 0;
        let height = 0;
        let dust = [];
        let sparks = [];
        let last = performance.now();
        let nextBurst = 2600;

        function palette() {
            const theme = state.config.theme || {};
            return [theme.red || '#CE1126', theme.green || '#0B7A3E', theme.gold || '#E3B95B', '#FFFFFF'];
        }

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.round(clamp(width / 26, 26, 70));
            if (dust.length !== count) {
                dust = [];
                for (let i = 0; i < count; i++) {
                    dust.push({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        r: 0.5 + Math.random() * 1.3,
                        vy: -(0.08 + Math.random() * 0.2),
                        sway: Math.random() * Math.PI * 2,
                        swaySpeed: 0.0004 + Math.random() * 0.0007,
                        alpha: 0.05 + Math.random() * 0.2,
                    });
                }
            }
        }

        function burst(x, y) {
            const colors = palette();
            const count = 40 + Math.floor(Math.random() * 24);
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1.1 + Math.random() * 4.4;
                sparks.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 0,
                    max: 1.1 + Math.random() * 1.2,
                    color: colors[(Math.random() * colors.length) | 0],
                    r: 0.9 + Math.random() * 1.6,
                });
            }
            if (sparks.length > 420) sparks.splice(0, sparks.length - 420);
        }

        function loop(now) {
            const dt = Math.min(48, now - last);
            last = now;

            ctx.clearRect(0, 0, width, height);

            if ((state.config.ui || {}).fireworks === false) {
                window.requestAnimationFrame(loop);
                return;
            }

            ctx.globalCompositeOperation = 'lighter';
            const gold = palette()[2];
            const step = dt / 16;

            for (const p of dust) {
                p.y += p.vy * step;
                p.sway += p.swaySpeed * dt;
                if (p.y < -12) {
                    p.y = height + 12;
                    p.x = Math.random() * width;
                }
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = gold;
                ctx.beginPath();
                ctx.arc(p.x + Math.sin(p.sway) * 14, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }

            for (let i = sparks.length - 1; i >= 0; i--) {
                const s = sparks[i];
                s.life += dt / 1000;
                if (s.life >= s.max) {
                    sparks.splice(i, 1);
                    continue;
                }
                s.vy += 0.055 * step;
                s.vx *= 0.988;
                s.vy *= 0.988;
                s.x += s.vx * step;
                s.y += s.vy * step;

                const fade = 1 - s.life / s.max;
                ctx.globalAlpha = Math.max(0, fade * fade);
                ctx.fillStyle = s.color;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r * (0.5 + fade * 0.7), 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalAlpha = 1;

            nextBurst -= dt;
            if (nextBurst <= 0) {
                nextBurst = 5200 + Math.random() * 5200;
                burst(width * (0.15 + Math.random() * 0.7), height * (0.12 + Math.random() * 0.32));
            }

            window.requestAnimationFrame(loop);
        }

        window.addEventListener('resize', resize);
        document.addEventListener('visibilitychange', () => { last = performance.now(); });
        resize();
        window.requestAnimationFrame(loop);
    }

    /* ── تطبيق الإعدادات ──────────────────────────────────────── */
    function applyConfig(input) {
        if (!input || typeof input !== 'object') return;

        state.config = deepMerge(state.config, input);
        const cfg = state.config;

        const theme = cfg.theme || {};
        if (theme.red) root.style.setProperty('--red', theme.red);
        if (theme.green) root.style.setProperty('--green', theme.green);
        if (theme.gold) root.style.setProperty('--gold', theme.gold);
        if (theme.bg) root.style.setProperty('--bg', theme.bg);

        if (cfg.serverName) $('#serverName').textContent = cfg.serverName;
        if (cfg.version) $('#buildVersion').textContent = 'v' + cfg.version;

        if (!state.userChoseLang && cfg.lang) applyLang(cfg.lang, false);

        setupBackgrounds();
        renderSocials();

        state.tips = Array.isArray(cfg.tips) ? cfg.tips.filter(Boolean) : [];
        const tipsSig = JSON.stringify(state.tips);
        if (tipsSig !== state.tipsSig) {
            state.tipsSig = tipsSig;
            state.tipIndex = 0;
            renderTip(false);
        }

        state.statusMessages = Array.isArray(cfg.statusMessages) ? cfg.statusMessages.filter(Boolean) : [];
        const statusSig = JSON.stringify(state.statusMessages);
        if (statusSig !== state.statusSig) {
            state.statusSig = statusSig;
            state.statusIndex = 0;
            renderStatus(false);
        }

        updateCountdown();
        setupMusic();

        const ui = cfg.ui || {};
        $('#langBtn').hidden = ui.languageToggle === false;
        $('#statusChip').hidden = ui.status === false;

        if (ui.playerName === false) {
            $('#playerName').hidden = true;
        } else if (state.playerName) {
            $('#playerName').hidden = false;
        }

        if (ui.playerCount === false) $('#playerCount').hidden = true;
        else renderPlayerCount();
    }

    /* ── استقبال رسائل FiveM ──────────────────────────────────── */
    function normalizeMessage(event) {
        let data = event && event.data !== undefined ? event.data : event;
        if (data == null) return null;

        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch (e) { return null; }
        }

        if (data && typeof data === 'object' && data.message !== undefined) {
            let inner = data.message;
            if (typeof inner === 'string') {
                try { inner = JSON.parse(inner); } catch (e) { return null; }
            }
            if (inner && typeof inner === 'object') data = inner;
        }

        return data && typeof data === 'object' ? data : null;
    }

    window.addEventListener('message', (event) => {
        const message = normalizeMessage(event);
        if (!message) return;

        switch (message.type) {
            case 'init':
                applyConfig(message.config);
                break;
            case 'player':
                setPlayerName(message.name);
                break;
            case 'stats':
                setStats(message.players, message.maxPlayers);
                break;
            case 'ready':
                markReady();
                break;
            default:
                break;
        }
    });

    /* ── التشغيل ──────────────────────────────────────────────── */
    function init() {
        let savedLang = null;
        try { savedLang = localStorage.getItem('omLoading.lang'); } catch (e) { /* ignore */ }
        try {
            const fromUrl = new URLSearchParams(window.location.search).get('lang');
            if (fromUrl === 'ar' || fromUrl === 'en') savedLang = fromUrl;
        } catch (e) { /* ignore */ }
        if (savedLang !== 'ar' && savedLang !== 'en') savedLang = null;

        applyConfig(DEFAULT_CONFIG);
        if (savedLang) {
            state.userChoseLang = true;
            applyLang(savedLang, false);
        }

        $('#langBtn').addEventListener('click', () => {
            state.userChoseLang = true;
            applyLang(state.lang === 'ar' ? 'en' : 'ar', true);
        });

        window.setInterval(updateCountdown, 1000);

        window.setInterval(() => {
            if (state.ready || !state.tips.length) return;
            state.tipIndex = (state.tipIndex + 1) % state.tips.length;
            renderTip(true);
        }, 7000);

        window.setInterval(() => {
            if (state.ready || !state.statusMessages.length) return;
            state.statusIndex = (state.statusIndex + 1) % state.statusMessages.length;
            renderStatus(true);
        }, 3200);

        initFX();
        window.requestAnimationFrame(progressLoop);
    }

    init();
})();
