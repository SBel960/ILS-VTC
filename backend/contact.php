<?php
/**
 * EliteRide — Endpoint: POST /backend/contact.php
 * Enregistre un message de contact dans la base SQLite.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/db.php';

// ── Collect ──────────────────────────────────────────────────────────────────
$body = file_get_contents('php://input');
$json = $body ? @json_decode($body, true) : null;
$src  = $json ?: $_POST;

$prenom  = clean($src['prenom']  ?? '');
$nom     = clean($src['nom']     ?? '');
$email   = clean($src['email']   ?? '');
$sujet   = clean($src['sujet']   ?? '');
$message = clean($src['message'] ?? '', 2000);

// ── Validate ─────────────────────────────────────────────────────────────────
$missing = [];
foreach (['prenom'=>$prenom,'nom'=>$nom,'email'=>$email,'sujet'=>$sujet,'message'=>$message] as $k=>$v) {
    if (!$v) $missing[] = $k;
}
if ($missing) {
    jsonResponse(false, 'Champs manquants : ' . implode(', ', $missing), ['error' => 'validation']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(false, 'Adresse email invalide.', ['error' => 'email']);
}

// ── Insert ───────────────────────────────────────────────────────────────────
try {
    $db   = getDB();
    $stmt = $db->prepare("
        INSERT INTO messages (prenom, nom, email, sujet, message)
        VALUES (:prenom, :nom, :email, :sujet, :message)
    ");
    $stmt->execute([
        ':prenom'  => $prenom,
        ':nom'     => $nom,
        ':email'   => $email,
        ':sujet'   => $sujet,
        ':message' => $message,
    ]);
    $id = $db->lastInsertId();

    jsonResponse(true, 'Message enregistré avec succès.', ['id' => (int)$id]);

} catch (\PDOException $e) {
    error_log('[EliteRide] DB error: ' . $e->getMessage());
    jsonResponse(false, 'Erreur base de données. Veuillez réessayer.', ['error' => 'db']);
}
