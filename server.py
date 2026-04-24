"""
EliteRide — Serveur Python (Flask + SQLite)
==========================================
Lancement :
    pip install flask
    python3 server.py

Puis ouvrir : http://localhost:8000
"""

import os
import sqlite3
import json
import re
from datetime import date, datetime
from functools import wraps
from flask import (
    Flask, request, jsonify, send_from_directory,
    send_file, abort, Response
)

# ─── Configuration ────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH  = os.path.join(BASE_DIR, "data", "eliteride.db")

ADMIN_USER = "admin"
ADMIN_PASS = "eliteride2026"   # ← changez en production

app = Flask(__name__, static_folder=BASE_DIR)


# ─── Base de données ──────────────────────────────────────────────────────────
def get_db():
    """Retourne une connexion SQLite avec Row factory."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    """Crée les tables si elles n'existent pas encore."""
    with get_db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS reservations (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                prenom      TEXT NOT NULL,
                nom         TEXT NOT NULL,
                email       TEXT NOT NULL,
                telephone   TEXT NOT NULL,
                depart      TEXT NOT NULL,
                destination TEXT NOT NULL,
                date_trajet TEXT NOT NULL,
                heure       TEXT NOT NULL,
                service     TEXT NOT NULL,
                passagers   TEXT NOT NULL DEFAULT '1',
                vehicule    TEXT NOT NULL DEFAULT 'berline',
                notes       TEXT,
                statut      TEXT NOT NULL DEFAULT 'en_attente',
                created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
            );

            CREATE TABLE IF NOT EXISTS messages (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                prenom     TEXT NOT NULL,
                nom        TEXT NOT NULL,
                email      TEXT NOT NULL,
                sujet      TEXT NOT NULL,
                message    TEXT NOT NULL,
                lu         INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
            );
        """)
    print("✅  Base de données initialisée :", DB_PATH)


# ─── Helpers ──────────────────────────────────────────────────────────────────
def clean(val: str, max_len: int = 255) -> str:
    """Nettoie et tronque une valeur."""
    return str(val).strip()[:max_len]


def valid_email(email: str) -> bool:
    return bool(re.match(r"[^@]+@[^@]+\.[^@]+", email))


def ok(msg: str = "", **kwargs):
    return jsonify({"ok": True, "message": msg, **kwargs})


def err(msg: str, code: int = 400):
    return jsonify({"ok": False, "error": msg}), code


# ─── Basic Auth pour l'admin ──────────────────────────────────────────────────
def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or auth.username != ADMIN_USER or auth.password != ADMIN_PASS:
            return Response(
                "Accès refusé.",
                401,
                {"WWW-Authenticate": 'Basic realm="EliteRide Admin"'}
            )
        return f(*args, **kwargs)
    return decorated


# ─── Routes statiques (pages HTML) ───────────────────────────────────────────
@app.route("/")
def index():
    return send_file(os.path.join(BASE_DIR, "index.html"))


@app.route("/<path:filename>")
def static_files(filename):
    """Sert tous les fichiers statiques (HTML, CSS, JS, etc.)"""
    full = os.path.join(BASE_DIR, filename)
    if os.path.isfile(full):
        return send_from_directory(BASE_DIR, filename)
    abort(404)


# ─── API : Réservation ────────────────────────────────────────────────────────
@app.route("/backend/reservation", methods=["POST"])
@app.route("/backend/reservation.php", methods=["POST"])   # compat ancienne URL
def reservation():
    data = request.get_json(silent=True) or request.form.to_dict()

    # Champs obligatoires
    required = {
        "prenom": data.get("prenom", ""),
        "nom":    data.get("nom", ""),
        "email":  data.get("email", ""),
        "telephone":   data.get("telephone", ""),
        "depart":      data.get("depart", ""),
        "destination": data.get("destination", ""),
        "heure":       data.get("heure", ""),
        "service":     data.get("service", ""),
    }
    # Le champ date peut s'appeler "date" ou "date_trajet"
    date_trajet = clean(data.get("date_trajet") or data.get("date") or "")

    missing = [k for k, v in required.items() if not str(v).strip()]
    if not date_trajet:
        missing.append("date_trajet")
    if missing:
        return err(f"Champs manquants : {', '.join(missing)}")

    if not valid_email(required["email"]):
        return err("Adresse email invalide.")

    # La date doit être aujourd'hui ou dans le futur
    try:
        trip_date = datetime.strptime(date_trajet, "%Y-%m-%d").date()
        if trip_date < date.today():
            return err("La date du trajet doit être aujourd'hui ou dans le futur.")
    except ValueError:
        return err("Format de date invalide (attendu : AAAA-MM-JJ).")

    try:
        with get_db() as conn:
            cursor = conn.execute("""
                INSERT INTO reservations
                    (prenom, nom, email, telephone, depart, destination,
                     date_trajet, heure, service, passagers, vehicule, notes)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
            """, (
                clean(required["prenom"]),
                clean(required["nom"]),
                clean(required["email"]),
                clean(required["telephone"]),
                clean(required["depart"]),
                clean(required["destination"]),
                date_trajet,
                clean(required["heure"]),
                clean(required["service"]),
                clean(data.get("passagers", "1")),
                clean(data.get("vehicule", "berline")),
                clean(data.get("notes", ""), 1000),
            ))
            new_id = cursor.lastrowid

        return ok("Réservation enregistrée avec succès.", id=new_id)

    except sqlite3.Error as e:
        print(f"[DB ERROR] {e}")
        return err("Erreur base de données. Veuillez réessayer.", 500)


# ─── API : Contact ────────────────────────────────────────────────────────────
@app.route("/backend/contact", methods=["POST"])
@app.route("/backend/contact.php", methods=["POST"])       # compat ancienne URL
def contact():
    data = request.get_json(silent=True) or request.form.to_dict()

    prenom  = clean(data.get("prenom", ""))
    nom     = clean(data.get("nom", ""))
    email   = clean(data.get("email", ""))
    sujet   = clean(data.get("sujet", ""))
    message = clean(data.get("message", ""), 2000)

    missing = [k for k, v in [("prenom", prenom), ("nom", nom), ("email", email),
                                ("sujet", sujet), ("message", message)] if not v]
    if missing:
        return err(f"Champs manquants : {', '.join(missing)}")

    if not valid_email(email):
        return err("Adresse email invalide.")

    try:
        with get_db() as conn:
            cursor = conn.execute("""
                INSERT INTO messages (prenom, nom, email, sujet, message)
                VALUES (?,?,?,?,?)
            """, (prenom, nom, email, sujet, message))
            new_id = cursor.lastrowid

        return ok("Message enregistré avec succès.", id=new_id)

    except sqlite3.Error as e:
        print(f"[DB ERROR] {e}")
        return err("Erreur base de données. Veuillez réessayer.", 500)


# ─── Admin : lecture des données ──────────────────────────────────────────────
@app.route("/admin")
@require_auth
def admin():
    """
    Interface admin minimale.
    Paramètre : ?type=reservations  ou  ?type=messages
    """
    record_type = request.args.get("type", "reservations")

    with get_db() as conn:
        if record_type == "messages":
            rows = conn.execute(
                "SELECT * FROM messages ORDER BY created_at DESC"
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM reservations ORDER BY created_at DESC"
            ).fetchall()

    data = [dict(r) for r in rows]
    return Response(
        json.dumps({"ok": True, "count": len(data), "data": data},
                   ensure_ascii=False, indent=2),
        mimetype="application/json; charset=utf-8"
    )


# ─── Lancement ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    init_db()
    print()
    print("🚗  EliteRide — Serveur démarré")
    print("🌐  Ouvrir : http://localhost:8000")
    print("🔐  Admin  : http://localhost:8000/admin  (admin / eliteride2026)")
    print("    Arrêter : Ctrl+C")
    print()
    app.run(host="0.0.0.0", port=8000, debug=False)
