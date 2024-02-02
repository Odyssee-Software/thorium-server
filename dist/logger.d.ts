import { default as Debug } from 'debug';
declare let serverLog: Debug.Debugger;
/** The line is creating a new debug function called
`serverMessage` that is an extension of the `serverLog` debug function. This allows you to log
messages with a specific tag, in this case, "message". The `serverMessage` function will output
messages in cyan color when called. */
declare let serverMessage: Debug.Debugger;
/** The line is creating a new debug function called
`serverSucces` that is an extension of the `serverLog` debug function. This allows you to log
messages with a specific tag, in this case, "succes". The `serverSucces` function will output
messages in green color when called. */
declare let serverSuccess: Debug.Debugger;
/** The line is creating a new debug function called
`serverWarning` that is an extension of the `serverLog` debug function. This allows you to log
messages with a specific tag, in this case, "warning". The `serverWarning` function will output
messages in yellow color when called. */
declare let serverWarning: Debug.Debugger;
/** The line is creating a new debug function called
`serverError` that is an extension of the `serverLog` debug function. This allows you to log
messages with a specific tag, in this case, "error". The `serverError` function will output messages
in red color when called. */
declare let serverError: Debug.Debugger;
export default serverLog;
export { serverLog, serverMessage, serverSuccess, serverWarning, serverError };
/**
 * The function "printSuccess" takes a message as input and calls the "serverSuccess" function with the
 * message converted to a string and colored green.
 * @param {string} message - The parameter "message" is a string that represents the message to be
 * printed.
 */
declare function printSuccess(message: string): void;
/**
 * The function "printMessage" takes a string as input and calls the "serverMessage" function with the
 * input string formatted in cyan color.
 * @param {string} message - The parameter "message" is of type string.
 */
declare function printMessage(message: string): void;
/**
 * The function "printWarning" prints a warning message in yellow color.
 * @param {string} message - A string that represents the warning message to be printed.
 */
declare function printWarning(message: string): void;
/**
 * The function "printError" takes a message as input and calls the "serverError" function with the
 * message formatted in red color.
 * @param {string} message - The parameter "message" is a string that represents the error message that
 * needs to be printed.
 */
declare function printError(message: string): void;
export { printSuccess, printMessage, printWarning, printError };
