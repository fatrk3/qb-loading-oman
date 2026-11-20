fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'qb-loading-oman'
author 'Your Name'
description 'Oman National Day loading screen for QBCore'
version '1.0.0'

loadscreen 'html/index.html'
-- لا نفعّل الإغلاق اليدوي: FiveM يغلق الشاشة تلقائيًا عند اكتمال التحميل،
-- وهذا مهم في QBCore عشان تظهر شاشة اختيار الشخصية (Multicharacter).
-- لو تبي تحكم بالإغلاق من client.lua فعّل السطر التالي:
-- loadscreen_manual_shutdown 'yes'

shared_script 'config.lua'

client_script 'client.lua'
server_script 'server.lua'

files {
    'html/index.html',
    'html/css/style.css',
    'html/js/app.js',
    'html/img/*.jpg',
    'html/img/*.png',
    'html/fonts/*.woff2',
    'html/audio/*',
}
