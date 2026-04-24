<?php
/**
 * EliteRide — Database connection (SQLite via PDO)
 * Le fichier .db est créé automatiquement à la première connexion.
 */

define('DB_PATH', __DIR__ . '/../data/eliteride.db');

function getDB(): PDO {
    // Create /data/ directory if it doesn't exist
    $dir = dirname(DB_PATH);
    if (!is_dir($dir)) {
        mkdir($dir, 0750, true);
    }

    $pdo = new PDO('sqlite:' . DB_PATH);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Enable WAL mode for better concurrency
    $pdo->exec('PRAGMA journal_mode=WAL');
    $pdo->exec('PRAGMA foreign_keys=ON');

    // Create tables if they don't exist
    $pdo->exec("
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
    ");

    return $pdo;
}

/**
 * Sanitize input — strip tags, trim, limit length.
 */
function clean(string $val, int $max = 255): string {
    return substr(trim(strip_tags($val)), 0, $max);
}

/**
 * Send JSON response and exit.
 */
function jsonResponse(bool $ok, string $message = '', array $data = []): void {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array_merge(['ok' => $ok, 'message' => $message], $data));
    exit;
}
