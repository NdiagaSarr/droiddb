// API Service - Centralise tous les appels API
const API_URL = 'index.php';

export const ApiService = {
    /**
     * Exécute une requête SQL
     */
    async query(sql, database = '') {
        const res = await fetch(`${API_URL}?route=db/query&db=${database}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ sql })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Erreur lors de l\'exécution de la requête');
        }

        return await res.json();
    },

    /**
     * Liste toutes les bases de données
     */
    async listDatabases() {
        const res = await fetch(`${API_URL}?route=db/list_dbs`, {
            credentials: 'include'
        });
        if (!res.ok) throw new Error('Impossible de récupérer les bases de données');
        return await res.json();
    },

    /**
     * Liste les tables d'une base de données
     */
    async listTables(database) {
        const res = await fetch(`${API_URL}?route=db/list_tables&db=${database}`, {
            credentials: 'include'
        });
        if (!res.ok) throw new Error('Impossible de récupérer les tables');
        return await res.json();
    },

    /**
     * Récupère les données d'une table
     */
    async getTableData(database, table) {
        const res = await fetch(`${API_URL}?route=db/get_data&db=${database}&table=${table}`, {
            credentials: 'include'
        });
        if (!res.ok) throw new Error('Impossible de récupérer les données');
        return await res.json();
    },

    /**
     * Authentification
     */
    async login(credentials) {
        const res = await fetch(`${API_URL}?route=auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(credentials)
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Erreur de connexion');
        }

        return await res.json();
    },

    /**
     * Vérification de l'authentification
     */
    async checkAuth() {
        const res = await fetch(`${API_URL}?route=auth/check_auth`, {
            credentials: 'include'
        });
        return await res.json();
    },

    /**
     * Déconnexion
     */
    async logout() {
        await fetch(`${API_URL}?route=auth/logout`, {
            credentials: 'include'
        });
    }
};
