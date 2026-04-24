<?php
/**
 * EliteRide — Endpoint: POST /backend/reservation.php
 * Enregistre une nouvelle réservation dans la base SQLite.
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

// ── Collect & validate ──────────────────────────────────────────────────────
$required = ['prenom','nom','email','telephone','depart','destination','date_trajet','heure','service'];
$data = [];

// Accept both form-data and JSON body
$body = file_get_contents('php://input');
$json = $body ? @json_decode($body, true) : null;
$src  = $json ?: $_POST;

// Map field names (form sends `date` but we store `date_trajet`)
$fieldMap = [
    'prenom'      => 'prenom',
    'nom'         => 'nom',
    'email'       => 'email',
    'telephone'   => 'telephone',
    'depart'      => 'depart',
    'destination' => 'destination',
    'date'        => 'date_trajet',   // HTML form name → DB column
    'date_trajet' => 'date_trajet',
    'heure'       => 'heure',
    'service'     => 'service',
    'passagers'   => 'passagers',
    'vehicule'    => 'vehicule',
    'notes'       => 'notes',
];

foreach ($fieldMap as $formKey => $dbKey) {
    if (isset($src[$formKey])) {
        $data[$dbKey] = clean($src[$formKey]);
    }
}

// Validate required fields
$missing = [];
foreach (['prenom','nom','email','telephone','depart','destination','date_trajet','heure','service'] as $f) {
    if (empty($data[$f])) $missing[] = $f;
}
if ($missing) {
    jsonResponse(false, 'Champs manquants : ' . implode(', ', $missing), ['error' => 'validation']);
}

// Validate email
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    jsonResponse(false, 'Adresse email invalide.', ['error' => 'email']);
}

// Validate date (must be today or future)
$tripDate = \DateTime::createFromFormat('Y-m-d', $data['date_trajet']);
$today    = new \DateTime('today');
if (!$tripDate || $tripDate < $today) {
    jsonResponse(false, 'La date du trajet doit être aujourd\'hui ou dans le futur.', ['error' => 'date']);
}

// ── Insert ───────────────────────────────────────────────────────────────────
try {
    $db   = getDB();
    $stmt = $db->prepare("
        INSERT INTO reservations
            (prenom, nom, email, telephone, depart, destination, date_trajet, heure, service, passagers, vehicule, notes)
        VALUES
            (:prenom, :nom, :email, :telephone, :depart, :destination, :date_trajet, :heure, :service, :passagers, :vehicule, :notes)
    ");
    $stmt->execute([
        ':prenom'      => $data['prenom'],
        ':nom'         => $data['nom'],
        ':email'       => $data['email'],
        ':telephone'   => $data['telephone'],
        ':depart'      => $data['depart'],
        ':destination' => $data['destination'],
        ':date_trajet' => $data['date_trajet'],
        ':heure'       => $data['heure'],
        ':service'     => $data['service'],
        ':passagers'   => $data['passagers'] ?? '1',
        ':vehicule'    => $data['vehicule']  ?? 'berline',
        ':notes'       => $data['notes']     ?? '',
    ]);
    $id = $db->lastInsertId();

    jsonResponse(true, 'Réservation enregistrée avec succès.', ['id' => (int)$id]);

} catch (\PDOException $e) {
    error_log('[EliteRide] DB error: ' . $e->getMessage());
    jsonResponse(false, 'Erreur base de données. Veuillez réessayer.', ['error' => 'db']);
}
