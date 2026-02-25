// Database Module - Gestion des bases de données
import { ApiService } from '../services/api.js';
import { downloadFile, escapeSqlString, showError, showSuccess, confirm } from '../utils/helpers.js';

export const DatabaseManager = {
    /**
     * Charge toutes les bases de données
     */
    async loadDatabases() {
        try {
            const databases = await ApiService.listDatabases();
            return databases;
        } catch (error) {
            showError(error.message);
            return [];
        }
    },

    /**
     * Crée une nouvelle base de données
     */
    async createDatabase(name, collation = null) {
        const sql = collation
            ? `CREATE DATABASE \`${name}\` COLLATE ${collation}`
            : `CREATE DATABASE \`${name}\``;

        try {
            await ApiService.query(sql);
            showSuccess(`Base de données "${name}" créée avec succès !`);
            return true;
        } catch (error) {
            showError(error.message);
            return false;
        }
    },

    /**
     * Supprime une base de données
     */
    async deleteDatabase(name) {
        if (!confirm(`Supprimer la base de données "${name}" ?\n\nCette action est irréversible !`)) {
            return false;
        }

        const sql = `DROP DATABASE \`${name}\``;

        try {
            await ApiService.query(sql);
            showSuccess(`Base de données "${name}" supprimée`);
            return true;
        } catch (error) {
            showError(error.message);
            return false;
        }
    },

    /**
     * Renomme une base de données (Workaround: Create New -> Move Tables -> Drop Old)
     */
    async renameDatabase(oldName, newName) {
        try {
            // 1. Créer la nouvelle DB
            await ApiService.query(`CREATE DATABASE \`${newName}\``);

            // 2. Récupérer les tables de l'ancienne DB
            const tables = await ApiService.listTables(oldName);

            // 3. Déplacer chaque table
            for (const table of tables) {
                await ApiService.query(`RENAME TABLE \`${oldName}\`.\`${table}\` TO \`${newName}\`.\`${table}\``);
            }

            // 4. Supprimer l'ancienne DB
            await ApiService.query(`DROP DATABASE \`${oldName}\``);

            showSuccess(`Base de données renommée en "${newName}"`);
            return true;
        } catch (error) {
            showError(`Erreur lors du renommage: ${error.message}`);
            return false;
        }
    },

    /**
     * Exporte une base de données en SQL
     */
    async exportDatabase(dbName) {
        try {
            // Récupère toutes les tables
            const tables = await ApiService.listTables(dbName);

            let sqlDump = `-- Export de la base de données: ${dbName}\n`;
            sqlDump += `-- Date: ${new Date().toLocaleString()}\n\n`;
            sqlDump += `CREATE DATABASE IF NOT EXISTS \`${dbName}\`;\n`;
            sqlDump += `USE \`${dbName}\`;\n\n`;

            // Pour chaque table
            for (const table of tables) {
                // Structure
                const createData = await ApiService.query(`SHOW CREATE TABLE \`${table}\``, dbName);
                if (createData && createData[0]) {
                    sqlDump += `-- Structure de la table ${table}\n`;
                    sqlDump += `DROP TABLE IF EXISTS \`${table}\`;\n`;
                    sqlDump += createData[0]['Create Table'] + ';\n\n';
                }

                // Données
                const tableData = await ApiService.getTableData(dbName, table);
                if (tableData && tableData.length > 0) {
                    sqlDump += `-- Données de la table ${table}\n`;
                    const columns = Object.keys(tableData[0]);

                    tableData.forEach(row => {
                        const values = columns.map(col => escapeSqlString(row[col])).join(', ');
                        sqlDump += `INSERT INTO \`${table}\` (\`${columns.join('`, `')}\`) VALUES (${values});\n`;
                    });
                    sqlDump += '\n';
                }
            }

            downloadFile(sqlDump, `${dbName}_export.sql`, 'text/sql');
            showSuccess(`Base de données "${dbName}" exportée avec succès !`);
            return true;
        } catch (error) {
            showError(`Erreur lors de l'export: ${error.message}`);
            return false;
        }
    }
};
