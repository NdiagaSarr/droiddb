# Droid DB

Une interface web moderne et intuitive pour gérer vos bases de données MySQL. Alternative légère et élégante à phpMyAdmin.

[![GitHub stars](https://img.shields.io/github/stars/NdiagaSarr/droiddb)](https://github.com/NdiagaSarr/droiddb)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/NdiagaSarr/droiddb/releases)
[![PHP](https://img.shields.io/badge/PHP-8.0+-purple)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-5.7+-orange)](https://mysql.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**[Dernière release](https://github.com/NdiagaSarr/droiddb/releases/latest)** | **[Signaler un bug](https://github.com/NdiagaSarr/droiddb/issues)** | **[Proposer une feature](https://github.com/NdiagaSarr/droiddb/issues)**

## Fonctionnalités

### Authentification
- Connexion sécurisée avec sessions PHP
- Support multi-utilisateurs
- Déconnexion en un clic

### Gestion des Bases de Données
- Liste de toutes les bases de données
- Création de nouvelles bases avec collation personnalisée
- Suppression de bases de données
- Renommage via déplacement de tables
- Export SQL complet (structure + données)

### Gestion des Tables
- Navigation visuelle des tables
- Création de tables avec définition de colonnes
- Suppression, vidage (TRUNCATE) et optimisation
- Renommage de tables
- Affichage de la structure (DESCRIBE)

### Gestion des Données
- Visualisation des données en tableau
- Édition en ligne (double-clic sur une cellule)
- Suppression de lignes
- Insertion de nouvelles lignes avec formulaire dynamique
- Recherche avancée multi-critères
- Export CSV et JSON

### Requêtes SQL
- Éditeur SQL intégré
- Exécution de requêtes personnalisées
- Import de fichiers SQL
- Visualisation des résultats

### Index
- Visualisation des index d'une table
- Création d'index (standard et unique)
- Suppression d'index

### Interface
- **Thème sombre moderne** "Blue Night"
- Design responsive et ergonomique
- Animations fluides
- Menu contextuel (clic droit)
- Raccourcis clavier
- Recherche rapide dans les tables

---

##  Installation

### Prérequis
- PHP 8.0 ou supérieur
- MySQL 5.7 ou supérieur
- Extensions PHP : `pdo`, `pdo_mysql`, `session`
- Serveur web (Apache, Nginx, etc.)

### Installation

1. **Cloner ou télécharger le projet** dans votre dossier web :
```bash
cd /var/www/html
git clone https://github.com/votre-repo/droid-db.git
# ou décompressez l'archive
```

2. **Configurer les permissions** (Linux/Mac) :
```bash
chmod -R 755 droid-db/
```

3. **Accéder à l'application** :
```
http://localhost/droid-db/public/
```

### Configuration Apache (.htaccess)

Le fichier `.htaccess` est déjà configuré pour rediriger toutes les requêtes vers `index.php` :

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

### Configuration Nginx

```nginx
server {
    listen 80;
    server_name droid-db.local;
    root /var/www/droid-db/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

---

##  Structure du Projet

```
droid_db/
 app/
    Config/
       Database.php          # Configuration et connexion PDO
    Controllers/
       AuthController.php    # Gestion authentification
       DbController.php      # Gestion DB/tables/données
    Core/
       Router.php            # Routeur API
    Models/
        DbModel.php           # Modèle d'accès aux données
 public/
    css/
       style.css             # Styles avec variables CSS
    js/
       app.js                # Point d'entrée principal
       services/
          api.js            # Service d'appels API
       modules/
          database.js       # Gestion des bases
          table.js          # Gestion des tables
          data.js           # Gestion des données
          index.js          # Gestion des index
       ui/
          renderer.js       # Rendu HTML
          modals.js         # Gestion des modales
          contextMenu.js    # Menus contextuels
       utils/
           helpers.js        # Fonctions utilitaires
    index.php                 # Point d'entrée PHP
 views/
    main.php                  # Template principal HTML
 .htaccess                     # Configuration Apache
 README.md                     # Ce fichier
```

---

##  Architecture Technique

### Backend (PHP)

**Architecture MVC simplifiée** :
- **Router** (`Core/Router.php`) : Route les requêtes API vers les contrôleurs
- **Controllers** : Gèrent la logique métier et les réponses JSON
- **Models** : Encapsulent l'accès aux données via PDO
- **Config** : Configuration de la connexion database

**Points forts** :
- Namespaces PHP PSR-4
- PDO avec requêtes préparées (sécurité)
- Gestion des erreurs avec try/catch
- Sessions PHP pour l'authentification
- API RESTful JSON

### Frontend (JavaScript)

**Architecture modulaire ES6** :
- **Modules** : Organisation fonctionnelle (database, table, data, index)
- **Services** : Couche d'accès à l'API
- **UI Components** : Rendu et interaction
- **Utils** : Fonctions réutilisables

**Points forts** :
- JavaScript moderne (ES6+) avec modules
- Pas de dépendances externes (vanilla JS)
- Gestion d'état centralisée (`AppState`)
- Event listeners dynamiques
- Fetch API pour les requêtes HTTP

### Sécurité

- **Injection SQL** : Requêtes préparées PDO + échappement des identifiants
- **XSS** : Échappement des données affichées (innerHTML sécurisé)
- **CSRF** : Sessions PHP avec cookies sécurisés
- **Authentification** : Vérification sur chaque requête API
- **Validation** : Validation côté client et serveur

---

##  Utilisation

### Connexion

1. Accédez à l'URL de l'application
2. Entrez vos identifiants MySQL :
   - **Hôte** : généralement `localhost`
   - **Utilisateur** : généralement `root`
   - **Mot de passe** : votre mot de passe MySQL
3. Cliquez sur **Connexion**

### Navigation

**Panneau latéral gauche** :
- Liste des bases de données
- Clic pour sélectionner une base
- Recherche rapide dans les tables

**Zone principale** :
- Affichage des tables (cartes cliquables)
- Données en tableau quand une table est sélectionnée

### Actions Rapides

| Bouton | Action |
|--------|--------|
| + | Créer une base de données |
| T | Créer une table |
| I | Insérer une ligne |
| S | Recherche avancée |
| F | Importer SQL |
| E | Exporter données |
| Q | Exécuter SQL |
| R | Rafraîchir |

### Édition en Ligne

1. Double-cliquez sur une cellule de données
2. Modifiez la valeur
3. Appuyez sur Entrée ou cliquez hors de la cellule
4. La modification est sauvegardée automatiquement

### Menu Contextuel (Clic Droit)

- **Sur une base** : Ouvrir, Renommer, Exporter, Supprimer
- **Sur une table** : Voir données, Index, Renommer, Optimiser, Vider, Supprimer

---

##  API Endpoints

Tous les endpoints retournent du JSON et nécessitent une session authentifiée (sauf `auth/login`).

### Authentification

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `?route=auth/login` | POST | Connexion (host, user, password) |
| `?route=auth/check_auth` | GET | Vérifier la session |
| `?route=auth/logout` | GET | Déconnexion |

### Bases de Données

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `?route=db/list_dbs` | GET | Liste des bases |
| `?route=db/list_tables&db=nom` | GET | Liste des tables |
| `?route=db/get_data&db=nom&table=nom` | GET | Données d'une table |
| `?route=db/query&db=nom` | POST | Exécuter SQL |

---

##  Personnalisation

### Thème

Le thème utilise des **variables CSS** dans `/public/css/style.css` :

```css
:root {
    --bg-body: #0f172a;        /* Fond principal */
    --bg-sidebar: #1e293b;      /* Sidebar */
    --primary: #38bdf8;         /* Couleur principale */
    --accent: #818cf8;          /* Accent */
    --text-main: #f8fafc;       /* Texte principal */
    --text-muted: #94a3b8;      /* Texte secondaire */
    /* ... */
}
```

Modifiez ces variables pour changer les couleurs.

### Limites

Le nombre de lignes récupérées est limité à **100** dans `DbModel::getData()`. Modifiez cette valeur si nécessaire.

---

##  Dépannage

### Erreur "Not authenticated"
- Vérifiez que les cookies/session sont activés dans PHP
- Vérifiez les permissions du dossier de session PHP

### Connexion MySQL échoue
- Vérifiez que MySQL est démarré
- Testez avec `test_mysql.php` fourni
- Vérifiez les identifiants (host, user, password)

### Modules JS ne chargent pas
- Vérifiez que votre serveur supporte les modules ES6
- Assurez-vous que les fichiers sont servis avec le bon MIME type
- Vérifiez la console du navigateur (F12)

### Problèmes de permissions
- Assurez-vous que PHP peut lire/écrire dans le dossier du projet
- Vérifiez les permissions des fichiers de session

---

##  Sécurité

 **Important** : Cette application est conçue pour un usage en environnement de développement ou local.

Pour une utilisation en production :
- Activez HTTPS
- Limitez l'accès par IP ou authentification HTTP
- Utilisez un utilisateur MySQL avec des privilèges limités
- Désactivez l'affichage des erreurs PHP
- Ajoutez une protection CSRF token

---

##  Changelog

### v1.0.0 (2025-02-25)
-  Version initiale
-  Interface complète avec thème sombre
-  Gestion CRUD bases, tables, données

## Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez une branche (`git checkout -b feature/ma-feature`)
3. Committez vos changements (`git commit -m 'Ajout de ma feature'`)
4. Pushez vers la branche (`git push origin feature/ma-feature`)
5. Ouvrez une Pull Request

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour plus de détails.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Auteur

Créé pour simplifier la gestion de bases de données MySQL.

## Remerciements

---

##  Remerciements

- [Outfit](https://fonts.google.com/specimen/Outfit) - Police principale
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) - Police monospace
- Inspiration UI : phpMyAdmin, Adminer, Beekeeper Studio

---

**Profitez de Droid DB !** 🤖
