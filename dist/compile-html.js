"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileHTML = void 0;
const fs = __importStar(require("fs"));
const handlbars = __importStar(require("handlebars"));
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
function compileHTML(path, options) {
    if (!fs.existsSync(path))
        throw { "message": `no html file ${path}` };
    let template = handlbars.compile(fs.readFileSync(path, 'utf-8'));
    return template(options);
}
exports.compileHTML = compileHTML;
//# sourceMappingURL=compile-html.js.map