// Renderer Module - Rendu des éléments UI
export const Renderer = {
    /**
     * Rend un tableau de données
     */
    renderTable(data, containerId = 'content-area', title = null) {
        const container = document.getElementById(containerId);

        if (title) {
            document.getElementById('current-context').innerText = title;
        }

        if (!data || data.length === 0) {
            container.innerHTML = '<div class="empty-placeholder"><p>Aucune donnée</p></div>';
            return null;
        }

        const columns = Object.keys(data[0]);

        container.innerHTML = `
            <div style="margin-bottom: 1rem; color: var(--text-muted); font-size: 0.9rem; display: flex; justify-content: space-between; align-items: center;">
                <span>📊 ${data.length} ligne(s) • ${columns.length} colonne(s)</span>
                <span style="font-size: 0.85rem; opacity: 0.7;">💡 Double-cliquez sur une cellule pour éditer</span>
            </div>
            <div style="overflow: auto; height: calc(100% - 3rem); width: 100%;">
                <table class="data-table">
                    <thead>
                        <tr>
                            ${columns.map(c => `<th>${c}</th>`).join('')}
                            <th style="width: 100px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((row, idx) => `
                            <tr data-row-index="${idx}">
                                ${columns.map(col => {
            const value = row[col];
            const displayValue = value !== null ? value : '<em style="opacity:0.5">NULL</em>';
            return `<td class="editable-cell" data-column="${col}" data-value="${value !== null ? String(value).replace(/"/g, '&quot;') : ''}">${displayValue}</td>`;
        }).join('')}
                                <td>
                                    <button class="btn-delete-row" data-row-index="${idx}" title="Supprimer">🗑️</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        return data;
    },

    /**
     * Rend la liste des bases de données
     */
    renderDatabaseList(databases, containerId = 'db-list') {
        const container = document.getElementById(containerId);

        // S'assurer que databases est un tableau
        if (!Array.isArray(databases)) {
            console.error('databases is not an array:', databases);
            container.innerHTML = '<div class="empty-placeholder"><p>Erreur: format de données invalide</p></div>';
            return;
        }

        container.innerHTML = databases.map(db => `
            <div class="db-item" data-db-name="${db}">
                🗄️ ${db}
            </div>
        `).join('');
    },

    /**
     * Rend la liste des tables
     */
    renderTableList(tables, database) {
        const content = document.getElementById('content-area');
        document.getElementById('current-context').innerText = `Base: ${database}`;

        content.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="color: var(--text-main); margin-bottom: 0.5rem;">Tables de ${database}</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem;">📋 ${tables.length} table(s)</p>
            </div>
            <div class="info-grid">
                ${tables.map(table => `
                    <div class="info-card table-card" data-table-name="${table}">
                        <div class="info-label">TABLE</div>
                        <div class="info-value">${table}</div>
                        <button class="btn-secondary" onclick="window.dispatchEvent(new CustomEvent('loadTable', { detail: '${table}' }))">
                            Voir les données
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    },

    /**
     * Rend les index d'une table
     */
    renderIndexes(indexes, tableName, database) {
        const content = document.getElementById('content-area');
        document.getElementById('current-context').innerText = `Base: ${database} > ${tableName} > Index`;

        content.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="color: var(--text-main); margin-bottom: 0.5rem;">Index de la table ${tableName}</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem;">🔑 ${indexes.length} index trouvé(s)</p>
            </div>
            <div style="overflow: auto; height: calc(100% - 5rem);">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Colonne</th>
                            <th>Type</th>
                            <th>Unique</th>
                            <th>Séquence</th>
                            <th style="width: 100px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${indexes.map(idx => `
                            <tr>
                                <td>${idx.Key_name}</td>
                                <td>${idx.Column_name}</td>
                                <td>${idx.Index_type}</td>
                                <td>${idx.Non_unique === 0 ? '✅ Oui' : '❌ Non'}</td>
                                <td>${idx.Seq_in_index}</td>
                                <td>
                                    ${idx.Key_name !== 'PRIMARY' ? `<button class="btn-delete-row" onclick="window.dispatchEvent(new CustomEvent('deleteIndex', { detail: { table: '${tableName}', index: '${idx.Key_name}' } }))" title="Supprimer">🗑️</button>` : '<span style="opacity:0.5">-</span>'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    /**
     * Affiche l'écran de connexion
     */
    showLogin() {
        document.getElementById('login-screen').classList.add('active');
        document.getElementById('dashboard-screen').classList.remove('active');
    },

    /**
     * Affiche le tableau de bord
     */
    showDashboard(user) {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('dashboard-screen').classList.add('active');
        const userDisplay = document.getElementById('user-display');
        if (userDisplay) {
            userDisplay.textContent = `${user}@${window.location.hostname}`;
        }
    },

    /**
     * Affiche les données d'une table
     */
    renderTableData(data, structure, tableName, database) {
        const content = document.getElementById('content-area');
        document.getElementById('current-context').innerText = `Base: ${database} > Table: ${tableName}`;

        if (!data || data.length === 0) {
            content.innerHTML = `
                <div class="empty-placeholder">
                    <div class="icon">📄</div>
                    <p>Aucune ligne dans cette table</p>
                </div>
            `;
            return;
        }

        const columns = Object.keys(data[0]);

        content.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <h3 style="color: var(--text-main); margin-bottom: 0.5rem;">${tableName}</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem;">📊 ${data.length} ligne(s)</p>
            </div>
            <div style="overflow: auto; max-height: calc(100vh - 200px);">
                <table class="data-table">
                    <thead>
                        <tr>
                            ${columns.map(col => `<th>${col}</th>`).join('')}
                            <th style="width: 80px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((row, rowIndex) => `
                            <tr data-row-index="${rowIndex}">
                                ${columns.map(col => {
            const value = row[col];
            const displayValue = value === null ? '<em style="opacity:0.5">NULL</em>' : value;
            return `<td class="editable-cell" data-column="${col}" data-row='${JSON.stringify(row).replace(/'/g, "&#39;")}' data-value="${value}" contenteditable="true">${displayValue}</td>`;
        }).join('')}
                                <td>
                                    <button class="btn-delete-row" data-row='${JSON.stringify(row).replace(/'/g, "&#39;")}' title="Supprimer">🗑️</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    /**
     * Rend les résultats d'une requête SQL
     */
    renderQueryResults(results) {
        this.renderTable(results, 'content-area', 'Résultats de la requête');
    }
};
