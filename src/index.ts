import * as fs from 'fs';
import * as path from 'path';
import { default as express } from 'express';
import Server, { Configuration as DevServerConfiguration } from "webpack-dev-server";
import webpack from "webpack";
import middleware from "webpack-dev-middleware";

import { default as Debug } from 'debug';
let serverLog = Debug('Thorium_Server');
let serverMessage = serverLog.extend('message');
console.log({ messageColor : serverMessage.color })
// serverMessage.color = '#0000FF';
let serverSucces = serverLog.extend('succes');
// serverSucces.color = '#0000FF';
let serverError = serverLog.extend('error');
serverError.color = '197';

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


let devServer = express();

interface IThoriumServerConfiguration{
  main?:string;
  devServer?:DevServerConfiguration;
  routes?:Record<`/${string}` , string>;
  debug?:boolean;
}

export const preloadConfiguration = ( serverDirPath = process.env.PWD || process.cwd() ) => {

  let serverFileConfiguration = path.join( serverDirPath , 'server.config.json' );
  let serverConfiguration:IThoriumServerConfiguration = {
    main:null,
    devServer:null,
    routes:null
  }

  if(fs.existsSync(serverFileConfiguration)){
    serverSucces(`server.config.json found in ${serverDirPath}`);
    serverConfiguration = JSON.parse( fs.readFileSync( serverFileConfiguration , 'utf-8' ) );

    serverMessage(`set up webpack middleware`);

    // devServer.use( middleware( webpack({ 
    //   mode : "development",
    //   entry : path.join( serverDirPath , serverConfiguration.main ),
    // }) , {

    // }) )

  }
  else serverError(`no server.config.json found in ${serverDirPath}`);

  // Load of main script
  if(serverConfiguration.main){
    let { main } = serverConfiguration;

    let mainServerFile = path.join( serverDirPath , main );
    if(fs.existsSync( mainServerFile )){

    }
    else serverError( `${path.resolve( serverDirPath , main)} not found` );

    // const { default:customizeServerController } = require( path.join( serverDirPath ,  main ));
    // console.log({ customizeServerController });
    // devServer = customizeServerController( devServer )
  }

  // // Load of router scripts
  if(serverConfiguration.routes){
    let { routes } = serverConfiguration;
    for(let key of Object.keys( routes )){
      serverMessage( `loading ${path.resolve( serverDirPath , routes[key] )} middleware` );
      let { default:router } = require( path.resolve( serverDirPath , routes[key] ) );
      devServer.use( key , router );
    }
  }

  devServer.listen( serverConfiguration.devServer.port , () => {
    serverMessage( `Server listing on port ${serverConfiguration.devServer.port}` )
  } )

}

preloadConfiguration();

export default devServer;