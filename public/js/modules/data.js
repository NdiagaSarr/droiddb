// Data Module - Gestion des données
import { ApiService } from '../services/api.js';
import { escapeSqlString, downloadFile, showError, showSuccess, confirm } from '../utils/helpers.js';

export const DataManager = {
    /**
     * Charge les données d'une table
     */
    async loadTableData(database, tableName) {
        try {
            const data = await ApiService.getTableData(database, tableName);
            return data;
        } catch (error) {
            showError(error.message);
            return [];
        }
    },

    /**
     * Insère une nouvelle ligne
     */
    async insertRow(database, tableName, data) {
        const columns = Object.keys(data).filter(key => data[key] !== '');
        const values = columns.map(col => escapeSqlString(data[col]));

        const sql = `INSERT INTO \`${database}\`.\`${tableName}\` (\`${columns.join('`, `')}\`) VALUES (${values.join(', ')})`;

        try {
            await ApiService.query(sql, database);
            showSuccess('Ligne insérée avec succès !');
            return true;
        } catch (error) {
            showError(error.message);
            return false;
        }
    },

    /**
     * Met à jour une cellule
     */
    async updateCell(database, tableName, columnName, newValue, whereConditions) {
        const sql = `UPDATE \`${database}\`.\`${tableName}\` SET \`${columnName}\` = ${escapeSqlString(newValue)} WHERE ${whereConditions} LIMIT 1`;

        try {
            await ApiService.query(sql, database);
            return true;
        } catch (error) {
            showError(error.message);
            return false;
        }
    },

    /**
     * Supprime une ligne
     */
    async deleteRow(database, tableName, whereConditions) {
        if (!confirm('Supprimer cette ligne ?')) {
            return false;
        }

        const sql = `DELETE FROM \`${database}\`.\`${tableName}\` WHERE ${whereConditions} LIMIT 1`;

        try {
            await ApiService.query(sql, database);
            showSuccess('Ligne supprimée');
            return true;
        } catch (error) {
            showError(error.message);
            return false;
        }
    },

    /**
     * Exporte les données en CSV
     */
    exportCSV(data, filename = 'export.csv') {
        if (!data || data.length === 0) {
            showError('Aucune donnée à exporter');
            return;
        }

        const columns = Object.keys(data[0]);
        let csv = columns.join(',') + '\n';

        data.forEach(row => {
            const values = columns.map(col => {
                const val = row[col];
                if (val === null) return '';
                return `"${String(val).replace(/"/g, '""')}"`;
            });
            csv += values.join(',') + '\n';
        });

        downloadFile(csv, filename, 'text/csv');
        showSuccess('Export CSV réussi !');
    },

    /**
     * Exporte les données en JSON
     */
    exportJSON(data, filename = 'export.json') {
        if (!data || data.length === 0) {
            showError('Aucune donnée à exporter');
            return;
        }

        const json = JSON.stringify(data, null, 2);
        downloadFile(json, filename, 'application/json');
        showSuccess('Export JSON réussi !');
    },

    /**
     * Construit une clause WHERE à partir d'un objet row
     */
    buildWhereClause(row) {
        const conditions = Object.keys(row).map(col => {
            const val = row[col];
            if (val === null) return `\`${col}\` IS NULL`;
            return `\`${col}\` = ${escapeSqlString(val)}`;
        });
        return conditions.join(' AND ');
    }
};
