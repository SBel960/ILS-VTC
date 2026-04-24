/* ===== ILS VTC — SHARED JS ===== */

/* ------ MOBILE NAV ------ */
function toggleMob() {
  const nl = document.querySelector('.nav-links');
  if (!nl) return;
  if (nl.style.position === 'fixed') {
    nl.removeAttribute('style');
  } else {
    nl.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:70px;left:0;right:0;background:rgba(13,13,20,.97);padding:2rem;gap:1.5rem;border-bottom:1px solid rgba(255,255,255,.07);z-index:99;';
  }
}

/* ------ TOAST ------ */
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

/* ------ LANGUAGE ------ */
let curLang = localStorage.getItem('lang') || 'fr';

const T = {
  fr: {
    /* nav */
    'nav-home':'Accueil','nav-services':'Services','nav-reservation':'Réservation','nav-about':'À propos','nav-contact':'Contact','nav-cta':'Réserver',
    /* index hero */
    'h-badge':'Service VTC — Blois et ses environs',
    'h-title':'Votre voyage,<br><em>notre engagement</em>',
    'h-sub':"Un service de transport de personnes élégant, ponctuel et de confiance. Réservez votre trajet en quelques clics.",
    'h-b1':'Réserver maintenant','h-b2':'Nos services',
    's1-lbl':'Confirmation','s2-lbl':'Par km','s3-lbl':'Disponibilité','s4-lbl':'Hybride',
    'scroll-lbl':'Découvrir',
    'f-label':'Pourquoi nous choisir',
    'f-title':"L'excellence au <em>service du voyage</em>",
    'f-sub':'Discrétion, confort et professionnalisme pour chacun de vos déplacements.',
    'f1t':'Sécurité & Fiabilité','f1d':"Chauffeurs certifiés et vérifiés. Chaque trajet est effectué avec le plus grand soin pour votre sécurité.",
    'f2t':'Ponctualité Garantie','f2d':"Nous respectons votre temps. Chaque prise en charge est minutée et confirmée à l'avance.",
    'f3t':'Confort Premium','f3d':"Véhicules entretenus, propres et confortables pour un voyage agréable du départ à l'arrivée.",
    'f4t':'Réservation Simple','f4d':'Réservez en ligne en quelques minutes. Confirmation immédiate par message ou email.',
    /* services */
    'sv-label':'Nos Prestations','sv-title':'Des services <strong>sur mesure</strong>','sv-sub':'Chaque déplacement est unique. Nous adaptons notre service à vos besoins.',
    's1t':'Transfert Aéroport','s1d':"Service de prise en charge depuis ou vers l'aéroport. Suivi de vol en temps réel.",'s1f1':'Suivi des vols en direct','s1f2':'Attente gratuite (30 min)','s1f3':'Aide aux bagages',
    's2t':'Transport Professionnel','s2d':"Déplacements d'affaires, réunions, conférences.",'s2f1':'Discrétion assurée','s2f2':'WiFi disponible','s2f3':'Facturation entreprise',
    's3t':'Événements Spéciaux','s3d':"Mariages, soirées, cérémonies. Un service élégant pour vos moments importants.",'s3f1':'Décoration sur demande','s3f2':'Planification personnalisée','s3f3':'Disponibilité toute la soirée',
    's4t':'Transport Médical','s4d':'Accompagnement vers les établissements de santé. Discret et fiable.','s4f1':'Assistance montée/descente','s4f2':'Chauffeur calme et discret','s4f3':'Horaires flexibles',
    's5t':'Longue Distance','s5d':'Trajets interurbains et régionaux. Confort optimal.','s5f1':'Arrêts sur demande','s5f2':'Climatisation / chauffage','s5f3':'Tarif kilométrique transparent',
    's6t':'Transport Scolaire','s6d':"Accompagnement sécurisé des enfants vers l'école ou les activités.",'s6f1':'Ponctualité rigoureuse','s6f2':'Trajet fixe personnalisé','s6f3':'Communication avec les parents',
    /* reservation */
    'r-label':'Réservation en ligne','r-title':'Planifiez votre <strong>trajet</strong>','r-sub':'Remplissez le formulaire ci-dessous. Confirmation sous 30 minutes.',
    'tab1':'① Trajet','tab2':'② Véhicule','tab3':'③ Contact',
    'rs-trip':'Détails du trajet','l-dep':'Point de départ','l-dest':'Destination','l-date':'Date','l-time':'Heure de prise en charge','l-type':'Type de service','l-pass':'Nombre de passagers',
    'o0':'— Sélectionner —','o1':'Transfert aéroport','o2':'Transport professionnel','o3':'Événement spécial','o4':'Transport médical','o5':'Longue distance','o6':'Transport scolaire',
    'b-next1':'Continuer →','rs-veh':'Choisir votre véhicule',
    'v1n':'Berline','v1d':'1–3 passagers','v2n':'SUV Premium','v2d':'1–5 passagers','v3n':'Minibus','v3d':'1–8 passagers',
    'l-notes':'Notes spéciales','b-back2':'← Retour','b-next2':'Continuer →',
    'rs-contact':'Vos informations','l-fn':'Prénom','l-ln':'Nom','l-ph':'Téléphone','l-em':'Email',
    'b-back3':'← Retour','b-confirm':'Confirmer la réservation',
    'conf-t':'Réservation envoyée !','conf-d':'Votre demande a bien été reçue. Vous recevrez une confirmation dans les 30 minutes.','b-new':'Nouvelle réservation',
    /* about */
    'a-title':'Une passion pour <strong>le service</strong>','a-sub':"Fondée sur des valeurs humaines et professionnelles, ILS VTC s'engage à offrir un transport à la hauteur de vos attentes.",
    'a-h2':'Un service humain,<br><strong>une qualité irréprochable</strong>',
    'a-p1':"ILS VTC est né d'une conviction simple : chaque personne mérite un transport digne, fiable et respectueux.",
    'a-p2':"Nos chauffeurs sont formés, vérifiés et passionnés par leur métier. Nous investissons continuellement dans la qualité de notre flotte.",
    'a-cta':'Réserver un trajet',
    'v-label':'Nos valeurs','v-title':'Ce qui nous <strong>définit</strong>',
    'v1t':'Respect','v1p':'Chaque client est traité avec considération et bienveillance.',
    'v2t':'Ponctualité','v2p':"Nous respectons vos horaires comme s'ils étaient les nôtres. Zéro retard.",
    'v3t':'Confiance','v3p':"Transparence totale sur les tarifs et les conditions de service.",
    'v4t':'Excellence','v4p':"Un niveau de service irréprochable, à chaque fois.",
    /* contact */
    'c-label':'Nous contacter','c-title':'Parlez-nous de <strong>votre besoin</strong>','c-sub':'Nous répondons à toutes vos demandes dans les meilleurs délais.',
    'c-infot':'Informations','c-ph':'Téléphone','c-em':'Email','c-hr':'Disponibilité','c-hrs':'7j/7 — 24h/24','c-ar':'Zone de service','c-area':'Blois et ses environs',
    'c-msgt':'Envoyez-nous un message','cf-fn':'Prénom','cf-ln':'Nom','cf-em':'Email','cf-sub':'Objet','cf-msg':'Message','c-send':'Envoyer le message',
    /* footer */
    'ft-desc':'Transport privé professionnel — Blois et ses environs. Ponctualité et confiance.',
    'ft-nav':'Navigation','ft-st':'Services','ft-ct':'Contact',
    'ft-h':'Accueil','ft-s':'Services','ft-b':'Réserver','ft-a':'À propos',
    'ft-s1':'Aéroport','ft-s2':'Professionnel','ft-s3':'Événements','ft-s4':'Médical',
    'ft-av':'24h/24 — 7j/7','ft-copy':'© 2026 ILS VTC · SIRET 90769233900019','ft-mot':'Excellence & Discrétion',

    /* flotte about */
    'fleet-label':'Notre flotte','fleet-title':'Des véhicules <em>soigneusement choisis</em>',
    'fleet1-badge':'× 2 disponibles','fleet1-name':'Toyota C-HR','fleet1-desc':'Hybride, confortable et élégant. 1 à 4 passagers avec bagages standard.',
    'fleet1-f1':'Disponible immédiatement','fleet1-f2':'Hybride — faibles émissions','fleet1-f3':'Climatisation automatique',
    'fleet2-badge':'Préavis 5 jours','fleet2-name':'Camionnette','fleet2-desc':'Pour les bagages volumineux, fauteuils roulants ou équipements spéciaux.',
    'fleet2-f1':'Grande capacité de chargement','fleet2-f2':'Réservation 5 j à l\'avance','fleet2-f3':'Tarif sur devis',
    'about-badge-lbl':'Trajets réalisés',
    /* véhicules réservation */
    'veh1-name':'Toyota C-HR','veh1-pass':'1 – 4 passagers','veh1-badge':'Disponible immédiatement',
    'veh2-name':'Camionnette','veh2-pass':'Bagages volumineux','veh2-badge':'⚠ 5 jours de préavis',
    'price-note':'Tarif estimatif · 2,10 €/km · minimum 15 € · hors péages',
    '_toast_book':'Réservation enregistrée. Confirmation dans les 30 minutes.','_toast_msg':'Message envoyé. Nous vous répondrons bientôt.'
  },
  en: {
    'nav-home':'Home','nav-services':'Services','nav-reservation':'Booking','nav-about':'About','nav-contact':'Contact','nav-cta':'Book a Ride',
    'h-badge':'Private VTC Service — Blois, France',
    'h-title':'Your journey,<br><em>our commitment</em>',
    'h-sub':'An elegant, punctual and trustworthy person transport service. Book your ride in just a few clicks.',
    'h-b1':'Book Now','h-b2':'Our Services',
    's1-lbl':'Confirmation','s2-lbl':'Per km','s3-lbl':'Availability','s4-lbl':'Hybrid',
    'scroll-lbl':'Discover',
    'f-label':'Why choose us',
    'f-title':'Excellence at the <em>service of travel</em>',
    'f-sub':'Discretion, comfort and professionalism for every journey.',
    'f1t':'Safety & Reliability','f1d':'Certified and vetted drivers. Every trip is carried out with the utmost care for your safety.',
    'f2t':'Punctuality Guaranteed','f2d':'We respect your time. Every pickup is timed and confirmed in advance.',
    'f3t':'Premium Comfort','f3d':'Maintained, clean and comfortable vehicles for a pleasant journey.',
    'f4t':'Easy Booking','f4d':'Book online in just minutes. Immediate confirmation by message or email.',
    'sv-label':'Our Services','sv-title':'Tailor-made <strong>services</strong>','sv-sub':'Every trip is unique. We adapt our service to your needs.',
    's1t':'Airport Transfer','s1d':'Pickup and drop-off from/to the airport. Real-time flight tracking.','s1f1':'Live flight tracking','s1f2':'Free waiting (30 min)','s1f3':'Luggage assistance',
    's2t':'Professional Transport','s2d':'Business travel, meetings, conferences.','s2f1':'Discretion guaranteed','s2f2':'WiFi available','s2f3':'Corporate billing',
    's3t':'Special Events','s3d':'Weddings, evenings, ceremonies. An elegant service for your important moments.','s3f1':'Decoration on request','s3f2':'Personalized planning','s3f3':'Full evening availability',
    's4t':'Medical Transport','s4d':'Accompaniment to health facilities. Discreet and reliable.','s4f1':'Boarding/alighting assistance','s4f2':'Calm and discreet driver','s4f3':'Flexible hours',
    's5t':'Long Distance','s5d':'Intercity and regional trips. Optimal comfort.','s5f1':'Stops on request','s5f2':'Air conditioning / heating','s5f3':'Transparent per-km pricing',
    's6t':'School Transport','s6d':'Regular and safe accompaniment of children to school.','s6f1':'Rigorous punctuality','s6f2':'Personalized fixed route','s6f3':'Communication with parents',
    'r-label':'Online Booking','r-title':'Plan your <strong>trip</strong>','r-sub':'Fill in the form below. Confirmation within 30 minutes.',
    'tab1':'① Route','tab2':'② Vehicle','tab3':'③ Contact',
    'rs-trip':'Trip Details','l-dep':'Departure point','l-dest':'Destination','l-date':'Date','l-time':'Pickup time','l-type':'Service type','l-pass':'Number of passengers',
    'o0':'— Select —','o1':'Airport transfer','o2':'Professional transport','o3':'Special event','o4':'Medical transport','o5':'Long distance','o6':'School transport',
    'b-next1':'Continue →','rs-veh':'Choose your vehicle',
    'v1n':'Sedan','v1d':'1–3 passengers','v2n':'Premium SUV','v2d':'1–5 passengers','v3n':'Minibus','v3d':'1–8 passengers',
    'l-notes':'Special notes','b-back2':'← Back','b-next2':'Continue →',
    'rs-contact':'Your information','l-fn':'First name','l-ln':'Last name','l-ph':'Phone','l-em':'Email',
    'b-back3':'← Back','b-confirm':'Confirm booking',
    'conf-t':'Booking sent!','conf-d':'Your request has been received. You will receive confirmation within 30 minutes.','b-new':'New booking',
    'a-title':'A passion for <strong>service</strong>','a-sub':'Built on human and professional values, ILS VTC is committed to providing transport that meets your expectations.',
    'a-h2':'A human service,<br><strong>an impeccable quality</strong>',
    'a-p1':'ILS VTC was born from a simple conviction: every person deserves dignified, reliable and respectful transport.',
    'a-p2':"Our drivers are trained, vetted and passionate about their work. We continuously invest in quality.",
    'a-cta':'Book a trip',
    'v-label':'Our values','v-title':'What <strong>defines us</strong>',
    'v1t':'Respect','v1p':'Every client is treated with consideration and kindness.',
    'v2t':'Punctuality','v2p':"We respect your schedule as if it were our own. Zero delays.",
    'v3t':'Trust','v3p':"Total transparency on pricing and service conditions.",
    'v4t':'Excellence','v4p':"An impeccable level of service, every time.",
    'c-label':'Contact us','c-title':'Tell us about <strong>your need</strong>','c-sub':'We respond to all your requests as quickly as possible.',
    'c-infot':'Information','c-ph':'Phone','c-em':'Email','c-hr':'Availability','c-hrs':'7 days / 24h','c-ar':'Service area','c-area':'Blois and surrounding area',
    'c-msgt':'Send us a message','cf-fn':'First name','cf-ln':'Last name','cf-em':'Email','cf-sub':'Subject','cf-msg':'Message','c-send':'Send message',
    'ft-desc':'Professional private transport — Blois and surrounding area.',
    'ft-nav':'Navigation','ft-st':'Services','ft-ct':'Contact',
    'ft-h':'Home','ft-s':'Services','ft-b':'Book','ft-a':'About',
    'ft-s1':'Airport','ft-s2':'Professional','ft-s3':'Events','ft-s4':'Medical',
    'ft-av':'24h — 7 days','ft-copy':'© 2026 ILS VTC · SIRET 90769233900019','ft-mot':'Excellence & Discretion',

    /* fleet about */
    'fleet-label':'Our fleet','fleet-title':'Carefully <em>selected vehicles</em>',
    'fleet1-badge':'× 2 available','fleet1-name':'Toyota C-HR','fleet1-desc':'Hybrid, comfortable and elegant. 1 to 4 passengers with standard luggage.',
    'fleet1-f1':'Available immediately','fleet1-f2':'Hybrid — low emissions','fleet1-f3':'Automatic air conditioning',
    'fleet2-badge':'5 days notice','fleet2-name':'Van','fleet2-desc':'For bulky luggage, wheelchairs or special equipment.',
    'fleet2-f1':'Large loading capacity','fleet2-f2':'5-day advance booking','fleet2-f3':'Quote on request',
    'about-badge-lbl':'Trips completed',
    /* vehicle reservation */
    'veh1-name':'Toyota C-HR','veh1-pass':'1 – 4 passengers','veh1-badge':'Available immediately',
    'veh2-name':'Van','veh2-pass':'Bulky luggage','veh2-badge':'⚠ 5 days notice',
    'price-note':'Estimated fare · €2.10/km · minimum €15 · tolls not included',
    '_toast_book':'Booking received. Confirmation within 30 minutes.','_toast_msg':"Message sent. We'll be in touch shortly."
  }
};

