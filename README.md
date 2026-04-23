# EliteRide — Site Web Transport

## Structure des fichiers

```
/
├── index.html          ← Page d'accueil (Hero 3D + features)
├── services.html       ← Page des 6 services
├── reservation.html    ← Formulaire de réservation (3 étapes)
├── about.html          ← À propos / valeurs
├── contact.html        ← Formulaire de contact
│
├── css/
│   └── style.css       ← Styles partagés (couleurs neutres, dark theme)
│
├── js/
│   ├── main.js         ← Navigation, bilingue FR/EN, logique formulaires
│   └── waves.js        ← Arrière-plan 3D (Three.js — vagues fluides animées)
│
├── backend/
│   ├── db.php          ← Connexion PDO SQLite + création auto des tables
│   ├── reservation.php ← API POST — enregistre une réservation
│   ├── contact.php     ← API POST — enregistre un message
│   ├── admin.php       ← Lecture admin (Basic Auth)
│   └── schema.sql      ← Schéma SQL (référence / création manuelle)
│
└── data/
    └── eliteride.db    ← Base SQLite (créée automatiquement au 1er appel)
```

## Démarrage rapide (Python)

### Prérequis
- Python 3.8+ (vous avez déjà Python 3.12 ✅)
- Flask (installation en une commande)

### Lancer en local

```bash
# 1. Installer Flask (une seule fois) :
pip install flask

# 2. Depuis le dossier racine du site :
python3 server.py
```

Puis ouvrir **http://localhost:8000**

> La base de données `data/eliteride.db` est créée automatiquement au démarrage.

## Base de données SQLite

**Pourquoi SQLite ?**
- Aucune installation serveur (pas de MySQL/PostgreSQL)
- Fichier unique portable (`eliteride.db`)
- Parfait pour un service à taille humaine
- Sauvegarde simple : copier le fichier `.db`

### Tables

| Table          | Description                          |
|----------------|--------------------------------------|
| `reservations` | Toutes les demandes de trajet        |
| `messages`     | Messages du formulaire de contact    |

### Accès admin

```
http://localhost:8000/backend/admin.php?type=reservations
http://localhost:8000/backend/admin.php?type=messages
```

Identifiants par défaut (à modifier dans `admin.php`) :
- **Utilisateur** : `admin`
- **Mot de passe** : `eliteride2026`

## Fonctionnalités

- ✅ 5 pages HTML séparées avec CSS partagé
- ✅ Arrière-plan 3D vagues fluides animées (Three.js)
- ✅ Bilingue FR / EN (switch persistant via localStorage)
- ✅ Formulaire de réservation en 3 étapes
- ✅ Base de données SQLite via PHP PDO
- ✅ API REST légère (JSON responses)
- ✅ Design responsive (mobile friendly)
- ✅ Couleurs neutres élégantes (fond sombre + accents dorés)
# ILS-VTC
