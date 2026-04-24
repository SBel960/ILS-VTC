<?php
/**
 * EliteRide — Admin : lecture des réservations et messages.
 * Accès : GET /backend/admin.php?type=reservations  ou  ?type=messages
 *
 * ⚠️  Protégez cette page par un mot de passe ou IP-whitelist en production !
 */

// Simple basic-auth protection — change these credentials!
$ADMIN_USER = 'admin';
$ADMIN_PASS = 'eliteride2026';

if (!isset($_SERVER['PHP_AUTH_USER'])
    || $_SERVER['PHP_AUTH_USER'] !== $ADMIN_USER
    || $_SERVER['PHP_AUTH_PW']   !== $ADMIN_PASS) {
    header('WWW-Authenticate: Basic realm="EliteRide Admin"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Accès refusé.';
    exit;
}

require_once __DIR__ . '/db.php';

$type = $_GET['type'] ?? 'reservations';
$db   = getDB();

header('Content-Type: application/json; charset=utf-8');

if ($type === 'messages') {
    $rows = $db->query("SELECT * FROM messages ORDER BY created_at DESC")->fetchAll();
    echo json_encode(['ok' => true, 'count' => count($rows), 'data' => $rows], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    $rows = $db->query("SELECT * FROM reservations ORDER BY created_at DESC")->fetchAll();
    echo json_encode(['ok' => true, 'count' => count($rows), 'data' => $rows], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
