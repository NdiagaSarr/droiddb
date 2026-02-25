// Utilities - Fonctions helper réutilisables

/**
 * Télécharge un fichier
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Échappe les caractères spéciaux pour SQL
 */
export function escapeSqlString(str) {
    if (str === null || str === undefined) return 'NULL';
    return `'${String(str).replace(/'/g, "''")}'`;
}

/**
 * Formate une date pour l'affichage
 */
export function formatDate(date) {
    return new Date(date).toLocaleString('fr-FR');
}

/**
 * Affiche un message d'erreur
 */
export function showError(message) {
    alert(`❌ Erreur: ${message}`);
}

/**
 * Affiche un message de succès
 */
export function showSuccess(message) {
    alert(`✅ ${message}`);
}

/**
 * Demande une confirmation
 */
export function confirm(message) {
    return window.confirm(message);
}

/**
 * Demande une saisie utilisateur
 */
export function prompt(message, defaultValue = '') {
    return window.prompt(message, defaultValue);
}
