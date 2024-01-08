import * as fs from 'fs';
import * as path from 'path';
import { default as express , Express } from 'express';
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

import { _thoriumPackager } from 'thorium-packager';

let serverLog = Debug('Thorium_Server');
let serverMessage = serverLog.extend('message');
serverMessage.color = colors.blue;
let serverSucces = serverLog.extend('succes');
serverSucces.color = colors.green;
let serverWarning = serverLog.extend('warning');
serverWarning.color = colors.yellow;
let serverError = serverLog.extend('error');
serverError.color = colors.red;

function printSucces( message:string ){
  serverSucces( String(message).green );
}

function printMessage( message:string ){
  serverMessage( String(message).cyan );
}

function printWarning( message:string ){
  serverWarning( String(message).yellow );
}

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


let devServer:Express | Server['app'] = express();

interface IThoriumServerConfiguration{
  main?:string;
  package?:string;
  devServer?:DevServerConfiguration;
  routes?:Record<`/${string}` , string>;
  debug?:boolean;
  client?:{
    views?: Record<string,string>
  }
}

export type ThoriumServer = Express | Server;

export const preloadConfiguration = async ( serverDirPath = process.env.PWD || process.cwd() , server?: Express | Server['app'] ) => {

  if(server){
    printMessage( `preload webpack dev server configuration` );
    devServer = server;
  }
  else printMessage( `preload production server configuration` );

  let serverFileConfiguration = path.join( serverDirPath , 'server.config.json' );
  let serverConfiguration:IThoriumServerConfiguration = {
    main:null,
    devServer:null,
    routes:null
  }

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

  // Load of main script
  if(serverConfiguration.main){
    let { main } = serverConfiguration;

    let mainServerFile = path.join( serverDirPath , main );
    if(fs.existsSync( mainServerFile )){

    }
    else {
      printError( `${path.resolve( serverDirPath , main)} not found` );
      printWarning( `loading server conf without custom main.js` );
    }

    // const { default:customizeServerController } = require( path.join( serverDirPath ,  main ));
    // console.log({ customizeServerController });
    // devServer = customizeServerController( devServer )
  }

  // // Load of router scripts
  if(serverConfiguration.routes){
    let { routes } = serverConfiguration;
    for(let key of Object.keys( routes )){
      printMessage( `loading ${path.resolve( serverDirPath , routes[key] )} middleware` );
      let { default:router } = require( path.resolve( serverDirPath , routes[key] ) );
      devServer.use( key , router );
    }
  }

  // Si pas de webpack-dev-server
  // Lecture et exploitation de package et views avec thorium-server
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
      let zip = await _thoriumPackager.readPackage( path.join( serverDirPath , serverConfiguration.package ) );
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