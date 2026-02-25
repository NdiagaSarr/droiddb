// Context Menu Module - Gestion des menus contextuels
export const ContextMenu = {
    currentMenu: null,

    /**
     * Affiche un menu contextuel
     */
    show(x, y, items) {
        this.hide(); // Ferme le menu précédent

        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        menu.innerHTML = items.map(item => {
            const className = item.danger ? 'context-menu-item danger' : 'context-menu-item';
            return `<div class="${className}" data-action="${item.action}">${item.icon} ${item.label}</div>`;
        }).join('');

        document.body.appendChild(menu);
        this.currentMenu = menu;

        // Ferme au clic extérieur
        setTimeout(() => {
            document.addEventListener('click', () => this.hide(), { once: true });
        }, 100);

        return menu;
    },

    /**
     * Cache le menu contextuel
     */
    hide() {
        if (this.currentMenu) {
            this.currentMenu.remove();
            this.currentMenu = null;
        }
    },

    /**
     * Menu contextuel pour une base de données
     */
    showDatabaseMenu(x, y, dbName, callbacks) {
        const items = [
            { icon: '📂', label: 'Ouvrir', action: 'open' },
            { icon: '✏️', label: 'Renommer', action: 'rename' },
            { icon: '📥', label: 'Exporter', action: 'export' },
            { icon: '🗑️', label: 'Supprimer', action: 'delete', danger: true }
        ];

        const menu = this.show(x, y, items);

        menu.addEventListener('click', (e) => {
            const item = e.target.closest('.context-menu-item');
            if (!item) return;

            const action = item.dataset.action;
            if (callbacks[action]) {
                callbacks[action](dbName);
            }
            this.hide();
        });
    },

    /**
     * Menu contextuel pour une table
     */
    showTableMenu(x, y, tableName, callbacks) {
        const items = [
            { icon: '👁️', label: 'Voir les données', action: 'view' },
            { icon: '🔑', label: 'Voir les index', action: 'indexes' },
            { icon: '➕', label: 'Créer un index', action: 'createIndex' },
            { icon: '✏️', label: 'Renommer', action: 'rename' },
            { icon: '⚡', label: 'Optimiser', action: 'optimize' },
            { icon: '🧹', label: 'Vider la table', action: 'truncate' },
            { icon: '🗑️', label: 'Supprimer', action: 'delete', danger: true }
        ];

        const menu = this.show(x, y, items);

        menu.addEventListener('click', (e) => {
            const item = e.target.closest('.context-menu-item');
            if (!item) return;

            const action = item.dataset.action;
            if (callbacks[action]) {
                callbacks[action](tableName);
            }
            this.hide();
        });
    }
};
