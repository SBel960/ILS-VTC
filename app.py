"""
ILS VTC — Application Flask
SIRET : 84295268100018
Contact : ilieslassoued@gmail.com | 06 41 35 18 59

Variable d'environnement requise :
  SECRET_KEY → clé secrète Flask (n'importe quelle chaîne aléatoire)
"""

import os, sqlite3
from datetime import datetime
from flask import Flask, request, jsonify

try:
    from dotenv import load_dotenv; load_dotenv()
except ImportError:
    pass

app = Flask(__name__, static_folder='.', static_url_path='')
app.secret_key = os.environ.get('SECRET_KEY', 'ilsvtc_2024')

DATABASE = os.path.join(os.path.dirname(__file__), 'data', 'ilsvtc.db')


def get_db():
    os.makedirs(os.path.dirname(DATABASE), exist_ok=True)
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.executescript('''
        CREATE TABLE IF NOT EXISTS reservations (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            prenom        TEXT, nom           TEXT,
            telephone     TEXT, email         TEXT,
            depart        TEXT, destination   TEXT,
            date_trajet   TEXT, heure         TEXT,
            service       TEXT, passagers     TEXT,
            vehicule      TEXT, notes         TEXT,
            distance_km   REAL DEFAULT 0,
            montant       REAL DEFAULT 15,
            statut        TEXT DEFAULT 'en_attente',
            date_creation TEXT
        );
    ''')
    conn.commit()
    conn.close()


def save_resa(d):
    conn = get_db()
    cur = conn.execute('''
        INSERT INTO reservations
          (prenom,nom,telephone,email,depart,destination,
           date_trajet,heure,service,passagers,vehicule,notes,
           distance_km,montant,statut,date_creation)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ''', (
        d.get('prenom',''), d.get('nom',''),
        d.get('telephone',''), d.get('email',''),
        d.get('depart',''), d.get('destination',''),
        d.get('date','') or d.get('date_trajet',''),
        d.get('heure',''), d.get('service',''),
        d.get('passagers','1'), d.get('vehicule',''),
        d.get('notes',''),
        float(d.get('distance_km', 0)),
        float(d.get('montant', 15)),
        'en_attente',
        datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    ))
    rid = cur.lastrowid
    conn.commit()
    conn.close()
    return rid


# ── Routes pages ──────────────────────────────────────────────────────────────
@app.route('/')
def index(): return app.send_static_file('index.html')

@app.route('/services')
def services(): return app.send_static_file('services.html')

@app.route('/reservation')
def reservation_page(): return app.send_static_file('reservation.html')

@app.route('/about')
def about(): return app.send_static_file('about.html')

@app.route('/contact')
def contact_page(): return app.send_static_file('contact.html')

@app.route('/sitemap.xml')
def sitemap(): return app.send_static_file('sitemap.xml')

@app.route('/robots.txt')
def robots(): return app.send_static_file('robots.txt')

@app.route('/<path:filename>')
def static_files(filename):
    try: return app.send_static_file(filename)
    except: return app.send_static_file('index.html')


# ── API ───────────────────────────────────────────────────────────────────────
@app.route('/api/reservation', methods=['POST'])
def api_reservation():
    """Sauvegarde la réservation en base. WhatsApp géré côté JS."""
    d = request.form.to_dict()
    rid = save_resa(d)
    return jsonify({'ok': True, 'resa_id': rid})


@app.route('/api/contact', methods=['POST'])
def api_contact():
    """Message de contact — sauvegarde uniquement."""
    d = request.form.to_dict()
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS contacts
        (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT, email TEXT,
         telephone TEXT, sujet TEXT, message TEXT, date_creation TEXT)
    ''')
    conn.execute(
        'INSERT INTO contacts (nom,email,telephone,sujet,message,date_creation) VALUES (?,?,?,?,?,?)',
        (d.get('nom'), d.get('email'), d.get('telephone'),
         d.get('sujet'), d.get('message'),
         datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    )
    conn.commit()
    conn.close()
    return jsonify({'ok': True})


# ── Admin ─────────────────────────────────────────────────────────────────────
@app.route('/admin')
def admin():
    conn = get_db()
    try:
        rows = conn.execute('SELECT * FROM reservations ORDER BY date_creation DESC').fetchall()
    except: rows = []
    conn.close()
    css = """<style>body{font-family:Arial;padding:2rem;background:#0a0a12;color:#e8e4dd}
    h1{color:#9e8055}table{width:100%;border-collapse:collapse;font-size:12px}
    th{background:#16161f;color:#9e8055;padding:8px;text-align:left;border:1px solid #2a2a3a}
    td{padding:7px 8px;border:1px solid #1a1a28;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    a{color:#9e8055}</style>"""
    html = f"<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Admin ILS VTC</title>{css}</head><body>"
    html += f"<h1>🚗 ILS VTC — {len(rows)} réservation(s)</h1><table><tr>"
    for c in ['#','Prénom','Nom','Tél','Départ','Destination','Date','Heure','km','€','Statut']:
        html += f"<th>{c}</th>"
    html += "</tr>"
    for r in rows:
        html += (f"<tr><td>{r['id']}</td><td>{r['prenom']}</td><td>{r['nom']}</td>"
                 f"<td><a href='tel:{r['telephone']}'>{r['telephone']}</a></td>"
                 f"<td>{r['depart']}</td><td>{r['destination']}</td>"
                 f"<td>{r['date_trajet']}</td><td>{r['heure']}</td>"
                 f"<td>{r['distance_km']}</td>"
                 f"<td style='color:#9e8055;font-weight:bold'>{float(r['montant']):.2f}€</td>"
                 f"<td>{r['statut']}</td></tr>")
    html += "</table></body></html>"
    return html


# ─────────────────────────────────────────────────────────────────────────────
init_db()

if __name__ == '__main__':
    print("ILS VTC — Flask OK (sans Twilio)")
    app.run(debug=os.environ.get('FLASK_DEBUG','0')=='1',
            port=int(os.environ.get('PORT', 5000)))
