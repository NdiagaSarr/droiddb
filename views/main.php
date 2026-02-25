<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Droid DB</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div id="app">
        <!-- Login Screen -->
        <div id="login-screen" class="screen active">
            <div class="login-card">
                <div class="logo">🤖 Droid DB</div>
                <form id="login-form">
                    <div class="form-group">
                        <label>Hôte</label>
                        <input type="text" name="host" value="localhost" required>
                    </div>
                    <div class="form-group">
                        <label>Utilisateur</label>
                        <input type="text" name="user" value="root" required>
                    </div>
                    <div class="form-group">
                        <label>Mot de passe</label>
                        <input type="password" name="password">
                    </div>
                    <button type="submit" class="btn-primary">Connexion</button>
                </form>
            </div>
        </div>

        <!-- Dashboard Screen -->
        <div id="dashboard-screen" class="screen">
            <aside class="sidebar">
                <div class="brand">🤖 Droid DB</div>
                
                <!-- Search Bar -->
                <div class="search-box">
                    <input type="text" id="table-search" placeholder="🔍 Rechercher une table..." />
                </div>
                
                <div class="db-list" id="db-list">
                    <!-- Database list will be injected here -->
                </div>
                <div id="user-display" style="padding: 1rem; color: var(--text-muted); font-size: 0.85rem; border-top: 1px solid var(--border); margin-top: auto;">
                    <!-- User info will be injected here -->
                </div>
                <button id="logout-btn" class="btn-secondary">Déconnexion</button>
            </aside>
            <main class="main-content">
                <header class="top-bar">
                    <h2 id="current-context">Sélectionnez une base de données</h2>
                    <div class="actions">
                        <button id="btn-create-db" class="btn-icon" title="Créer une base de données">➕</button>
                        <button id="btn-create-table" class="btn-icon" title="Créer une table" style="display:none;">📋</button>
                        <button id="btn-insert-row" class="btn-icon" title="Insérer une ligne" style="display:none;">✏️</button>
                        <button id="btn-advanced-search" class="btn-icon" title="Recherche avancée" style="display:none;">🔍</button>
                        <button id="btn-import-sql" class="btn-icon" title="Importer SQL">📂</button>
                        <button id="btn-export-data" class="btn-icon" title="Exporter les données">📥</button>
                        <button id="btn-sql-query" class="btn-icon" title="Exécuter SQL">⚡</button>
                        <button id="refresh-btn" class="btn-icon" title="Rafraîchir">🔄</button>
                    </div>
                </header>
                <div id="content-area">
                    <!-- Tables or Data will be injected here -->
                    <div class="empty-placeholder">
                        <div class="icon">💾</div>
                        <p>Prêt à gérer vos données</p>
                    </div>
                </div>
            </main>

            <!-- SQL Modal -->
            <div id="sql-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Exécuter une requête SQL</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <textarea id="sql-input" placeholder="SELECT * FROM ..."></textarea>
                    </div>
                    <div class="modal-footer">
                        <button id="btn-run-sql" class="btn-primary">Exécuter</button>
                    </div>
                </div>
            </div>

            <!-- Create Database Modal -->
            <div id="create-db-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Créer une base de données</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        <div class="form-group">
                            <label>Nom de la base de données</label>
                            <input type="text" id="new-db-name" placeholder="ma_base_de_donnees" />
                        </div>
                        <div class="form-group">
                            <label>Collation (optionnel)</label>
                            <select id="db-collation">
                                <option value="">Par défaut</option>
                                <option value="utf8mb4_general_ci">utf8mb4_general_ci</option>
                                <option value="utf8mb4_unicode_ci">utf8mb4_unicode_ci</option>
                                <option value="latin1_swedish_ci">latin1_swedish_ci</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="btn-create-db-confirm" class="btn-primary">Créer</button>
                    </div>
                </div>
            </div>

            <!-- Create Table Modal -->
            <div id="create-table-modal" class="modal">
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <h3>Créer une table</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        <div class="form-group">
                            <label>Nom de la table</label>
                            <input type="text" id="new-table-name" placeholder="ma_table" />
                        </div>
                        <div class="form-group">
                            <label>Colonnes</label>
                            <div id="columns-container">
                                <div class="column-row">
                                    <input type="text" placeholder="Nom" class="col-name" />
                                    <select class="col-type">
                                        <option value="INT">INT</option>
                                        <option value="VARCHAR(255)">VARCHAR(255)</option>
                                        <option value="TEXT">TEXT</option>
                                        <option value="DATE">DATE</option>
                                        <option value="DATETIME">DATETIME</option>
                                        <option value="BOOLEAN">BOOLEAN</option>
                                    </select>
                                    <label><input type="checkbox" class="col-null" /> NULL</label>
                                    <label><input type="checkbox" class="col-ai" /> AUTO_INCREMENT</label>
                                    <label><input type="checkbox" class="col-pk" /> PRIMARY KEY</label>
                                </div>
                            </div>
                            <button id="btn-add-column" class="btn-secondary" style="margin-top: 1rem;">+ Ajouter une colonne</button>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="btn-create-table-confirm" class="btn-primary">Créer la table</button>
                    </div>
                </div>
            </div>

            <!-- Insert Row Modal -->
            <div id="insert-row-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Insérer une ligne</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        <div id="insert-form-container">
                            <!-- Form will be generated dynamically -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="btn-insert-confirm" class="btn-primary">Insérer</button>
                    </div>
                </div>
            </div>

            <!-- Import SQL Modal -->
            <div id="import-sql-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Importer un fichier SQL</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        <div class="form-group">
                            <label>Sélectionner un fichier .sql</label>
                            <input type="file" id="sql-file-input" accept=".sql" />
                        </div>
                        <div class="form-group">
                            <label>Aperçu</label>
                            <textarea id="sql-preview" readonly style="height: 200px; background: #0f172a; color: #e2e8f0; font-family: var(--font-mono); padding: 1rem; border: 1px solid var(--border); border-radius: var(--radius-sm);"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="btn-import-sql-confirm" class="btn-primary">Importer</button>
                    </div>
                </div>
            </div>

            <!-- Advanced Search Modal -->
            <div id="advanced-search-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Recherche Avancée</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div id="search-conditions">
                            <!-- Conditions will be added here dynamically -->
                        </div>
                        <button id="btn-add-condition" class="btn-secondary" style="margin-top: 1rem;">+ Ajouter une condition</button>
                    </div>
                    <div class="modal-footer">
                        <button id="btn-search-confirm" class="btn-primary">Rechercher</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="module" src="js/app.js?v=4"></script>
</body>
</html>
