#  Changelog

Tous les changements notables de ce projet seront documentés ici.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/).

---

## [Unreleased]

### Added
-  En développement

---

## [1.0.0] - 2025-02-25

###  Release Initiale

####  Fonctionnalités

- **Authentification**
  - Connexion sécurisée avec sessions PHP
  - Support multi-utilisateurs
  - Déconnexion sécurisée

- **Gestion des Bases de Données**
  - Liste et navigation des bases
  - Création avec collation personnalisée
  - Suppression et renommage
  - Export SQL complet (structure + données)

- **Gestion des Tables**
  - Création avec définition de colonnes
  - Suppression, vidage (TRUNCATE)
  - Optimisation des tables
  - Visualisation de la structure

- **Gestion des Données**
  - Affichage en tableau paginé
  - Édition en ligne (double-clic)
  - Insertion avec formulaire dynamique
  - Suppression de lignes
  - Export CSV et JSON
  - Recherche avancée multi-critères

- **Requêtes SQL**
  - Éditeur intégré
  - Import de fichiers SQL
  - Exécution de requêtes personnalisées

- **Index**
  - Visualisation des index
  - Création (standard et unique)
  - Suppression

- **Interface Utilisateur**
  - Thème sombre "Blue Night"
  - Design responsive
  - Animations fluides
  - Menu contextuel
  - Raccourcis clavier

####  Architecture

- **Backend** : PHP 8.0+ avec architecture MVC
- **Frontend** : JavaScript ES6+ modulaire
- **Base de données** : MySQL 5.7+ via PDO
- **Sécurité** : Requêtes préparées, sessions PHP

####  Documentation

- README complet avec installation
- Guide de contribution
- Licence MIT
- Templates GitHub (issues, PR)

---

## Comment Contribuer

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les détails.

---

**Historique des versions :**

- [1.0.0] : Release initiale - 25 Février 2025

<!-- Template pour nouvelle version : -->
<!-- ## [X.Y.Z] - YYYY-MM-DD -->
<!-- ### Added -->
<!-- ### Changed -->
<!-- ### Deprecated -->
<!-- ### Removed -->
<!-- ### Fixed -->
<!-- ### Security -->