function setLang(lang) {
  curLang = lang;
  localStorage.setItem('lang', lang);
  document.querySelectorAll('.lb').forEach(b => b.classList.toggle('active', b.textContent === lang.toUpperCase()));
  const t = T[lang];
  Object.keys(t).forEach(id => {
    if (id.startsWith('_')) return;
    const el = document.getElementById(id);
    if (el) el.innerHTML = t[id];
  });
}

/* Apply saved language on page load */
document.addEventListener('DOMContentLoaded', () => {
  setLang(curLang);
  // Mark active nav link
  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.dataset.p === page));
  }
  // Min date for booking
  const di = document.getElementById('trip-date');
  if (di) di.min = new Date().toISOString().split('T')[0];

  // ── Bouton WhatsApp flottant (toutes les pages) ──────────
  const wa = document.createElement('a');
  wa.href      = 'https://wa.me/33641351859?text=Bonjour%20ILS%20VTC%2C%20je%20souhaite%20r%C3%A9server%20un%20trajet.';
  wa.target    = '_blank';
  wa.rel       = 'noopener noreferrer';
  wa.className = 'wa-float';
  wa.title     = 'Nous contacter sur WhatsApp';
  wa.innerHTML = '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
  document.body.appendChild(wa);
});

/* ------ COUNTER ANIMATION (stats hero) ------ */
function animateCounter(el, target, suffix, duration) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;
  const update = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const v = p < 1 ? p * p * (3 - 2 * p) : 1;
    const val = isFloat ? (v * target).toFixed(1) : Math.round(v * target);
    el.textContent = val + (suffix || '');
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
(function initCounters() {
  const nums = document.querySelectorAll('.stat-n');
  if (!nums.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      observer.unobserve(e.target);
      const raw = e.target.textContent.trim();
      if (raw === '24/7') return;  // skip
      if (/[a-zA-Z€']/.test(raw)) return;  // skip textes mixtes
      const num = parseFloat(raw.replace('%','').replace(',','.'));
      if (!isNaN(num)) animateCounter(e.target, num, raw.includes('%') ? '%' : '', 1800);
    });
  }, { threshold: 0.3 });
  nums.forEach(n => observer.observe(n));
})();

