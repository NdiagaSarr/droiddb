// Index Module - Gestion des index
import { ApiService } from '../services/api.js';
import { showError, showSuccess, confirm, prompt } from '../utils/helpers.js';

export const IndexManager = {
    /**
     * Affiche les index d'une table
     */
    async viewIndexes(database, tableName) {
        try {
            const indexes = await ApiService.query(`SHOW INDEX FROM \`${tableName}\``, database);
            return indexes;
        } catch (error) {
            showError(error.message);
            return [];
        }
    },

    /**
     * Crée un nouvel index
     */
    async createIndex(database, tableName, indexName, columnName, isUnique = false) {
        const sql = `CREATE ${isUnique ? 'UNIQUE ' : ''}INDEX \`${indexName}\` ON \`${database}\`.\`${tableName}\` (\`${columnName}\`)`;

        try {
            await ApiService.query(sql, database);
            showSuccess(`Index "${indexName}" créé avec succès !`);
            return true;
        } catch (error) {
            showError(error.message);
            return false;
        }
    },

    /**
     * Supprime un index
     */
    async deleteIndex(database, tableName, indexName) {
        if (!confirm(`Supprimer l'index "${indexName}" ?`)) {
            return false;
        }

        const sql = `DROP INDEX \`${indexName}\` ON \`${database}\`.\`${tableName}\``;

        try {
            await ApiService.query(sql, database);
            showSuccess(`Index "${indexName}" supprimé`);
            return true;
        } catch (error) {
            showError(error.message);
            return false;
        }
    }
};
