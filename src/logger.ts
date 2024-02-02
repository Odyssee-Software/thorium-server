import { default as Debug } from 'debug';

let serverLog = Debug('Thorium_Server');

// Si pas de debug
if(!process.env['DEBUG']){
  process.env['DEBUG'] = 'Thorium_Server,Thorium_Server:*';
  Debug.enable('Thorium_Server,Thorium_Server:*');
}
else{
  // Si debug mais pas thorium server
  if(!process.env['DEBUG'].includes('Thorium_Server')){
    process.env['DEBUG'] = [ process.env['DEBUG'] , 'Thorium_Server,Thorium_Server:*' ].join(',');
    Debug.enable('Thorium_Server,Thorium_Server:*');
  }
}

enum colors{
  green = '157',
  blue = '105',
  yellow = '178',
  red = '197'
}

/** The line is creating a new debug function called
`serverMessage` that is an extension of the `serverLog` debug function. This allows you to log
messages with a specific tag, in this case, "message". The `serverMessage` function will output
messages in cyan color when called. */
let serverMessage = serverLog.extend('message');
serverMessage.color = colors.blue;

/** The line is creating a new debug function called
`serverSucces` that is an extension of the `serverLog` debug function. This allows you to log
messages with a specific tag, in this case, "succes". The `serverSucces` function will output
messages in green color when called. */
let serverSuccess = serverLog.extend('success');
serverSuccess.color = colors.green;

/** The line is creating a new debug function called
`serverWarning` that is an extension of the `serverLog` debug function. This allows you to log
messages with a specific tag, in this case, "warning". The `serverWarning` function will output
messages in yellow color when called. */
let serverWarning = serverLog.extend('warning');
serverWarning.color = colors.yellow;

/** The line is creating a new debug function called
`serverError` that is an extension of the `serverLog` debug function. This allows you to log
messages with a specific tag, in this case, "error". The `serverError` function will output messages
in red color when called. */
let serverError = serverLog.extend('error');
serverError.color = colors.red;

export default serverLog;
export { serverLog , serverMessage , serverSuccess , serverWarning , serverError };

/**
 * The function "printSuccess" takes a message as input and calls the "serverSuccess" function with the
 * message converted to a string and colored green.
 * @param {string} message - The parameter "message" is a string that represents the message to be
 * printed.
 */
function printSuccess( message:string ){
  serverSuccess( String(message).green );
}

/**
 * The function "printMessage" takes a string as input and calls the "serverMessage" function with the
 * input string formatted in cyan color.
 * @param {string} message - The parameter "message" is of type string.
 */
function printMessage( message:string ){
  serverMessage( String(message).cyan );
}

/**
 * The function "printWarning" prints a warning message in yellow color.
 * @param {string} message - A string that represents the warning message to be printed.
 */
function printWarning( message:string ){
  serverWarning( String(message).yellow );
}

/**
 * The function "printError" takes a message as input and calls the "serverError" function with the
 * message formatted in red color.
 * @param {string} message - The parameter "message" is a string that represents the error message that
 * needs to be printed.
 */
function printError( message:string ){
  serverError( String(message).red )
}

export { printSuccess , printMessage , printWarning , printError };