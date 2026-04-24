/* ===================================================
   ILS VTC — Réservation : Autocomplete + Prix + Paiement
   API adresses : api-adresse.data.gouv.fr (gratuit, sans clé)
   Distances    : OSRM routing API          (gratuit, sans clé)
   Paiement     : Stripe Checkout           (clé requise côté serveur)
   =================================================== */

const PRICE_PER_KM = 2.10;
const MIN_FARE     = 15.00;

/* ─── Données partagées ───────────────────────────────── */
let coords = { depart: null, dest: null };

/* ─── Autocomplete générique ──────────────────────────── */
function setupAutocomplete(inputId, listId, latId, lonId, onSelect) {
  const input = document.getElementById(inputId);
  const list  = document.getElementById(listId);
  if (!input || !list) return;

  let timer;

  input.addEventListener('input', function () {
    clearTimeout(timer);
    const q = this.value.trim();
    if (q.length < 3) { hideList(list); return; }

    timer = setTimeout(() => {
      // Recherche prioritaire autour de Blois (lat 47.59, lon 1.33)
      const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=6&lat=47.59&lon=1.33`;

      fetch(url)
        .then(r => r.json())
        .then(data => {
          list.innerHTML = '';
          if (!data.features || !data.features.length) { hideList(list); return; }

          data.features.forEach(f => {
            const li        = document.createElement('li');
            li.className    = 'ac-item';
            li.textContent  = f.properties.label;
            li.dataset.lat  = f.geometry.coordinates[1];
            li.dataset.lon  = f.geometry.coordinates[0];

            li.addEventListener('mousedown', function (e) {
              e.preventDefault();
              input.value = this.textContent;
              hideList(list);
              if (onSelect) onSelect(this.dataset.lat, this.dataset.lon);
            });

            list.appendChild(li);
          });

          list.style.display = 'block';
        })
        .catch(() => hideList(list));
    }, 280);
  });

  input.addEventListener('blur', () => setTimeout(() => hideList(list), 200));

  // Fermer si on clique ailleurs
  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !list.contains(e.target)) hideList(list);
  });
}

function hideList(list) { if (list) list.style.display = 'none'; }

/* ─── Calcul distance + prix (OSRM) ──────────────────── */
async function calcRoute() {
  const { depart, dest } = coords;
  if (!depart || !dest) return;

  document.getElementById('price-box').style.display     = 'none';
  document.getElementById('price-loading').style.display = 'flex';

  try {
    const url  = `https://router.project-osrm.org/route/v1/driving/${depart.lon},${depart.lat};${dest.lon},${dest.lat}?overview=false`;
    const res  = await fetch(url);
    const data = await res.json();

    if (data.code !== 'Ok') throw new Error('OSRM error');

    const distKm  = (data.routes[0].distance / 1000).toFixed(1);
    const durMin  = Math.round(data.routes[0].duration / 60);
    const price   = Math.max(MIN_FARE, parseFloat(distKm) * PRICE_PER_KM).toFixed(2);
    const priceF  = price.replace('.', ',');

    document.getElementById('p-km').textContent   = `${distKm} km`;
    document.getElementById('p-dur').textContent  = `≈ ${durMin} min`;
    document.getElementById('p-val').textContent  = `${priceF} €`;
    document.getElementById('montant-inp').value  = price;
    document.getElementById('distance-inp').value = distKm;

    // Mettre à jour le récap étape 3
    updateRecap(distKm, price);

    document.getElementById('price-loading').style.display = 'none';
    document.getElementById('price-box').style.display     = 'flex';

  } catch {
    document.getElementById('price-loading').style.display = 'none';
    // En cas d'erreur OSRM, afficher quand même le minimum
    document.getElementById('p-km').textContent   = '— km';
    document.getElementById('p-dur').textContent  = '';
    document.getElementById('p-val').textContent  = `${MIN_FARE.toFixed(2).replace('.', ',')} € min.`;
    document.getElementById('montant-inp').value  = MIN_FARE;
    document.getElementById('price-box').style.display = 'flex';
  }
}

function updateRecap(distKm, price) {
  const dep    = document.getElementById('depart-inp')?.value || '';
  const dst    = document.getElementById('dest-inp')?.value   || '';
  const priceF = parseFloat(price).toFixed(2).replace('.', ',');

  const recapEl = document.getElementById('recap-box');
  if (recapEl) recapEl.style.display = 'flex';

  const routeEl = document.getElementById('recap-route');
  if (routeEl) routeEl.textContent = `${dep} → ${dst}`;

  const priceEl = document.getElementById('recap-price');
  if (priceEl) priceEl.textContent = `${priceF} €`;

  const payEl = document.getElementById('pay-amount');
  if (payEl) payEl.textContent = `${priceF} €`;
}

/* ─── Sélection véhicule ──────────────────────────────── */
function selV(el, vehId) {
  document.querySelectorAll('.vopt').forEach(v => v.classList.remove('sel'));
  el.classList.add('sel');
  document.getElementById('veh-input').value = vehId;

  const notice = document.getElementById('veh-notice');
  const recap  = document.getElementById('recap-veh');
  if (notice) notice.style.display = vehId === 'camionnette' ? 'flex' : 'none';
  if (recap)  recap.textContent    = vehId === 'camionnette' ? 'Camionnette' : 'Toyota C-HR';
}

/* ─── Navigation étapes ───────────────────────────────── */
function nxtStep(step) {
  // Validation véhicule camionnette : 5 jours minimum
  if (step === 3) {
    const veh  = document.getElementById('veh-input')?.value;
    const date = document.getElementById('trip-date')?.value;
    if (veh === 'camionnette' && date) {
      const tripDate = new Date(date);
      const minDate  = new Date();
      minDate.setDate(minDate.getDate() + 5);
      minDate.setHours(0, 0, 0, 0);
      if (tripDate < minDate) {
        showToast('⚠ La camionnette nécessite 5 jours de préavis minimum.');
        return;
      }
    }
    // Mettre à jour le récapitulatif
    const montant = document.getElementById('montant-inp')?.value;
    if (montant) updateRecap(
      document.getElementById('distance-inp')?.value || '?',
      montant
    );
  }

  [1, 2, 3].forEach(i => {
    const el  = document.getElementById('st' + i);
    const tab = document.getElementById('tab' + i);
    if (el)  el.style.display = i === step ? 'block' : 'none';
    if (tab) tab.classList.toggle('active', i === step);
  });

  // Scroll vers le formulaire
  document.querySelector('.fcard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ─── Soumission formulaire → WhatsApp automatique ───────── */
function submitBook(e) {
  if (e) e.preventDefault();
  const form = document.getElementById('book-form');
  if (!form) return;

  const btn = form.querySelector('[type=submit]');
  if (btn) { btn.disabled = true; btn.textContent = 'Envoi en cours…'; }

  const data = new FormData(form);

  const dep = document.getElementById('depart-inp')?.value || '';
  const dst = document.getElementById('dest-inp')?.value || '';
  const km  = document.getElementById('p-km')?.textContent || '';
  const eur = document.getElementById('montant-inp')?.value || '15';
  const dv  = document.getElementById('trip-date')?.value || '';
  const h   = document.querySelector('[name=heure]')?.value || '';
  const veh = document.getElementById('veh-input')?.value || '';
  const pre = document.querySelector('[name=prenom]')?.value || '';

  const waMsg = encodeURIComponent(
    `Bonjour ILS VTC 👋\n\n` +
    `Je souhaite réserver un trajet :\n` +
    `📍 ${dep} → ${dst}\n` +
    `📅 ${dv} à ${h}\n` +
    `🚙 ${veh === 'camionnette' ? 'Camionnette' : 'Toyota C-HR'}\n` +
    `💶 ~${parseFloat(eur).toFixed(2)} € (${km})\n\n` +
    `Merci de confirmer la disponibilité.\n— ${pre}`
  );

  fetch('/api/reservation', { method: 'POST', body: data })
    .then(r => r.json())
    .catch(() => ({ ok: true }))   // hors-ligne : on continue quand même
    .then(() => {
      showConfirmation();
      // Ouvrir WhatsApp avec le message pré-rempli (le client n'a qu'à appuyer Envoyer)
      setTimeout(() => window.open(`https://wa.me/33641351859?text=${waMsg}`, '_blank'), 800);
    })
    .finally(() => {
      if (btn) { btn.disabled = false; btn.textContent = 'Envoyer ma demande →'; }
    });
}

function showConfirmation() {
  [1, 2, 3].forEach(i => {
    const el = document.getElementById('st' + i); if (el) el.style.display = 'none';
  });
  const fs = document.querySelector('.fsteps'); if (fs) fs.style.display = 'none';
  const cf = document.getElementById('conf');   if (cf) cf.classList.add('show');
  if (typeof showToast === 'function') showToast('Réservation enregistrée. Confirmation dans les 30 min.');
}

function resetForm() {
  const fs = document.querySelector('.fsteps'); if (fs) fs.style.display = 'flex';
  const cf = document.getElementById('conf');   if (cf) cf.classList.remove('show');
  document.getElementById('book-form')?.reset();
  coords = { depart: null, dest: null };
  document.getElementById('price-box').style.display     = 'none';
  document.getElementById('price-loading').style.display = 'none';
  document.getElementById('recap-box').style.display     = 'none';
  nxtStep(1);
}

/* ─── Initialisation ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Date minimum = aujourd'hui
  const di = document.getElementById('trip-date');
  if (di) di.min = new Date().toISOString().split('T')[0];

  // Autocomplete départ
  setupAutocomplete('depart-inp', 'depart-list', 'depart-lat', 'depart-lon', (lat, lon) => {
    coords.depart = { lat, lon };
    document.getElementById('depart-lat').value = lat;
    document.getElementById('depart-lon').value = lon;
    if (coords.dest) calcRoute();
  });

  // Autocomplete destination
  setupAutocomplete('dest-inp', 'dest-list', 'dest-lat', 'dest-lon', (lat, lon) => {
    coords.dest = { lat, lon };
    document.getElementById('dest-lat').value = lat;
    document.getElementById('dest-lon').value = lon;
    if (coords.depart) calcRoute();
  });
});
