// Table Module - Gestion des tables
import { ApiService } from '../services/api.js';
import { escapeSqlString, showError, showSuccess, confirm } from '../utils/helpers.js';

export const TableManager = {
    /**
     * Crée une nouvelle table
     */
    async createTable(database, tableName, columns) {
        const columnDefs = columns.map(col => {
            let def = `\`${col.name}\` ${col.type}`;
            if (!col.nullable) def += ' NOT NULL';
            if (col.autoIncrement) def += ' AUTO_INCREMENT';
            if (col.primaryKey) def += ' PRIMARY KEY';
            return def;
        });

        const sql = `CREATE TABLE \`${database}\`.\`${tableName}\` (${columnDefs.join(', ')})`;

        try {
            await ApiService.query(sql, database);
            showSuccess(`Table "${tableName}" créée avec succès !`);
            return true;
        } catch (error) {
            showError(error.message);
            return false;
        }
    },

    /**
     * Supprime une table
     */
    async deleteTable(database, tableName) {
        if (!confirm(`Supprimer la table "${tableName}" ?\n\nCette action est irréversible !`)) {
            return false;
        }

        const sql = `DROP TABLE \`${database}\`.\`${tableName}\``;

        try {
            await ApiService.query(sql, database);
            showSuccess(`Table "${tableName}" supprimée`);
            return true;
        } catch (error) {
            showError(error.message);
            return false;
        }
    },

    /**
     * Vide une table (TRUNCATE)
     */
    async truncateTable(database, tableName) {
        if (!confirm(`Vider toutes les données de la table "${tableName}" ?`)) {
            return false;
        }

        const sql = `TRUNCATE TABLE \`${database}\`.\`${tableName}\``;

        try {
            await ApiService.query(sql, database);
            showSuccess(`Table "${tableName}" vidée`);
            return true;
        } catch (error) {
            showError(error.message);
            return false;
        }
    },

    /**
     * Optimise une table
     */
    async optimizeTable(database, tableName) {
        const sql = `OPTIMIZE TABLE \`${database}\`.\`${tableName}\``;

        try {
            await ApiService.query(sql, database);
            showSuccess(`Table "${tableName}" optimisée avec succès !`);
            return true;
        } catch (error) {
            showError(error.message);
            return false;
        }
    },

    /**
     * Récupère la structure d'une table
     */
    async getTableStructure(database, tableName) {
        try {
            const structure = await ApiService.query(`DESCRIBE \`${tableName}\``, database);
            return structure;
        } catch (error) {
            showError(error.message);
            return [];
        }
    },

    /**
     * Renomme une table
     */
    async renameTable(database, oldName, newName) {
        const sql = `RENAME TABLE \`${database}\`.\`${oldName}\` TO \`${database}\`.\`${newName}\``;

        try {
            await ApiService.query(sql, database);
            showSuccess(`Table "${oldName}" renommée en "${newName}"`);
            return true;
        } catch (error) {
            showError(error.message);
            return false;
        }
    },

    /**
     * Charge toutes les tables d'une base de données
     */
    async loadTables(database) {
        try {
            const tables = await ApiService.listTables(database);
            return tables;
        } catch (error) {
            showError(error.message);
            return [];
        }
    }
};
