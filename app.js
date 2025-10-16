window.onload = () => {
  const services = [
    { 
      type:"Santé", icon:"heart-pulse",
      nom_fr:"Médecins du Monde", nom_en:"Doctors of the World", nom_ar:"أطباء العالم",
      description_fr:"Consultations gratuites pour les personnes migrantes.",
      description_en:"Free consultations for migrants.",
      description_ar:"استشارات مجانية للمهاجرين.",
      adresse:"Calais Centre", horaires:"Lun–Ven 9h–17h",
      maps:"https://www.google.com/maps/search/?api=1&query=Calais+Centre"
    },
    { 
      type:"Alimentation", icon:"utensils-crossed",
      nom_fr:"La Vie Active – Distribution de repas", nom_en:"La Vie Active – Meal Distribution", nom_ar:"لا في أكتيف – توزيع الوجبات",
      description_fr:"Repas chauds gratuits chaque jour.",
      description_en:"Free hot meals served daily.",
      description_ar:"وجبات ساخنة مجانية يوميًا.",
      adresse:"Sites de distribution, Calais", horaires:"Tous les jours 12h–14h",
      maps:"https://www.google.com/maps/search/?api=1&query=Calais"
    },
    { 
      type:"Hébergement", icon:"home",
      nom_fr:"Secours Catholique – Accueil de jour", nom_en:"Secours Catholique – Day Center", nom_ar:"سكور كاتوليك – مركز نهاري",
      description_fr:"Accueil de jour, douches, accompagnement social.",
      description_en:"Day reception, showers, social support.",
      description_ar:"استقبال نهاري، حمّامات، دعم اجتماعي.",
      adresse:"Rue de Moscou, Calais", horaires:"Lun–Ven 10h–16h",
      maps:"https://www.google.com/maps/search/?api=1&query=Rue+de+Moscou+Calais"
    },
    { 
      type:"Juridique", icon:"scale",
      nom_fr:"Refugee Info Bus", nom_en:"Refugee Info Bus", nom_ar:"حافلة معلومات اللاجئين",
      description_fr:"Infos, traduction et conseils juridiques.",
      description_en:"Info, translation and legal advice.",
      description_ar:"معلومات، ترجمة ونصائح قانونية.",
      adresse:"Zones d’intervention, Calais", horaires:"Selon disponibilité",
      maps:"https://www.google.com/maps/search/?api=1&query=Zone+industrielle+des+Dunes+Calais"
    },
    { 
      type:"Procédure d’asile", icon:"file-text",
      nom_fr:"Procédure d’asile en France",
      nom_en:"Asylum procedure in France",
      nom_ar:"إجراءات اللجوء في فرنسا",
      description_fr:"Détails sur les étapes : préfecture, OFPRA, CNDA, et les recours possibles.",
      description_en:"Steps for asylum: Prefecture, OFPRA, CNDA, and appeals.",
      description_ar:"مراحل طلب اللجوء: الولاية، المكتب الفرنسي، المحكمة الوطنية.",
      adresse:"Sites web OFPRA / CNDA",
      horaires:"24h/24 en ligne",
      maps:"https://www.service-public.fr/particuliers/vosdroits/F32457"
    },
    { 
      type:"Numéros d’urgence", icon:"phone-call",
      nom_fr:"Numéros d’urgence en France",
      nom_en:"Emergency numbers in France",
      nom_ar:"أرقام الطوارئ في فرنسا",
      description_fr:"15 SAMU – 17 Police – 18 Pompiers – 112 Européen – 115 Hébergement.",
      description_en:"15 Medical – 17 Police – 18 Fire – 112 EU – 115 Shelter.",
      description_ar:"15 إسعاف – 17 شرطة – 18 إطفاء – 112 أوروبا – 115 مأوى.",
      adresse:"France entière",
      horaires:"24h/24 - 7j/7",
      maps:"https://goo.gl/maps/q2hZ7yyX7kL2"
    }
  ];

  const translations = {
    fr: { search_placeholder:"Rechercher un service…", all:"Tous", no_results:"Aucun résultat", map:"Voir sur la carte" },
    en: { search_placeholder:"Search a service…", all:"All", no_results:"No results", map:"View on map" },
    ar: { search_placeholder:"ابحث عن خدمة…", all:"الكل", no_results:"لا توجد نتائج", map:"عرض على الخريطة" }
  };

  const langSel = document.getElementById('lang');
  const searchInp = document.getElementById('search');
  const filtersEl = document.getElementById('filters');
  const listEl = document.getElementById('services');
  const darkBtn = document.getElementById('darkToggle');
  const navBtns = document.querySelectorAll('.nav-btn');

  let lang = localStorage.getItem('kobo_lang') || 'fr';
  let activeFilter = 'all';

  const applyDark = (on) => {
    document.documentElement.classList.toggle('dark', on);
    darkBtn.innerHTML = `<i data-lucide="${on ? 'sun' : 'moon'}" class="w-4 h-4"></i>`;
    if (window.lucide) window.lucide.createIcons();
    localStorage.setItem('kobo_dark', on ? '1' : '0');
  };
  applyDark(localStorage.getItem('kobo_dark') === '1');
  darkBtn.onclick = () => applyDark(!document.documentElement.classList.contains('dark'));

  const setLang = (v) => {
    lang = v; localStorage.setItem('kobo_lang', v);
    document.body.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    searchInp.placeholder = translations[lang].search_placeholder;
    renderFilters(); renderList();
  };

  // --- ONGLET STYLE UNHCR ---
  const renderFilters = () => {
    const t = translations[lang];
    filtersEl.innerHTML = '';
    const TYPES = [
      { key:'all', label:t.all, icon:'list' },
      { key:'Santé', label:'Santé', icon:'heart-pulse' },
      { key:'Alimentation', label:'Alimentation', icon:'utensils-crossed' },
      { key:'Hébergement', label:'Hébergement', icon:'home' },
      { key:'Juridique', label:'Juridique', icon:'scale' },
      { key:'Procédure d’asile', label:'Asile', icon:'file-text' },
      { key:'Numéros d’urgence', label:'Urgences', icon:'phone-call' }
    ];

    TYPES.forEach(tp => {
      const btn = document.createElement('button');
      btn.className =
        'flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-colors duration-200 border-b-4 ' +
        (activeFilter === tp.key
          ? 'text-[#005DAA] border-[#005DAA] bg-sky-50 dark:bg-sky-900/30'
          : 'text-gray-500 border-transparent hover:text-[#005DAA] hover:bg-gray-50 dark:hover:bg-slate-800/40');
      btn.innerHTML = `<i data-lucide="${tp.icon}" class="w-4 h-4 mb-1"></i><span>${tp.label}</span>`;
      btn.onclick = () => { activeFilter = tp.key; renderFilters(); renderList(); };
      filtersEl.appendChild(btn);
    });

    if (window.lucide) window.lucide.createIcons();
  };

  const renderList = () => {
    const t = translations[lang];
    const q = searchInp.value.trim().toLowerCase();
    const filtered = services.filter(s => {
      const inType = (activeFilter==='all' || s.type === activeFilter);
      const text = (s['nom_'+lang] + ' ' + s['description_'+lang] + ' ' + (s.adresse||'')).toLowerCase();
      return inType && text.includes(q);
    });

    listEl.innerHTML = '';
    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="text-center text-sm text-slate-500 dark:text-slate-400 italic py-6">${t.no_results}</div>`;
      return;
    }

    filtered.forEach(s => {
      const card = document.createElement('article');
      card.className = 'bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-soft border border-black/5 dark:border-white/10';
      card.innerHTML = `
        <div class="flex items-start gap-3">
          <div class="shrink-0 w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-300 flex items-center justify-center">
            <i data-lucide="${s.icon}" class="w-5 h-5"></i>
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">${s['nom_'+lang]}</h3>
              <span class="px-2 py-0.5 rounded-full text-xs bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-200">${s.type}</span>
            </div>
            <p class="text-sm mt-1 text-slate-600 dark:text-slate-300">${s['description_'+lang]}</p>
            ${s.maps ? `<div class="mt-2"><a href="${s.maps}" target="_blank" class="inline-flex items-center gap-1 text-sky-600 dark:text-sky-300 text-xs font-medium hover:underline"><i data-lucide="map" class="w-3 h-3"></i> ${t.map}</a></div>` : ''}
          </div>
        </div>`;
      listEl.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  };

  // Navigation basse
  navBtns.forEach(btn => {
    btn.onclick = () => {
      navBtns.forEach(b => b.classList.remove('text-sky-600'));
      btn.classList.add('text-sky-600');
      const section = btn.getAttribute('data-section');
      if (section === 'all') activeFilter = 'all';
      else if (section === 'asylum') activeFilter = 'Procédure d’asile';
      else if (section === 'emergency') activeFilter = 'Numéros d’urgence';
      renderFilters(); renderList();
    };
  });

  langSel.value = lang;
  langSel.onchange = (e) => setLang(e.target.value);
  searchInp.oninput = renderList;
  setLang(lang);
};
