/**
 * La fonction `compileHTML` compile un fichier modèle HTML à l'aide de Handles et renvoie le HTML
 * compilé avec les options fournies.
 * @param {string} path - Le paramètre `path` est une chaîne qui représente le chemin du fichier HTML
 * que vous souhaitez compiler.
 * @param options - Le paramètre « options » est un enregistrement (objet) qui peut contenir n'importe
 * quel nombre de paires clé-valeur. Ces paires clé-valeur peuvent être utilisées comme variables dans
 * le fichier modèle HTML. Les valeurs peuvent être de n'importe quel type, tel que des chaînes, des
 * nombres, des booléens ou même des objets ou des tableaux imbriqués.
 * @returns le modèle HTML compilé avec les options fournies.
*/
export declare function compileHTML(path: string, options: Record<string, any>): string;
