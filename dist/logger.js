"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printError = exports.printWarning = exports.printMessage = exports.printSuccess = exports.serverError = exports.serverWarning = exports.serverSuccess = exports.serverMessage = exports.serverLog = void 0;
const debug_1 = __importDefault(require("debug"));
let serverLog = (0, debug_1.default)('Thorium_Server');
exports.serverLog = serverLog;
// Si pas de debug
if (!process.env['DEBUG']) {
    process.env['DEBUG'] = 'Thorium_Server,Thorium_Server:*';
    debug_1.default.enable('Thorium_Server,Thorium_Server:*');
}
else {
    // Si debug mais pas thorium server
    if (!process.env['DEBUG'].includes('Thorium_Server')) {
        process.env['DEBUG'] = [process.env['DEBUG'], 'Thorium_Server,Thorium_Server:*'].join(',');
        debug_1.default.enable('Thorium_Server,Thorium_Server:*');
    }
}
var colors;
(function (colors) {
    colors["green"] = "157";
    colors["blue"] = "105";
    colors["yellow"] = "178";
    colors["red"] = "197";
})(colors || (colors = {}));
/** The line is creating a new debug function called
`serverMessage` that is an extension of the `serverLog` debug function. This allows you to log
messages with a specific tag, in this case, "message". The `serverMessage` function will output
messages in cyan color when called. */
let serverMessage = serverLog.extend('message');
exports.serverMessage = serverMessage;
serverMessage.color = colors.blue;
/** The line is creating a new debug function called
`serverSucces` that is an extension of the `serverLog` debug function. This allows you to log
messages with a specific tag, in this case, "succes". The `serverSucces` function will output
messages in green color when called. */
let serverSuccess = serverLog.extend('success');
exports.serverSuccess = serverSuccess;
serverSuccess.color = colors.green;
/** The line is creating a new debug function called
`serverWarning` that is an extension of the `serverLog` debug function. This allows you to log
messages with a specific tag, in this case, "warning". The `serverWarning` function will output
messages in yellow color when called. */
let serverWarning = serverLog.extend('warning');
exports.serverWarning = serverWarning;
serverWarning.color = colors.yellow;
/** The line is creating a new debug function called
`serverError` that is an extension of the `serverLog` debug function. This allows you to log
messages with a specific tag, in this case, "error". The `serverError` function will output messages
in red color when called. */
let serverError = serverLog.extend('error');
exports.serverError = serverError;
serverError.color = colors.red;
exports.default = serverLog;
/**
 * The function "printSuccess" takes a message as input and calls the "serverSuccess" function with the
 * message converted to a string and colored green.
 * @param {string} message - The parameter "message" is a string that represents the message to be
 * printed.
 */
function printSuccess(message) {
    serverSuccess(String(message).green);
}
exports.printSuccess = printSuccess;
/**
 * The function "printMessage" takes a string as input and calls the "serverMessage" function with the
 * input string formatted in cyan color.
 * @param {string} message - The parameter "message" is of type string.
 */
function printMessage(message) {
    serverMessage(String(message).cyan);
}
exports.printMessage = printMessage;
/**
 * The function "printWarning" prints a warning message in yellow color.
 * @param {string} message - A string that represents the warning message to be printed.
 */
function printWarning(message) {
    serverWarning(String(message).yellow);
}
exports.printWarning = printWarning;
/**
 * The function "printError" takes a message as input and calls the "serverError" function with the
 * message formatted in red color.
 * @param {string} message - The parameter "message" is a string that represents the error message that
 * needs to be printed.
 */
function printError(message) {
    serverError(String(message).red);
}
exports.printError = printError;
//# sourceMappingURL=logger.js.map