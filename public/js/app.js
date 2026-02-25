import { ApiService } from './services/api.js?v=4';
import { DatabaseManager } from './modules/database.js?v=4';
import { TableManager } from './modules/table.js?v=4';
import { DataManager } from './modules/data.js?v=4';
import { IndexManager } from './modules/index.js?v=4';
import { Renderer } from './ui/renderer.js?v=4';
import { Modals } from './ui/modals.js?v=4';
import { ContextMenu } from './ui/contextMenu.js?v=4';
import { showError, showSuccess, confirm, prompt, downloadFile } from './utils/helpers.js?v=4';

// État global de l'application
const AppState = {
    currentDb: null,
    currentTable: null,
    currentData: [],
    user: null
};

const DroidDB = {
    init() {
        this.checkAuth();
        this.attachGlobalListeners();
        Modals.init();
    },

    async checkAuth() {
        try {
            const auth = await ApiService.checkAuth();
            if (auth.authenticated) {
                AppState.user = auth.user;
                Renderer.showDashboard(auth.user);
                await this.loadDatabases();
            } else {
                Renderer.showLogin();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            Renderer.showLogin();
        }
    },

    async loadDatabases() {
        const databases = await DatabaseManager.loadDatabases();
        Renderer.renderDatabaseList(databases);
        this.attachDatabaseListeners();
    },

    async selectDatabase(dbName) {
        AppState.currentDb = dbName;
        AppState.currentTable = null;

        document.querySelectorAll('.db-item').forEach(el => {
            el.classList.toggle('active', el.dataset.dbName === dbName);
        });

        this.updateButtonVisibility(false);

        const tables = await TableManager.loadTables(dbName);
        Renderer.renderTableList(tables, dbName);
        this.attachTableListeners();
    },

    async loadTable(tableName) {
        console.log('Loading table:', tableName);
        console.log('DataManager object:', DataManager);

        AppState.currentTable = tableName;
        this.updateButtonVisibility(true);

        try {
            if (typeof DataManager.loadTableData !== 'function') {
                console.error('CRITICAL: DataManager.loadTableData is NOT a function!', DataManager);
                showError('Erreur interne: DataManager.loadTableData manquant');
                return;
            }

            const data = await DataManager.loadTableData(AppState.currentDb, tableName);
            console.log('Data loaded:', data);
            AppState.currentData = data;

            const structure = await TableManager.getTableStructure(AppState.currentDb, tableName);
            console.log('Structure loaded:', structure);

            Renderer.renderTableData(data, structure, tableName, AppState.currentDb);
            this.attachDataListeners();
        } catch (error) {
            console.error('Error loading table:', error);
            showError('Erreur lors du chargement de la table: ' + error.message);
        }
    },

    updateButtonVisibility(isTableSelected) {
        const btnCreateDb = document.getElementById('btn-create-db');
        const btnCreateTable = document.getElementById('btn-create-table');
        const btnInsertRow = document.getElementById('btn-insert-row');
        const btnAdvancedSearch = document.getElementById('btn-advanced-search');

        if (btnCreateDb) btnCreateDb.style.display = 'inline-flex';
        if (btnCreateTable) btnCreateTable.style.display = isTableSelected ? 'none' : 'inline-flex';
        if (btnInsertRow) btnInsertRow.style.display = isTableSelected ? 'inline-flex' : 'none';
        if (btnAdvancedSearch) btnAdvancedSearch.style.display = isTableSelected ? 'inline-flex' : 'none';
    },

    attachGlobalListeners() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const creds = Object.fromEntries(formData);

                try {
                    const result = await ApiService.login(creds);
                    if (result && result.success !== false) {
                        AppState.user = creds.user;
                        Renderer.showDashboard(creds.user);
                        await this.loadDatabases();
                    } else {
                        showError('Échec de connexion');
                    }
                } catch (error) {
                    showError(error.message || 'Erreur de connexion');
                }
            });
        }

        document.getElementById('logout-btn').addEventListener('click', async () => {
            await ApiService.logout();
            window.location.reload();
        });

        document.getElementById('refresh-btn').addEventListener('click', () => {
            if (AppState.currentTable) {
                this.loadTable(AppState.currentTable);
            } else if (AppState.currentDb) {
                this.selectDatabase(AppState.currentDb);
            } else {
                this.loadDatabases();
            }
        });

        this.setupDatabaseButtons();
        this.setupTableButtons();
        this.setupDataButtons();
        this.setupSearchFeatures();
    },

    setupDatabaseButtons() {
        document.getElementById('btn-create-db').addEventListener('click', () => Modals.open('create-db-modal'));
        document.getElementById('btn-create-db-confirm').addEventListener('click', async () => {
            const name = document.getElementById('new-db-name').value.trim();
            const collation = document.getElementById('db-collation').value;

            if (!name) {
                showError('Veuillez entrer un nom de base de données');
                return;
            }

            const success = await DatabaseManager.createDatabase(name, collation);
            if (success) {
                Modals.close('create-db-modal');
                document.getElementById('new-db-name').value = '';
                await this.loadDatabases();
            }
        });
    },

    setupTableButtons() {
        document.getElementById('btn-create-table').addEventListener('click', () => {
            if (!AppState.currentDb) {
                showError('Veuillez sélectionner une base de données');
                return;
            }
            Modals.open('create-table-modal');
        });

        document.getElementById('btn-add-column').addEventListener('click', () => {
            const container = document.getElementById('columns-container');
            const newRow = document.createElement('div');
            newRow.className = 'column-row';
            newRow.innerHTML = `
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
            `;
            container.appendChild(newRow);
        });

        document.getElementById('btn-create-table-confirm').addEventListener('click', async () => {
            const tableName = document.getElementById('new-table-name').value.trim();
            if (!tableName) {
                showError('Veuillez entrer un nom de table');
                return;
            }

            const rows = document.querySelectorAll('.column-row');
            const columns = [];

            rows.forEach(row => {
                const name = row.querySelector('.col-name').value.trim();
                const type = row.querySelector('.col-type').value;
                const nullable = row.querySelector('.col-null').checked;
                const autoIncrement = row.querySelector('.col-ai').checked;
                const primaryKey = row.querySelector('.col-pk').checked;

                if (name) {
                    columns.push({ name, type, nullable, autoIncrement, primaryKey });
                }
            });

            if (columns.length === 0) {
                showError('Veuillez définir au moins une colonne');
                return;
            }

            const success = await TableManager.createTable(AppState.currentDb, tableName, columns);
            if (success) {
                Modals.close('create-table-modal');
                document.getElementById('new-table-name').value = '';
                await this.selectDatabase(AppState.currentDb);
            }
        });
    },

    setupDataButtons() {
        document.getElementById('btn-insert-row').addEventListener('click', async () => {
            if (!AppState.currentTable) {
                showError('Veuillez sélectionner une table');
                return;
            }

            const structure = await TableManager.getTableStructure(AppState.currentDb, AppState.currentTable);
            const formContainer = document.getElementById('insert-form-container');

            formContainer.innerHTML = structure.map(col => `
                <div class="form-group">
                    <label>${col.Field} (${col.Type})${col.Null === 'NO' ? ' *' : ''}</label>
                    <input type="text" 
                           id="insert-${col.Field}" 
                           placeholder="${col.Default || ''}"
                           ${col.Extra === 'auto_increment' ? 'disabled' : ''}
                           ${col.Null === 'NO' && col.Extra !== 'auto_increment' ? 'required' : ''} />
                </div>
            `).join('');

            Modals.open('insert-row-modal');
        });

        document.getElementById('btn-insert-confirm').addEventListener('click', async () => {
            const formContainer = document.getElementById('insert-form-container');
            const inputs = formContainer.querySelectorAll('input:not([disabled])');
            const data = {};

            inputs.forEach(input => {
                const field = input.id.replace('insert-', '');
                const value = input.value.trim();
                if (value) {
                    data[field] = value;
                }
            });

            if (Object.keys(data).length === 0) {
                showError('Veuillez remplir au moins un champ');
                return;
            }

            const success = await DataManager.insertRow(AppState.currentDb, AppState.currentTable, data);
            if (success) {
                Modals.close('insert-row-modal');
                await this.loadTable(AppState.currentTable);
            }
        });

        document.getElementById('btn-sql-query').addEventListener('click', async () => {
            const sql = prompt('Entrez votre requête SQL:');
            if (sql) {
                try {
                    const result = await ApiService.query(sql, AppState.currentDb);
                    if (Array.isArray(result)) {
                        Renderer.renderQueryResults(result);
                    } else {
                        showSuccess('Requête exécutée avec succès');
                        if (AppState.currentTable) this.loadTable(AppState.currentTable);
                    }
                } catch (error) {
                    showError(error.message);
                }
            }
        });

        document.getElementById('btn-export-data').addEventListener('click', () => {
            if (!AppState.currentData || AppState.currentData.length === 0) {
                showError('Aucune donnée à exporter');
                return;
            }

            const choice = prompt('Choisissez le format d\'export:\n1. CSV\n2. JSON\n\nEntrez 1 ou 2:');
            if (choice === '1') {
                DataManager.exportCSV(AppState.currentData, `${AppState.currentTable || 'export'}.csv`);
            } else if (choice === '2') {
                DataManager.exportJSON(AppState.currentData, `${AppState.currentTable || 'export'}.json`);
            }
        });

        document.getElementById('btn-import-sql').addEventListener('click', () => Modals.open('import-sql-modal'));
        document.getElementById('sql-file-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    document.getElementById('sql-preview').value = event.target.result;
                };
                reader.readAsText(file);
            }
        });

        document.getElementById('btn-import-sql-confirm').addEventListener('click', async () => {
            const sql = document.getElementById('sql-preview').value.trim();

            if (!sql) {
                showError('Aucun contenu SQL à importer');
                return;
            }

            if (!confirm('Exécuter ce fichier SQL ?\n\nCela peut modifier votre base de données.')) {
                return;
            }

            try {
                await ApiService.query(sql, AppState.currentDb || '');
                Modals.close('import-sql-modal');
                document.getElementById('sql-file-input').value = '';
                document.getElementById('sql-preview').value = '';
                await this.loadDatabases();
                if (AppState.currentDb) {
                    await this.selectDatabase(AppState.currentDb);
                }
                showSuccess('Import SQL réussi !');
            } catch (error) {
                showError(error.message);
            }
        });
    },

    setupSearchFeatures() {
        document.getElementById('table-search').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            document.querySelectorAll('.table-card').forEach(item => {
                const tableName = item.dataset.tableName.toLowerCase();
                item.style.display = tableName.includes(searchTerm) ? 'flex' : 'none';
            });
        });

        document.getElementById('btn-advanced-search').addEventListener('click', async () => {
            if (!AppState.currentTable) return;

            const structure = await TableManager.getTableStructure(AppState.currentDb, AppState.currentTable);
            const columns = structure.map(col => col.Field);

            const container = document.getElementById('search-conditions');
            container.innerHTML = '';
            this.addSearchCondition(container, columns);

            Modals.open('advanced-search-modal');
            container.dataset.columns = JSON.stringify(columns);
        });

        document.getElementById('btn-add-condition').addEventListener('click', () => {
            const container = document.getElementById('search-conditions');
            const columns = JSON.parse(container.dataset.columns || '[]');
            this.addSearchCondition(container, columns);
        });

        document.getElementById('btn-search-confirm').addEventListener('click', async () => {
            const conditions = [];
            document.querySelectorAll('.search-condition-row').forEach(row => {
                const col = row.querySelector('.search-col').value;
                const op = row.querySelector('.search-op').value;
                const val = row.querySelector('.search-val').value;

                if (val) {
                    conditions.push({ col, op, val });
                }
            });

            if (conditions.length === 0) {
                showError('Veuillez ajouter au moins une condition');
                return;
            }

            const whereClause = conditions.map(c => {
                const val = isNaN(c.val) ? `'${c.val}'` : c.val;
                return `\`${c.col}\` ${c.op} ${val}`;
            }).join(' AND ');

            try {
                const sql = `SELECT * FROM \`${AppState.currentTable}\` WHERE ${whereClause}`;
                const result = await ApiService.query(sql, AppState.currentDb);

                Modals.close('advanced-search-modal');

                const structure = await TableManager.getTableStructure(AppState.currentDb, AppState.currentTable);
                Renderer.renderTableData(result, structure, AppState.currentTable, AppState.currentDb);
                showSuccess(`${result.length} résultats trouvés`);
            } catch (error) {
                showError(error.message);
            }
        });
    },

    addSearchCondition(container, columns) {
        const row = document.createElement('div');
        row.className = 'search-condition-row';
        row.style.display = 'flex';
        row.style.gap = '0.5rem';
        row.style.marginBottom = '0.5rem';

        row.innerHTML = `
            <select class="search-col" style="flex: 1;">
                ${columns.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
            <select class="search-op" style="width: 80px;">
                <option value="=">=</option>
                <option value="!=">!=</option>
                <option value="LIKE">LIKE</option>
                <option value=">">></option>
                <option value="<"><</option>
                <option value=">=">>=</option>
                <option value="<="><=</option>
            </select>
            <input type="text" class="search-val" placeholder="Valeur" style="flex: 1;" />
            <button class="btn-remove-condition" style="background: none; border: none; cursor: pointer;">❌</button>
        `;

        row.querySelector('.btn-remove-condition').addEventListener('click', () => row.remove());
        container.appendChild(row);
    },

    attachDatabaseListeners() {
        document.querySelectorAll('.db-item').forEach(item => {
            item.addEventListener('click', () => {
                const dbName = item.dataset.dbName;
                this.selectDatabase(dbName);
            });
        });
    },

    attachTableListeners() {
        document.querySelectorAll('.table-card').forEach(item => {
            item.addEventListener('click', () => {
                const tableName = item.dataset.tableName;
                this.loadTable(tableName);
            });
        });
    },

    attachDataListeners() {
        document.querySelectorAll('[contenteditable="true"]').forEach(cell => {
            cell.addEventListener('blur', async (e) => {
                const newValue = e.target.textContent;
                const columnName = e.target.dataset.column;
                const rowData = JSON.parse(e.target.dataset.row);
                const whereClause = DataManager.buildWhereClause(rowData);

                await DataManager.updateCell(AppState.currentDb, AppState.currentTable, columnName, newValue, whereClause);
            });
        });

        document.querySelectorAll('.btn-delete-row').forEach(btn => {
            btn.addEventListener('click', async () => {
                const rowData = JSON.parse(btn.dataset.row);
                const whereClause = DataManager.buildWhereClause(rowData);

                const success = await DataManager.deleteRow(AppState.currentDb, AppState.currentTable, whereClause);
                if (success) {
                    await this.loadTable(AppState.currentTable);
                }
            });
        });
    }
};

DroidDB.init();