/* ------ RESERVATION FORM STEPS ------ */
function nxt(step) {
  [1,2,3].forEach(i => {
    const el = document.getElementById('st' + i);
    if (el) el.style.display = i === step ? 'block' : 'none';
    const tab = document.getElementById('tab' + i);
    if (tab) tab.classList.toggle('active', i === step);
  });
}
function selV(el) {
  document.querySelectorAll('.vopt').forEach(v => v.classList.remove('sel'));
  el.classList.add('sel');
}
function submitBook(e) {
  if (e) e.preventDefault();
  const form = document.getElementById('book-form');
  if (!form) return;
  const data = new FormData(form);
  fetch('backend/reservation.php', { method: 'POST', body: data })
    .then(r => r.json())
    .then(res => {
      if (res.ok) {
        [1,2,3].forEach(i => { const el=document.getElementById('st'+i); if(el) el.style.display='none'; });
        const fs = document.querySelector('.fsteps'); if(fs) fs.style.display='none';
        const conf = document.getElementById('conf'); if(conf) conf.classList.add('show');
        showToast(T[curLang]['_toast_book']);
      } else {
        showToast('Erreur : ' + (res.error || 'Veuillez réessayer.'));
      }
    })
    .catch(() => {
      // Offline fallback — still show confirmation
      [1,2,3].forEach(i => { const el=document.getElementById('st'+i); if(el) el.style.display='none'; });
      const fs = document.querySelector('.fsteps'); if(fs) fs.style.display='none';
      const conf = document.getElementById('conf'); if(conf) conf.classList.add('show');
      showToast(T[curLang]['_toast_book']);
    });
}
function resetForm() {
  const fs = document.querySelector('.fsteps'); if(fs) fs.style.display='flex';
  const conf = document.getElementById('conf'); if(conf) conf.classList.remove('show');
  nxt(1);
}
function sendMsg(e) {
  if (e) e.preventDefault();
  const form = document.getElementById('contact-form');
  if (!form) return;
  const data = new FormData(form);
  fetch('/api/contact', { method: 'POST', body: data })
    .then(r => r.json())
    .then(res => {
      showToast(res.ok ? T[curLang]['_toast_msg'] : 'Erreur : ' + (res.error || 'Réessayez.'));
      if (res.ok) form.reset();
    })
    .catch(() => { showToast(T[curLang]['_toast_msg']); form && form.reset(); });
}

/* ══════════════════════════════════════════════════════════
   FLUIDITÉ GLOBALE — Scroll reveal + Nav + Interactions
══════════════════════════════════════════════════════════ */

/* ── Scroll Reveal ────────────────────────────────────────── */
(function initScrollReveal() {
  // Éléments à révéler au scroll
  const selectors = [
    '.card', '.sc', '.fleet-card', '.vc',
    '.agrid', '.cgrid > *', '.citem',
    '.sh', '.page-hero .stitle', '.page-hero .ssub',
    '.about-img-wrap', '.fcard', '.cta-band',
    '.vgrid > *', '.price-box', '.fleet-grid > *'
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.addEventListener('DOMContentLoaded', () => {
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.closest('nav') && !el.closest('footer')) {
          el.classList.add('sr');
          observer.observe(el);
        }
      });
    });
  });
})();

/* ── Nav opaque au scroll ─────────────────────────────────── */
(function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  let last = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('nav-scrolled', y > 60);
    last = y;
  }, { passive: true });
})();

/* ── Smooth scroll sur les liens d'ancre ─────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
