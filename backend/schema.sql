-- ============================================================
--  EliteRide — Schéma SQLite
--  Exécuter manuellement si vous préférez créer la DB à la main :
--    sqlite3 data/eliteride.db < backend/schema.sql
-- ============================================================

PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

-- Table des réservations
CREATE TABLE IF NOT EXISTS reservations (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    prenom      TEXT NOT NULL,
    nom         TEXT NOT NULL,
    email       TEXT NOT NULL,
    telephone   TEXT NOT NULL,
    depart      TEXT NOT NULL,
    destination TEXT NOT NULL,
    date_trajet TEXT NOT NULL,          -- format YYYY-MM-DD
    heure       TEXT NOT NULL,          -- format HH:MM
    service     TEXT NOT NULL,          -- aeroport | professionnel | evenement | medical | longue | scolaire
    passagers   TEXT NOT NULL DEFAULT '1',
    vehicule    TEXT NOT NULL DEFAULT 'berline',   -- berline | suv | minibus
    notes       TEXT,
    statut      TEXT NOT NULL DEFAULT 'en_attente', -- en_attente | confirme | annule | termine
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    prenom     TEXT NOT NULL,
    nom        TEXT NOT NULL,
    email      TEXT NOT NULL,
    sujet      TEXT NOT NULL,
    message    TEXT NOT NULL,
    lu         INTEGER NOT NULL DEFAULT 0,   -- 0 = non lu, 1 = lu
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_res_email   ON reservations(email);
CREATE INDEX IF NOT EXISTS idx_res_date    ON reservations(date_trajet);
CREATE INDEX IF NOT EXISTS idx_res_statut  ON reservations(statut);
CREATE INDEX IF NOT EXISTS idx_msg_email   ON messages(email);
CREATE INDEX IF NOT EXISTS idx_msg_lu      ON messages(lu);
