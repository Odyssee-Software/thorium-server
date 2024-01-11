import * as fs from 'fs';
import * as path from 'path';
import { default as express , Express, Router } from 'express';
import Server, { Configuration as DevServerConfiguration } from "webpack-dev-server";
import webpack from "webpack";
import middleware from "webpack-dev-middleware";
import 'colors';

import * as handlbars from 'handlebars';

enum colors{
  green = '157',
  blue = '105',
  yellow = '178',
  red = '197'
}

import { default as Debug } from 'debug';

import { thoriumPackager } from 'thorium-packager';

let serverLog = Debug('Thorium_Server');

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
let serverSucces = serverLog.extend('succes');
serverSucces.color = colors.green;

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

/**
 * The function "printSuccess" takes a message as input and calls the "serverSuccess" function with the
 * message converted to a string and colored green.
 * @param {string} message - The parameter "message" is a string that represents the message to be
 * printed.
 */
function printSucces( message:string ){
  serverSucces( String(message).green );
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


/** The `devServer` is declaring a variable named `devServer` with the type `Express | Server['app']`. It is initializing the variable with the result of calling the `express()` function, which creates a new Express application. */
let devServer:Express | Server['app'] = express();

/** The `IThoriumServerConfiguration` interface defines the structure of the server configuration object used in the Thorium Server. It has the following properties: */
interface IThoriumServerConfiguration{
  main?:string;
  package?:string;
  devServer?:DevServerConfiguration;
  routes?:string[];
  debug?:boolean;
  client?:{
    views?: Record<string,string>
  }
}

export type ThoriumServer = Express | Server;

/**
 * The `preloadConfiguration` function preloads server configuration and sets up the server based on
 * the configuration provided.
 * @param serverDirPath - The `serverDirPath` parameter is a string that represents the path to the
 * directory where the server configuration files are located. It defaults to the current working
 * directory (`process.env.PWD` or `process.cwd()`).
 * @param {Express | Server['app']} [server] - The `server` parameter is an optional parameter that
 * represents the Express server or the `app` property of a `Server` object. It is used to determine
 * whether the server configuration is for a webpack dev server or a production server. If the `server`
 * parameter is provided, it means that the server is in production mode
 * @returns the `devServer` object.
*/
export const preloadConfiguration = async ( serverDirPath = process.env.PWD || process.cwd() , server?: Express | Server['app'] ) => {

  /**
    ========================================
    preload server configuration
    ========================================
  */

  /** print du message afin d'indiquer quel serveur est utilisé */
  if(server){
    printMessage( `preload webpack dev server configuration` );
    devServer = server;
  }
  else printMessage( `preload production server configuration` );

  /** Declare the path to the `server.config.json` file. */
  let serverFileConfiguration = path.join( serverDirPath , 'server.config.json' );

  /** This variable `serverConfiguration` is responsible for loading and setting up the server configuration based on the `server.config.json` file. */
  let serverConfiguration:IThoriumServerConfiguration = {
    main:null,
    devServer:null,
    routes:null
  };

  if(fs.existsSync(serverFileConfiguration)){
    printSucces( `server.config.json found in ${serverDirPath}` );
    serverConfiguration = JSON.parse( fs.readFileSync( serverFileConfiguration , 'utf-8' ) );

    if(server){

      printMessage(`set up webpack middleware`);

      devServer.use( middleware( webpack({ 
        mode : "development",
        entry : path.join( serverDirPath , serverConfiguration.main ),
      }) , {

      }) )

    }

  }
  else printError(`no server.config.json found in ${serverDirPath}`);

  /**
    =================================
    preload server configuration over
    =================================
  */

  /** This block is responsible for loading and setting up the main server script and router scripts based on the server configuration. */
  if(serverConfiguration.main){
    let { main } = serverConfiguration;

    let mainServerFile = path.join( serverDirPath , main );
    if(fs.existsSync( mainServerFile )){

    }
    else {
      printError( `${path.resolve( serverDirPath , main)} not found` );
      printWarning( `loading server conf without custom main.js` );
    }

    const { default:customizeServerController } = require( path.join( serverDirPath ,  main ));
    console.log({ customizeServerController });
    devServer = customizeServerController( devServer )
  }

  // // Load of router scripts
  if(serverConfiguration.routes){
    let { routes } = serverConfiguration;
    for(let routerPath of routes){
      printMessage( `loading ${path.resolve( serverDirPath , routerPath )} middleware` );
      let { default:router } = require( path.resolve( serverDirPath , routerPath ) ) as { default:Router };
      devServer.use( router );
    }
  }

  // Si pas de webpack-dev-server
  // Lecture et exploitation de package et views avec thorium-server
  // The code block you provided is responsible for loading and setting up the views and package endpoints in the Thorium Server.
  if(!server){

    // Load Views
    if( serverConfiguration.client.views ){

      let { views } = serverConfiguration.client;
      
      if(!server)for(const route of Object.keys(views)){
        let filePath = path.join(serverDirPath , views[route]);
        (devServer as Express).get( route , ( req , res , next ) => {
          let template = handlbars.compile( fs.readFileSync( filePath , 'utf-8' ) );
          let result = template( { build : 'build.js' } );
          res.send( result )
        })
      }
      

    }

    //Load package
    if(serverConfiguration.package){

      printMessage( `read package bundler` );
      let zip = await thoriumPackager.readPackage( path.join( serverDirPath , serverConfiguration.package ) );
      for( let entry of zip.entries ){
        printMessage( `adding /${entry.path} autodrained file's endpoint` );
        (devServer as Express).get( `/${entry.path}` , (req , res , next) => { res.send( entry.buffer.toString() ) } )
      }

    }

    devServer.listen( serverConfiguration.devServer.port , () => {
      printMessage( `Production server listing on port ${serverConfiguration.devServer.port}` )
    } )

  }

  return devServer;

}

export default devServer;