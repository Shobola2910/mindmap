export const DEFAULT_DATA = {
  id: 'root', label: 'ALGO GROUP', color: '#6366f1',
  children: [
    { id: 'logistics', label: 'Logistika Turlari', color: '#3b82f6', children: [
      { id: 'road', label: "Yo'l va Yuk Transporti", color: '#3b82f6', children: [
        { id: 'road1', label: 'Truklar bilan tovar yetkazish', color: '#3b82f6', children: [] },
        { id: 'road2', label: 'Kichik yuklar uchun qulay', color: '#3b82f6', children: [] },
        { id: 'road3', label: 'Yomon ob-havo kechiktirishi mumkin', color: '#3b82f6', children: [] }
      ]},
      { id: 'air', label: 'Samolyot Transporti', color: '#3b82f6', children: [
        { id: 'air1', label: 'Elektronika, dori, tez yetkazish', color: '#3b82f6', children: [] },
        { id: 'air2', label: 'Boshqa turlarga nisbatan qimmat', color: '#3b82f6', children: [] }
      ]},
      { id: 'rail', label: 'Temir Yo\'l Transporti', color: '#3b82f6', children: [
        { id: 'rail1', label: "Ko'mir, neft, qishloq xo'jaligi", color: '#3b82f6', children: [] },
        { id: 'rail2', label: 'Qat\'iy jadval, moslashuvchan emas', color: '#3b82f6', children: [] }
      ]},
      { id: 'sea', label: 'Dengiz Transporti', color: '#3b82f6', children: [
        { id: 'sea1', label: 'Uzoq masofada eng arzon', color: '#3b82f6', children: [] },
        { id: 'sea2', label: "Eng ko'p hajmni ko'taradi", color: '#3b82f6', children: [] }
      ]},
      { id: 'dot_reg', label: 'DOT — Barcha transportni boshqaradi', color: '#1d4ed8', children: [
        { id: 'fmcsa', label: 'FMCSA — Truk industriya', color: '#1d4ed8', children: [] },
        { id: 'faa', label: 'FAA — Aviatsiya xavfsizligi', color: '#1d4ed8', children: [] },
        { id: 'fra', label: 'FRA — Temir yo\'l xavfsizligi', color: '#1d4ed8', children: [] },
        { id: 'fhwa', label: 'FHWA — Yo\'l infratuzilmasi', color: '#1d4ed8', children: [] }
      ]},
      { id: 'roles', label: 'Logistika Rollari', color: '#3b82f6', children: [
        { id: 'carrier', label: 'Carrier — Yuk tashuvchi', color: '#3b82f6', children: [] },
        { id: 'broker', label: 'Broker — Shipper va Carrier bog\'laydi', color: '#3b82f6', children: [] },
        { id: 'shipper', label: 'Shipper — Yuboruvchi', color: '#3b82f6', children: [] }
      ]}
    ]},
    { id: 'departments', label: 'Departmentlar', color: '#10b981', children: [
      { id: 'dispatch', label: 'Dispatch', color: '#10b981', children: [
        { id: 'd1', label: 'Eng yaxshi narxda yuk topib beradi', color: '#10b981', children: [] },
        { id: 'd2', label: 'Haydovchini yuklab tashlab ketkazadi', color: '#10b981', children: [] }
      ]},
      { id: 'fleet_dep', label: 'Fleet Department', color: '#10b981', children: [
        { id: 'f1', label: 'Truck nosozligi va ta\'mirlash', color: '#10b981', children: [] },
        { id: 'f2', label: 'Yaqin atrofdagi Repair Shop topadi', color: '#10b981', children: [] }
      ]},
      { id: 'accounting', label: 'Accounting', color: '#10b981', children: [
        { id: 'a1', label: 'Driver daromadi va ish haqi', color: '#10b981', children: [] },
        { id: 'a2', label: 'Kompaniya xarajatlari va soliqlar', color: '#10b981', children: [] }
      ]},
      { id: 'safety_dep', label: 'Safety / ELD Department', color: '#10b981', children: [
        { id: 's1', label: 'Barcha hujjatlar bilan ishlaydi', color: '#10b981', children: [] },
        { id: 's2', label: 'ELD xizmati — bizning ishimiz', color: '#10b981', children: [] }
      ]},
      { id: 'update_dep', label: 'Update Department', color: '#10b981', children: [
        { id: 'u1', label: 'Yukni qabul qilishdan yetkazishgacha', color: '#10b981', children: [] },
        { id: 'u2', label: 'Narx, joy, vaqt, ogirlik malumoti', color: '#10b981', children: [] }
      ]},
      { id: 'hr', label: 'HR Department', color: '#10b981', children: [
        { id: 'hr1', label: 'Ishga olish va o\'qitish', color: '#10b981', children: [] }
      ]},
      { id: 'brokerage', label: 'Brokerage', color: '#10b981', children: [
        { id: 'brk1', label: 'Shipper va Carrier o\'rtasida', color: '#10b981', children: [] }
      ]},
      { id: 'fuel_dep', label: 'Fuel Department', color: '#10b981', children: [
        { id: 'fuel1', label: "Truck stops: TA, Love's, Pilot", color: '#10b981', children: [] }
      ]}
    ]},
    { id: 'hos', label: 'HOS Qoidalari', color: '#f59e0b', children: [
      { id: 'break_h', label: 'BREAK — 30 daqiqa', color: '#f59e0b', children: [
        { id: 'br1', label: '8 soat uzluksiz haydashdan keyin', color: '#f59e0b', children: [] },
        { id: 'br2', label: 'Haydash to\'xtatilishi shart', color: '#f59e0b', children: [] }
      ]},
      { id: 'drive_h', label: 'DRIVE — 11 soat', color: '#f59e0b', children: [
        { id: 'dr1', label: 'Maksimal haydash vaqti', color: '#f59e0b', children: [] },
        { id: 'dr2', label: '5 mph dan oshganda AVTOMATIK', color: '#f59e0b', children: [] }
      ]},
      { id: 'shift_h', label: 'SHIFT — 14 soat', color: '#f59e0b', children: [
        { id: 'sh1', label: '14 soatlik ish kuni', color: '#f59e0b', children: [] },
        { id: 'sh2', label: 'Keyin 10 soat dam olish shart', color: '#f59e0b', children: [] },
        { id: 'sh3', label: '3 soat: pickup, PTI, fuel va h.k.', color: '#f59e0b', children: [] }
      ]},
      { id: 'cycle_h', label: 'CYCLE — 70 soat / 8 kun', color: '#f59e0b', children: [
        { id: 'cy1', label: '8 kunda 70 soat ON DUTY + DRIVE', color: '#f59e0b', children: [] },
        { id: 'cy2', label: '34 soat OFF DUTY = reset', color: '#f59e0b', children: [] }
      ]},
      { id: 'recap_h', label: 'RECAP', color: '#d97706', children: [
        { id: 'rc1', label: '9-kunda 1-kun soatlari qaytadi', color: '#d97706', children: [] },
        { id: 'rc2', label: 'Misol: 1-kun 13s + 9-kunda 20s = 33s', color: '#d97706', children: [] }
      ]},
      { id: 'ssb_h', label: 'SSB — Split Sleeper Berth', color: '#d97706', children: [
        { id: 'ss1', label: 'Uyquni 8+2 yoki 7+3 qilib bolish', color: '#d97706', children: [] },
        { id: 'ss2', label: 'Jami 10 soat dam olish', color: '#d97706', children: [] }
      ]},
      { id: 'adverse_h', label: 'Adverse Driving', color: '#d97706', children: [
        { id: 'ad1', label: 'Yomon ob-havo yoki tiqilinch yol', color: '#d97706', children: [] },
        { id: 'ad2', label: 'Shift +2 soat, Drive +2 soat', color: '#d97706', children: [] }
      ]}
    ]},
    { id: 'statuses', label: 'Statuslar', color: '#8b5cf6', children: [
      { id: 'off_s', label: 'OFF DUTY', color: '#8b5cf6', children: [
        { id: 'off1', label: 'Trukdan tashqarida dam olish', color: '#8b5cf6', children: [] }
      ]},
      { id: 'sb_s', label: 'SB — Sleeper Berth', color: '#8b5cf6', children: [
        { id: 'sb1', label: 'Truk ichida yotish/dam olish', color: '#8b5cf6', children: [] }
      ]},
      { id: 'drv_s', label: 'DRIVING', color: '#8b5cf6', children: [
        { id: 'drv1', label: '5 mph dan oshganda AVTOMATIK', color: '#8b5cf6', children: [] }
      ]},
      { id: 'on_s', label: 'ON DUTY', color: '#8b5cf6', children: [
        { id: 'on1', label: 'Pickup, Hook up, Drop off', color: '#8b5cf6', children: [] },
        { id: 'on2', label: 'PTI (min 15 daqiqa), Fuel, DOT', color: '#8b5cf6', children: [] }
      ]},
      { id: 'pc_s', label: 'PC — Personal Conveyance', color: '#7c3aed', children: [
        { id: 'pc1', label: "Shaxsiy ehtiyojlar: gym, do'kon", color: '#7c3aed', children: [] },
        { id: 'pc2', label: 'Maksimal 50 mil (80 km)', color: '#7c3aed', children: [] },
        { id: 'pc3', label: 'Yuk joyiga borish TAQIQLANGAN', color: '#7c3aed', children: [] }
      ]},
      { id: 'ym_s', label: 'YM — Yard Move', color: '#7c3aed', children: [
        { id: 'ym1', label: 'Yard ichida harakatlanish', color: '#7c3aed', children: [] },
        { id: 'ym2', label: 'Drive vaqtini tejaydi', color: '#7c3aed', children: [] }
      ]},
      { id: 'auto_s', label: 'Avtomatik Statuslar', color: '#7c3aed', children: [
        { id: 'au1', label: 'Engine Power Up — Motor yoqildi', color: '#7c3aed', children: [] },
        { id: 'au2', label: "Engine Shut Down — Motor o'chdi", color: '#7c3aed', children: [] },
        { id: 'au3', label: 'Intermediate — Har 1 soatda yoziladi', color: '#7c3aed', children: [] },
        { id: 'au4', label: 'Login / Logout / Certification', color: '#7c3aed', children: [] }
      ]}
    ]},
    { id: 'eld', label: 'ELD Tizimi', color: '#ef4444', children: [
      { id: 'devices', label: 'ELD Qurilmalar', color: '#ef4444', children: [
        { id: 'pt30', label: 'PT30 — 9-pin yoki 16-pin kabel', color: '#ef4444', children: [] },
        { id: 'iosix', label: 'IOSiX — Diagnostic portga ulanadi', color: '#ef4444', children: [] }
      ]},
      { id: 'cables', label: 'Kabel Turlari', color: '#ef4444', children: [
        { id: 'c9', label: "9-pin — Ko'p trucklarda", color: '#ef4444', children: [] },
        { id: 'c16', label: '16-pin OBD II — Standart', color: '#ef4444', children: [] },
        { id: 'c6', label: '6-pin — Eski modellar', color: '#ef4444', children: [] }
      ]},
      { id: 'platforms', label: 'ELD Platformalar', color: '#dc2626', children: [
        { id: 'factor', label: 'Factor ELD — $79/truk', color: '#dc2626', children: [] },
        { id: 'bluestar', label: 'Blue Star ELD — $105/truk', color: '#dc2626', children: [] },
        { id: 'tt_eld', label: 'TT ELD — $89/truk', color: '#dc2626', children: [] },
        { id: 'powertrk', label: 'Powertrucks — $80/truk', color: '#dc2626', children: [] },
        { id: 'ctelog', label: 'CTE Log — $50/truk', color: '#dc2626', children: [] },
        { id: 'gpstab', label: 'GPS Tab — $29/haydovchi', color: '#dc2626', children: [] },
        { id: 'roadstar', label: 'Road STAR — $29/haydovchi', color: '#dc2626', children: [] },
        { id: 'samsara', label: 'Samsara, Evo ELD, Columbus', color: '#dc2626', children: [] }
      ]},
      { id: 'eld_features', label: 'ELD Xususiyatlari', color: '#ef4444', children: [
        { id: 'gps_f', label: 'GPS — Real vaqt joylashuv', color: '#ef4444', children: [] },
        { id: 'pf_f', label: "Profile Form — Har kun to'ldirish", color: '#ef4444', children: [] },
        { id: 'dvir_f', label: 'DVIR — Kunlik mashina tekshiruvi', color: '#ef4444', children: [] },
        { id: 'odometer', label: 'Odometer — Umumiy masofa', color: '#ef4444', children: [] },
        { id: 'alarm_f', label: 'Driver Alarm — Ogohlantirish', color: '#ef4444', children: [] }
      ]},
      { id: 'unident', label: 'Unidentified Driving', color: '#b91c1c', children: [
        { id: 'un1', label: "Internetdan uzilganda yoziladi", color: '#b91c1c', children: [] },
        { id: 'un2', label: "Bizda: REJECT — DOT so'rasa: ACCEPT", color: '#b91c1c', children: [] }
      ]},
      { id: 'install', label: "ELD O'rnatish", color: '#b91c1c', children: [
        { id: 'inst1', label: '1. Motorni o\'chiring', color: '#b91c1c', children: [] },
        { id: 'inst2', label: '2. Diagnostic portni toping', color: '#b91c1c', children: [] },
        { id: 'inst3', label: '3. Kabelni ulang, burab mahkamlang', color: '#b91c1c', children: [] },
        { id: 'inst4', label: '4. Tabletni yoqing, loginni kiriting', color: '#b91c1c', children: [] }
      ]},
      { id: 'eld_docs', label: 'ELD Hujjatlar', color: '#ef4444', children: [
        { id: 'eld_stick', label: 'ELD Sticker — Eshikka yopishtiriladi', color: '#ef4444', children: [] },
        { id: 'eld_man', label: "ELD Manual — Yo'riqnoma (print)", color: '#ef4444', children: [] },
        { id: 'malfunction', label: 'Malfunction Letter — 8 kun qogoz jurnal', color: '#ef4444', children: [] }
      ]}
    ]},
    { id: 'docs', label: 'Hujjatlar', color: '#14b8a6', children: [
      { id: 'bol_d', label: 'BOL — Bill of Lading', color: '#14b8a6', children: [
        { id: 'bol1', label: 'Yuk turi, miqdori, manzili', color: '#14b8a6', children: [] }
      ]},
      { id: 'ifta_d', label: "IFTA — Yoqilg'i Soliq", color: '#14b8a6', children: [
        { id: 'ifta1', label: 'Shtatlararo yoqilgi soligi', color: '#14b8a6', children: [] },
        { id: 'ifta2', label: 'Choraklik hisobot, biz yuboramiz', color: '#14b8a6', children: [] }
      ]},
      { id: 'cdl_d', label: 'CDL — Tijorat Haydovchilik Guvohnomasi', color: '#14b8a6', children: [] },
      { id: 'cabcard', label: 'Cab Card — Mashina Registratsiya', color: '#14b8a6', children: [] },
      { id: 'rods_d', label: 'RODS / ERODS — Ish vaqti yozuvi', color: '#14b8a6', children: [] },
      { id: 'audit_d', label: 'Safety Audit', color: '#0d9488', children: [
        { id: 'aud1', label: '6 oylik ELD tekshiruvi (1 oy)', color: '#0d9488', children: [] },
        { id: 'aud2', label: 'BOL, Fuel receipts kerak', color: '#0d9488', children: [] },
        { id: 'aud3', label: 'Onsite/Offside — muddatni aniqla', color: '#0d9488', children: [] }
      ]},
      { id: 'usdot_d', label: 'USDOT — Kompaniya noyob ID', color: '#14b8a6', children: [] },
      { id: 'mc_d', label: 'MC Raqami — Tovar tashish ruxsati', color: '#14b8a6', children: [] }
    ]},
    { id: 'drivers', label: 'Haydovchi Turlari', color: '#ec4899', children: [
      { id: 'company_d', label: 'Company Driver', color: '#ec4899', children: [
        { id: 'cd1', label: 'Kompaniya xodimi (maoshli ishchi)', color: '#ec4899', children: [] },
        { id: 'cd2', label: 'Barcha xarajatlar kompaniyada', color: '#ec4899', children: [] }
      ]},
      { id: 'lease_d', label: 'Lease Driver', color: '#ec4899', children: [
        { id: 'ld1', label: "Trukni ijaraga oladi", color: '#ec4899', children: [] },
        { id: 'ld2', label: "Ko'proq daromad, o'zi to'laydi", color: '#ec4899', children: [] }
      ]},
      { id: 'owner_d', label: 'Owner-Operator', color: '#ec4899', children: [
        { id: 'ow1', label: "O'z trukiga ega (tadbirkor)", color: '#ec4899', children: [] },
        { id: 'ow2', label: "Eng ko'p daromad, eng ko'p xarajat", color: '#ec4899', children: [] }
      ]},
      { id: 'codrv_d', label: 'Co-Driver (Juft haydovchi)', color: '#db2777', children: [
        { id: 'cod1', label: 'Bir trukda ikki haydovchi', color: '#db2777', children: [] },
        { id: 'cod2', label: 'Almashinib haydashadi', color: '#db2777', children: [] }
      ]},
      { id: 'truck_types', label: 'Truck Turlari', color: '#db2777', children: [
        { id: 'tt1', label: 'Day Cab — Yotoqsiz kabina', color: '#db2777', children: [] },
        { id: 'tt2', label: 'Box Truck — Yopiq yuk bolimi', color: '#db2777', children: [] },
        { id: 'tt3', label: 'Flatbed — Ochiq platform', color: '#db2777', children: [] }
      ]}
    ]},
    { id: 'dot_insp', label: 'DOT Tekshiruv', color: '#64748b', children: [
      { id: 'levels', label: 'Tekshiruv Darajalari (6 ta)', color: '#64748b', children: [
        { id: 'lv1', label: "Level I — To'liq (mashina + haydovchi)", color: '#64748b', children: [] },
        { id: 'lv2', label: 'Level II — Atroflab tekshiruv', color: '#64748b', children: [] },
        { id: 'lv3', label: 'Level III — Faqat haydovchi', color: '#64748b', children: [] },
        { id: 'lv4', label: 'Level IV — Maxsus tekshiruv', color: '#64748b', children: [] },
        { id: 'lv5', label: 'Level V — Faqat mashina', color: '#64748b', children: [] },
        { id: 'lv6', label: 'Level VI — Radioaktiv yuk', color: '#64748b', children: [] }
      ]},
      { id: 'weigh', label: 'Weigh Station', color: '#64748b', children: [
        { id: 'ws1', label: "Og'irlik tekshiruv punkti", color: '#64748b', children: [] },
        { id: 'ws2', label: "Ortiqcha og'irlik — jarima", color: '#64748b', children: [] }
      ]},
      { id: 'oos', label: 'OOS — Out of Service', color: '#475569', children: [
        { id: 'oos1', label: 'Jiddiy qoidabuzarlik', color: '#475569', children: [] },
        { id: 'oos2', label: 'Muammo hal bo\'lgunga taqiq', color: '#475569', children: [] }
      ]},
      { id: 'violations', label: 'Violation — Qoidabuzarlik', color: '#475569', children: [
        { id: 'viol1', label: 'Kompaniya va haydovchi jarimalanadi', color: '#475569', children: [] },
        { id: 'viol2', label: 'Yuk tashish imkoniyatiga tasir', color: '#475569', children: [] }
      ]},
      { id: 'insp_orgs', label: 'Tekshiruvchi Tashkilotlar', color: '#64748b', children: [
        { id: 'org1', label: 'DOT Officers — Asosiy tekshiruvchi', color: '#64748b', children: [] },
        { id: 'org2', label: 'State Troopers — Shtat politsiyasi', color: '#64748b', children: [] },
        { id: 'org3', label: 'CVSA — Tekshiruv mezonlari', color: '#64748b', children: [] }
      ]}
    ]},
    { id: 'monitoring', label: 'Monitoring', color: '#0ea5e9', children: [
      { id: 'daily_mon', label: 'Kunlik Tekshiruv', color: '#0ea5e9', children: [
        { id: 'da1', label: 'Odometer va engine hours', color: '#0ea5e9', children: [] },
        { id: 'da2', label: 'GPS joylashuv to\'g\'riligi', color: '#0ea5e9', children: [] },
        { id: 'da3', label: 'Bluetooth: Yashil = ulangan', color: '#0ea5e9', children: [] }
      ]},
      { id: 'alerts_mon', label: 'Ogohlantirishlar', color: '#0ea5e9', children: [
        { id: 'al1', label: 'Disconnect — Guruhda xabar + chaqiruv', color: '#0ea5e9', children: [] },
        { id: 'al2', label: 'Violation — Haydovchiga ogohlantirish', color: '#0ea5e9', children: [] },
        { id: 'al3', label: '1-1.5 soat qolsa to\'xtashni eslatish', color: '#0ea5e9', children: [] }
      ]},
      { id: 'boards_mon', label: 'Boards va Guruhlar', color: '#0284c7', children: [
        { id: 'bd1', label: '3 ta board doim yangilanib turadi', color: '#0284c7', children: [] },
        { id: 'bd2', label: 'Update B1(A), Update B1(B), Leader ELD', color: '#0284c7', children: [] }
      ]},
      { id: 'dot_mon', label: 'DOT Inspection Update', color: '#0284c7', children: [
        { id: 'dot_m1', label: 'Tekshiruv natijasini guruhda', color: '#0284c7', children: [] },
        { id: 'dot_m2', label: 'Violation yo\'q — 7 kun tahrirlama', color: '#0284c7', children: [] }
      ]}
    ]},
    { id: 'billing', label: 'Billing', color: '#f97316', children: [
      { id: 'prices', label: 'Narxlar', color: '#f97316', children: [
        { id: 'pr1', label: 'Blue Star — $105/truk', color: '#f97316', children: [] },
        { id: 'pr2', label: 'Powertrucks — $80/truk', color: '#f97316', children: [] },
        { id: 'pr3', label: 'TT ELD — $89/truk', color: '#f97316', children: [] },
        { id: 'pr4', label: 'Factor ELD — $79/truk', color: '#f97316', children: [] },
        { id: 'pr5', label: 'CTE Log — $50/truk', color: '#f97316', children: [] },
        { id: 'pr6', label: 'GPS Tab — $29/haydovchi', color: '#f97316', children: [] },
        { id: 'pr7', label: 'Road STAR — $29/haydovchi', color: '#f97316', children: [] }
      ]},
      { id: 'payment', label: "To'lov Usullari", color: '#ea580c', children: [
        { id: 'pay1', label: 'Zelle, CashApp, WISE', color: '#ea580c', children: [] },
        { id: 'pay2', label: 'MoneyGram, Western Union, Remitly', color: '#ea580c', children: [] }
      ]},
      { id: 'sub', label: 'Subscription', color: '#ea580c', children: [
        { id: 'sub1', label: 'Har oyning 1-kuni avtomatik hisob', color: '#ea580c', children: [] },
        { id: 'sub2', label: '15-kunda boshlasa — yarmi to\'lanadi', color: '#ea580c', children: [] }
      ]},
      { id: 'api_key', label: 'API Key', color: '#ea580c', children: [
        { id: 'api1', label: 'Broker ELD ga ulanish uchun', color: '#ea580c', children: [] },
        { id: 'api2', label: 'Highway dasturi integratsiyasi', color: '#ea580c', children: [] }
      ]}
    ]},
    { id: 'geography', label: "Jug'rofiya", color: '#a855f7', children: [
      { id: 'redstates', label: 'Qizil Shtatlar (10 ta)', color: '#9333ea', children: [
        { id: 'rs1', label: 'Washington (WA), Florida (FL)', color: '#9333ea', children: [] },
        { id: 'rs2', label: 'Oregon (OR), Wyoming (WY)', color: '#9333ea', children: [] },
        { id: 'rs3', label: 'Arizona (AZ), New Mexico (NM)', color: '#9333ea', children: [] },
        { id: 'rs4', label: 'Idaho (ID), Utah (UT)', color: '#9333ea', children: [] },
        { id: 'rs5', label: 'California (CA), Montana (MT)', color: '#9333ea', children: [] },
        { id: 'rs6', label: 'Bu shtatda yangi soat ochma!', color: '#dc2626', children: [] }
      ]},
      { id: 'timezones', label: 'Vaqt Zonalari (4 ta)', color: '#a855f7', children: [
        { id: 'tz1', label: '1. Eastern Time Zone (ET)', color: '#a855f7', children: [] },
        { id: 'tz2', label: '2. Central Time Zone (CT)', color: '#a855f7', children: [] },
        { id: 'tz3', label: '3. Mountain Time Zone (MT)', color: '#a855f7', children: [] },
        { id: 'tz4', label: '4. Pacific Time Zone (PT)', color: '#a855f7', children: [] }
      ]},
      { id: 'usa_states', label: 'USA — 50 shtat, 48 continental', color: '#a855f7', children: [] }
    ]},
    { id: 'terms', label: 'Muhim Atamalar', color: '#06b6d4', children: [
      { id: 'ops_terms', label: 'Operatsiya Atamalari', color: '#06b6d4', children: [
        { id: 'pickup_t', label: 'Pickup — Treyler yuklanishi', color: '#06b6d4', children: [] },
        { id: 'hook_t', label: 'Hook up — Treyler ulash', color: '#06b6d4', children: [] },
        { id: 'dropoff_t', label: 'Drop off — Treylerni qoldirish', color: '#06b6d4', children: [] },
        { id: 'deliv_t', label: 'Delivery — Yuk yetkazish', color: '#06b6d4', children: [] },
        { id: 'pti_t', label: "PTI — Yo'lga chiqishdan oldin tekshiruv", color: '#06b6d4', children: [] },
        { id: 'dvir_t', label: 'DVIR — Kunlik tekshiruv hisoboti', color: '#06b6d4', children: [] }
      ]},
      { id: 'truck_terms', label: 'Truck Atamalari', color: '#0891b2', children: [
        { id: 'dead_t', label: "Deadheading — Bo'sh treyler bilan", color: '#0891b2', children: [] },
        { id: 'bob_t', label: 'Bobtail (PO) — Treylersiz haydash', color: '#0891b2', children: [] },
        { id: 'hot_t', label: 'Hot Load — Tez yetkazish kerak', color: '#0891b2', children: [] },
        { id: 'cat_t', label: "CAT Scale — Og'irlik o'lchov", color: '#0891b2', children: [] }
      ]},
      { id: 'tech_terms', label: 'Texnik Atamalar', color: '#0891b2', children: [
        { id: 'eta_t', label: 'ETA — Taxminiy kelish vaqti', color: '#0891b2', children: [] },
        { id: 'atd_t', label: 'ATD — Haqiqiy ketish vaqti', color: '#0891b2', children: [] },
        { id: 'tms_t', label: 'TMS — Transport boshqaruv dasturi', color: '#0891b2', children: [] },
        { id: 'safer_t', label: 'SAFER — Xavfsizlik reytingi sayti', color: '#0891b2', children: [] }
      ]}
    ]}
  ]
}
