export const DEFAULT_DATA = {
  id: 'root',
  label: 'ALGO GROUP',
  color: '#6366f1',
  x: 0, y: 0,
  children: [
    {
      id: 'logistics',
      label: 'Logistika Turlari',
      color: '#3b82f6',
      children: [
        { id: 'road', label: 'Yo\'l va Yuk Transporti', color: '#3b82f6', children: [
          { id: 'road1', label: 'Truklar bilan tovar yetkazish', color: '#3b82f6', children: [] },
          { id: 'road2', label: 'Yuk mashinalari eng keng tarqalgan', color: '#3b82f6', children: [] },
        ]},
        { id: 'air', label: 'Samolyot Transporti', color: '#3b82f6', children: [
          { id: 'air1', label: 'Tez va qimmat yuklarlar uchun', color: '#3b82f6', children: [] },
          { id: 'air2', label: 'Elektronika, dori va hujjatlar', color: '#3b82f6', children: [] },
        ]},
        { id: 'rail', label: 'Temir Yo\'l Transporti', color: '#3b82f6', children: [
          { id: 'rail1', label: 'Ko\'mir, neft, qishloq xo\'jaligi', color: '#3b82f6', children: [] },
        ]},
        { id: 'sea', label: 'Dengiz Transporti', color: '#3b82f6', children: [
          { id: 'sea1', label: 'Uzoq masofada arzon narx', color: '#3b82f6', children: [] },
          { id: 'sea2', label: 'Eng ko\'p hajmni ko\'taradi', color: '#3b82f6', children: [] },
        ]},
        { id: 'dot', label: 'DOT — Barcha transportni boshqaradi', color: '#3b82f6', children: [
          { id: 'fmcsa', label: 'FMCSA — Truk industryasini boshqaradi', color: '#3b82f6', children: [] },
          { id: 'faa', label: 'FAA — Aviatsiya xavfsizligi', color: '#3b82f6', children: [] },
          { id: 'fra', label: 'FRA — Temir yo\'l xavfsizligi', color: '#3b82f6', children: [] },
        ]},
      ]
    },
    {
      id: 'departments',
      label: 'Departmentlar',
      color: '#10b981',
      children: [
        { id: 'dispatch', label: 'Dispatch', color: '#10b981', children: [
          { id: 'd1', label: 'Haydovchiga yuk topib beradi', color: '#10b981', children: [] },
          { id: 'd2', label: 'Eng yaxshi narxda yuk tanlaydi', color: '#10b981', children: [] },
        ]},
        { id: 'fleet', label: 'Fleet', color: '#10b981', children: [
          { id: 'f1', label: 'Truck nosozligi va ta\'mirlash', color: '#10b981', children: [] },
          { id: 'f2', label: 'Har bir truk holatini kuzatadi', color: '#10b981', children: [] },
        ]},
        { id: 'accounting', label: 'Accounting', color: '#10b981', children: [
          { id: 'a1', label: 'Moliya, ish haqi, xarajatlar', color: '#10b981', children: [] },
          { id: 'a2', label: 'Driver daromadi va soliqlar', color: '#10b981', children: [] },
        ]},
        { id: 'safety', label: 'Safety / ELD', color: '#10b981', children: [
          { id: 's1', label: 'Hujjatlar va ELD xizmati', color: '#10b981', children: [] },
          { id: 's2', label: 'FMCSA qoidalarini nazorat qiladi', color: '#10b981', children: [] },
        ]},
        { id: 'update', label: 'Update Department', color: '#10b981', children: [
          { id: 'u1', label: 'Yuk holati haqida xabar berish', color: '#10b981', children: [] },
          { id: 'u2', label: 'Yukni qabul qilishdan yetkazishgacha', color: '#10b981', children: [] },
        ]},
        { id: 'hr', label: 'HR', color: '#10b981', children: [
          { id: 'hr1', label: 'Ishga olish va xodimlar boshqaruvi', color: '#10b981', children: [] },
        ]},
        { id: 'broker', label: 'Brokerage', color: '#10b981', children: [
          { id: 'b1', label: 'Shipper va carrier o\'rtasida', color: '#10b981', children: [] },
        ]},
      ]
    },
    {
      id: 'hos',
      label: 'HOS Qoidalari',
      color: '#f59e0b',
      children: [
        { id: 'break', label: 'BREAK — 30 daqiqa', color: '#f59e0b', children: [
          { id: 'br1', label: '8 soat haydashdan keyin shart', color: '#f59e0b', children: [] },
          { id: 'br2', label: 'Haydash to\'xtatilishi kerak', color: '#f59e0b', children: [] },
        ]},
        { id: 'drive', label: 'DRIVE — 11 soat', color: '#f59e0b', children: [
          { id: 'dr1', label: 'Maksimal haydash vaqti', color: '#f59e0b', children: [] },
          { id: 'dr2', label: '5 mph dan oshganda avtomatik', color: '#f59e0b', children: [] },
        ]},
        { id: 'shift', label: 'SHIFT — 14 soat', color: '#f59e0b', children: [
          { id: 'sh1', label: '14 soatlik ish kuni', color: '#f59e0b', children: [] },
          { id: 'sh2', label: 'Keyin 10 soat dam olish shart', color: '#f59e0b', children: [] },
        ]},
        { id: 'cycle', label: 'CYCLE — 70 soat / 8 kun', color: '#f59e0b', children: [
          { id: 'cy1', label: '8 kunda 70 soat ish vaqti', color: '#f59e0b', children: [] },
          { id: 'cy2', label: '34 soat dam olsa reset bo\'ladi', color: '#f59e0b', children: [] },
        ]},
        { id: 'recap', label: 'RECAP', color: '#f59e0b', children: [
          { id: 'rc1', label: '9-kunda 1-kun soatlari qaytadi', color: '#f59e0b', children: [] },
          { id: 'rc2', label: '34 soat reset qilmasdan davom etish', color: '#f59e0b', children: [] },
        ]},
        { id: 'ssb', label: 'SSB — Split Sleeper Berth', color: '#f59e0b', children: [
          { id: 'ss1', label: 'Uyquni 8+2 yoki 7+3 bo\'lish', color: '#f59e0b', children: [] },
          { id: 'ss2', label: 'Jami 10 soat dam olish', color: '#f59e0b', children: [] },
        ]},
        { id: 'adverse', label: 'Adverse Driving', color: '#f59e0b', children: [
          { id: 'ad1', label: 'Yomon ob-havo yoki tiqilinch yo\'l', color: '#f59e0b', children: [] },
          { id: 'ad2', label: 'Shift va Drive +2 soat beradi', color: '#f59e0b', children: [] },
        ]},
      ]
    },
    {
      id: 'statuses',
      label: 'Statuslar',
      color: '#8b5cf6',
      children: [
        { id: 'off', label: 'OFF DUTY', color: '#8b5cf6', children: [
          { id: 'off1', label: 'Trukdan tashqarida dam olish', color: '#8b5cf6', children: [] },
        ]},
        { id: 'sb', label: 'SB — Sleeper Berth', color: '#8b5cf6', children: [
          { id: 'sb1', label: 'Truk ichida yotish', color: '#8b5cf6', children: [] },
          { id: 'sb2', label: 'Haydash emas, ichkarida bo\'lish', color: '#8b5cf6', children: [] },
        ]},
        { id: 'driving', label: 'DRIVING', color: '#8b5cf6', children: [
          { id: 'dr_1', label: '5 mph dan oshganda avtomatik', color: '#8b5cf6', children: [] },
        ]},
        { id: 'onduty', label: 'ON DUTY', color: '#8b5cf6', children: [
          { id: 'on1', label: 'Pickup, Hook, Drop off', color: '#8b5cf6', children: [] },
          { id: 'on2', label: 'PTI, Fuel, DOT tekshiruv', color: '#8b5cf6', children: [] },
        ]},
        { id: 'pc', label: 'PC — Personal Conveyance', color: '#8b5cf6', children: [
          { id: 'pc1', label: 'Shaxsiy ehtiyojlar uchun', color: '#8b5cf6', children: [] },
          { id: 'pc2', label: 'Maksimal 50 mil (80 km)', color: '#8b5cf6', children: [] },
        ]},
        { id: 'ym', label: 'YM — Yard Move', color: '#8b5cf6', children: [
          { id: 'ym1', label: 'Yard ichida harakatlanish', color: '#8b5cf6', children: [] },
          { id: 'ym2', label: 'Drive vaqtini tejaydi', color: '#8b5cf6', children: [] },
        ]},
        { id: 'auto', label: 'Avtomatik Statuslar', color: '#8b5cf6', children: [
          { id: 'au1', label: 'Engine Power Up — Motor yoqildi', color: '#8b5cf6', children: [] },
          { id: 'au2', label: 'Engine Shut Down — Motor o\'chdi', color: '#8b5cf6', children: [] },
          { id: 'au3', label: 'Intermediate — Har 1 soatda', color: '#8b5cf6', children: [] },
        ]},
      ]
    },
    {
      id: 'eld',
      label: 'ELD Tizimi',
      color: '#ef4444',
      children: [
        { id: 'devices', label: 'Qurilmalar', color: '#ef4444', children: [
          { id: 'pt30', label: 'PT30 — 9-pin yoki 16-pin kabel', color: '#ef4444', children: [] },
          { id: 'iosix', label: 'IOSiX — Diagnostic portga ulanadi', color: '#ef4444', children: [] },
        ]},
        { id: 'platforms', label: 'Platformalar', color: '#ef4444', children: [
          { id: 'factor', label: 'Factor ELD — $79/truk', color: '#ef4444', children: [] },
          { id: 'bluestar', label: 'Blue Star — $105/truk', color: '#ef4444', children: [] },
          { id: 'tt', label: 'TT ELD — $89/truk', color: '#ef4444', children: [] },
          { id: 'powertrucks', label: 'Powertrucks — $80/truk', color: '#ef4444', children: [] },
          { id: 'ctelog', label: 'CTE Log — $50/truk', color: '#ef4444', children: [] },
          { id: 'gpstab', label: 'GPS Tab — $29/haydovchi', color: '#ef4444', children: [] },
          { id: 'samsara', label: 'Samsara', color: '#ef4444', children: [] },
        ]},
        { id: 'features', label: 'Xususiyatlar', color: '#ef4444', children: [
          { id: 'gps', label: 'GPS — Real vaqt joylashuv', color: '#ef4444', children: [] },
          { id: 'certif', label: 'Certification — Log tasdiqlash', color: '#ef4444', children: [] },
          { id: 'pf', label: 'Profile Form — Har kun to\'ldirish', color: '#ef4444', children: [] },
          { id: 'dvir', label: 'DVIR — Kunlik mashina tekshiruvi', color: '#ef4444', children: [] },
          { id: 'unident', label: 'Unidentified Driving — Reject qilish', color: '#ef4444', children: [] },
          { id: 'violations', label: 'Violations — Qoidabuzarlik', color: '#ef4444', children: [] },
        ]},
        { id: 'cables', label: 'Kabel Turlari', color: '#ef4444', children: [
          { id: 'c9', label: '9-pin — Ko\'p trucklarda', color: '#ef4444', children: [] },
          { id: 'c16', label: '16-pin OBD II — Standart', color: '#ef4444', children: [] },
          { id: 'c6', label: '6-pin — Eski modellar', color: '#ef4444', children: [] },
        ]},
      ]
    },
    {
      id: 'docs',
      label: 'Hujjatlar',
      color: '#14b8a6',
      children: [
        { id: 'bol', label: 'BOL — Bill of Lading', color: '#14b8a6', children: [
          { id: 'bol1', label: 'Yuk turi, miqdori va manzili', color: '#14b8a6', children: [] },
        ]},
        { id: 'ifta', label: 'IFTA — Yoqilg\'i soliq hisoboti', color: '#14b8a6', children: [
          { id: 'ifta1', label: 'Shtatlararo yoqilg\'i solig\'i', color: '#14b8a6', children: [] },
          { id: 'ifta2', label: 'Choraklik hisobot', color: '#14b8a6', children: [] },
        ]},
        { id: 'cdl', label: 'CDL — Tijorat haydovchilik guvohnomasi', color: '#14b8a6', children: [] },
        { id: 'cabcard', label: 'Cab Card — Mashina registratsiya', color: '#14b8a6', children: [] },
        { id: 'rods', label: 'RODS / ERODS — Ish vaqti yozuvi', color: '#14b8a6', children: [] },
        { id: 'audit', label: 'Safety Audit', color: '#14b8a6', children: [
          { id: 'aud1', label: '6 oylik ELD tekshiruvi', color: '#14b8a6', children: [] },
          { id: 'aud2', label: 'BOL va Fuel receipts kerak', color: '#14b8a6', children: [] },
        ]},
        { id: 'malfunction', label: 'ELD Malfunction Letter', color: '#14b8a6', children: [
          { id: 'mal1', label: 'ELD buzilganda 8 kun qog\'oz jurnal', color: '#14b8a6', children: [] },
        ]},
        { id: 'sticker', label: 'ELD Sticker va Manual', color: '#14b8a6', children: [
          { id: 'sti1', label: 'Truk eshigiga yopishtiriladi', color: '#14b8a6', children: [] },
        ]},
      ]
    },
    {
      id: 'drivers',
      label: 'Haydovchi Turlari',
      color: '#ec4899',
      children: [
        { id: 'company', label: 'Company Driver', color: '#ec4899', children: [
          { id: 'cd1', label: 'Kompaniya xodimi (maoshli)', color: '#ec4899', children: [] },
          { id: 'cd2', label: 'Barcha xarajatlar kompaniyada', color: '#ec4899', children: [] },
        ]},
        { id: 'lease', label: 'Lease Driver', color: '#ec4899', children: [
          { id: 'ld1', label: 'Trukni ijaraga oladi', color: '#ec4899', children: [] },
          { id: 'ld2', label: 'Ko\'proq daromad oladi', color: '#ec4899', children: [] },
        ]},
        { id: 'owner', label: 'Owner-Operator', color: '#ec4899', children: [
          { id: 'ow1', label: 'O\'z trukiga ega (tadbirkor)', color: '#ec4899', children: [] },
          { id: 'ow2', label: 'Erkin ish tanlash imkoniyati', color: '#ec4899', children: [] },
        ]},
        { id: 'codriver', label: 'Co-Driver (Juft haydovchi)', color: '#ec4899', children: [
          { id: 'cod1', label: 'Bir trukda juft haydovchi', color: '#ec4899', children: [] },
          { id: 'cod2', label: 'Almashinib haydashadi', color: '#ec4899', children: [] },
        ]},
      ]
    },
    {
      id: 'dot_inspection',
      label: 'DOT Tekshiruv',
      color: '#6b7280',
      children: [
        { id: 'levels', label: 'Tekshiruv Darajalari', color: '#6b7280', children: [
          { id: 'lv1', label: 'Level I — To\'liq tekshiruv', color: '#6b7280', children: [] },
          { id: 'lv2', label: 'Level II — Atroflab tekshiruv', color: '#6b7280', children: [] },
          { id: 'lv3', label: 'Level III — Faqat haydovchi', color: '#6b7280', children: [] },
          { id: 'lv4', label: 'Level IV — Maxsus tekshiruv', color: '#6b7280', children: [] },
          { id: 'lv5', label: 'Level V — Faqat mashina', color: '#6b7280', children: [] },
          { id: 'lv6', label: 'Level VI — Radioaktiv yuk', color: '#6b7280', children: [] },
        ]},
        { id: 'weigh', label: 'Weigh Station', color: '#6b7280', children: [
          { id: 'ws1', label: 'Og\'irlik tekshiruv punkti', color: '#6b7280', children: [] },
        ]},
        { id: 'oos', label: 'OOS — Out of Service', color: '#6b7280', children: [
          { id: 'oos1', label: 'Jiddiy qoidabuzarlik', color: '#6b7280', children: [] },
          { id: 'oos2', label: 'Muammo hal bo\'lgunga haydash taqiqlangan', color: '#6b7280', children: [] },
        ]},
        { id: 'usdot', label: 'USDOT Raqami', color: '#6b7280', children: [
          { id: 'usd1', label: 'Kompaniya ID raqami', color: '#6b7280', children: [] },
        ]},
        { id: 'mc', label: 'MC Raqami', color: '#6b7280', children: [
          { id: 'mc1', label: 'Tovar tashish ruxsati', color: '#6b7280', children: [] },
        ]},
      ]
    },
    {
      id: 'monitoring',
      label: 'Monitoring',
      color: '#0ea5e9',
      children: [
        { id: 'daily', label: 'Kunlik Tekshiruv', color: '#0ea5e9', children: [
          { id: 'da1', label: 'Odometer va engine hours', color: '#0ea5e9', children: [] },
          { id: 'da2', label: 'GPS joylashuv to\'g\'riligi', color: '#0ea5e9', children: [] },
          { id: 'da3', label: 'Bluetooth yashil = ulangan', color: '#0ea5e9', children: [] },
        ]},
        { id: 'alerts', label: 'Ogohlantirishlar', color: '#0ea5e9', children: [
          { id: 'al1', label: 'Disconnect — Guruhda xabar', color: '#0ea5e9', children: [] },
          { id: 'al2', label: 'Violation — Haydovchiga ogohlantirish', color: '#0ea5e9', children: [] },
          { id: 'al3', label: '1-1.5 soat qolganda ogohlantirish', color: '#0ea5e9', children: [] },
        ]},
        { id: 'updates', label: 'Boards va Guruhlar', color: '#0ea5e9', children: [
          { id: 'up1', label: '3 ta board doim yangilanib turadi', color: '#0ea5e9', children: [] },
          { id: 'up2', label: 'Yangi haydovchi qo\'shilganda xabar', color: '#0ea5e9', children: [] },
        ]},
        { id: 'dotupd', label: 'DOT Inspection Update', color: '#0ea5e9', children: [
          { id: 'dot1', label: 'Tekshiruv natijasini guruhda e\'lon', color: '#0ea5e9', children: [] },
          { id: 'dot2', label: 'Hujjatni tekshirish va saqlab qo\'yish', color: '#0ea5e9', children: [] },
        ]},
      ]
    },
    {
      id: 'geography',
      label: 'Jug\'rofiya',
      color: '#f97316',
      children: [
        { id: 'redstates', label: 'Qizil Shtatlar (10 ta)', color: '#f97316', children: [
          { id: 'rs1', label: 'Washington, Florida, Oregon', color: '#f97316', children: [] },
          { id: 'rs2', label: 'Wyoming, Arizona, New Mexico', color: '#f97316', children: [] },
          { id: 'rs3', label: 'Idaho, Utah, California, Montana', color: '#f97316', children: [] },
          { id: 'rs4', label: 'Yangi soat ochma! Qattiq nazorat', color: '#f97316', children: [] },
        ]},
        { id: 'timezones', label: 'Vaqt Zonalari (4 ta)', color: '#f97316', children: [
          { id: 'tz1', label: 'Eastern Time Zone', color: '#f97316', children: [] },
          { id: 'tz2', label: 'Central Time Zone', color: '#f97316', children: [] },
          { id: 'tz3', label: 'Mountain Time Zone', color: '#f97316', children: [] },
          { id: 'tz4', label: 'Pacific Time Zone', color: '#f97316', children: [] },
        ]},
        { id: 'states', label: 'USA — 48 shtat, 50 jami', color: '#f97316', children: [] },
      ]
    },
    {
      id: 'terms',
      label: 'Muhim Atamalar',
      color: '#a855f7',
      children: [
        { id: 'pickup', label: 'Pickup — Treyler yuklanishi', color: '#a855f7', children: [] },
        { id: 'hook', label: 'Hook — Treyler ulash', color: '#a855f7', children: [] },
        { id: 'dropoff', label: 'Drop Off — Treylerni qoldirish', color: '#a855f7', children: [] },
        { id: 'delivery', label: 'Delivery — Yuk yetkazish', color: '#a855f7', children: [] },
        { id: 'pti', label: 'PTI — Yo\'lga chiqishdan oldin tekshiruv', color: '#a855f7', children: [] },
        { id: 'deadhead', label: 'Deadheading — Bo\'sh treyler bilan', color: '#a855f7', children: [] },
        { id: 'bobtail', label: 'Bobtail — Treylersiz haydash', color: '#a855f7', children: [] },
        { id: 'hotload', label: 'Hot Load — Tez yetkazish', color: '#a855f7', children: [] },
        { id: 'eta', label: 'ETA — Taxminiy kelish vaqti', color: '#a855f7', children: [] },
        { id: 'tms', label: 'TMS — Transport boshqaruv dasturi', color: '#a855f7', children: [] },
        { id: 'safer', label: 'SAFER — Xavfsizlik reytingi sayti', color: '#a855f7', children: [] },
        { id: 'catscale', label: 'CAT Scale — Truk stop og\'irlik o\'lchov', color: '#a855f7', children: [] },
      ]
    },
  ]
}
