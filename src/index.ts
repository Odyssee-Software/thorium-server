import * as fs from 'fs';
import * as path from 'path';
import { default as express , Express, Router , Application } from 'express';
import Server, { Configuration as DevServerConfiguration } from "webpack-dev-server";
import webpack from "webpack";
import middleware from "webpack-dev-middleware";
import 'colors';

import { thoriumPackager } from 'thorium-packager';
import { printSuccess , printMessage , printWarning , printError } from './logger';
import { compileHTML } from './compile-html';

export type ThoriumServer = Application & Server['app'];

/** The `devServer` is declaring a variable named `devServer` with the type `Express | Server['app']`. It is initializing the variable with the result of calling the `express()` function, which creates a new Express application. */
let devServer:ThoriumServer = express();

/** The `IThoriumServerConfiguration` interface defines the structure of the server configuration object used in the Thorium Server. It has the following properties: */
export interface IThoriumServerConfiguration{

  /** The `main?:string;` line is defining a property called `main` in the `IThoriumServerConfiguration`
  interface. The `main` property is of type `string` and represents the path to the main.js file of
  the application. This file can have any name. If the `main` property is defined, it will be
  executed by passing the Express server as an argument and retrieving it as the output. This allows
  you to modify the server. */
  main:string;

  /** The `package?:string;` line is defining a property called `package` in the
  `IThoriumServerConfiguration` interface. The `package` property is of type `string` and represents
  the path to a zip file or a `solution` containing the result of packaging the source code using
  `thorium-cli`. This package will be used by the server to establish static routes and distribute
  the content of the solution. */
  package:string;

  /** The `devServer?:DevServerConfiguration;` line is defining an optional property called `devServer`
  in the `IThoriumServerConfiguration` interface. The `devServer` property is of type
  `DevServerConfiguration`, which represents the configuration options for the webpack-dev-server.
  This property allows you to specify custom configuration options for the webpack-dev-server when
  using it in the Thorium Server. If the `devServer` property is not provided in the server
  configuration, it will default to `null`. */
  devServer:DevServerConfiguration;

  /** The `routes?:string[];` line is defining an optional property called `routes` in the
  `IThoriumServerConfiguration` interface. The `routes` property is an array of strings that
  represents the paths to the router scripts that will be loaded and used by the server. Each string
  in the array should be a valid file path to a router script. If the `routes` property is provided
  in the server configuration, the Thorium Server will load and use the specified router scripts to
  handle different routes and endpoints. */
  routes:string[];

  /** The `debug?:boolean;` property in the `IThoriumServerConfiguration` interface is an optional
  property that allows you to enable or disable debug mode for the Thorium Server. If the `debug`
  property is set to `true`, it means that debug mode is enabled and additional debug information
  will be logged. If the `debug` property is not provided or set to `false`, debug mode is disabled
  and no additional debug information will be logged. */
  debug:boolean;

  /** The `client?` is a property in the `IThoriumServerConfiguration` interface that represents the
  client-specific configuration options for the Thorium Server. It allows you to specify additional
  configuration options related to the client-side of the application. */
  client:{

    /** The `views?: Record<string,string>` property in the `client` property of the
    `IThoriumServerConfiguration` interface represents the views that will be loaded and used by the
    Thorium Server. */
    views: Record<string,string>
  }
}

export type ThoriumServerConfiguration = Partial<IThoriumServerConfiguration>;

/**
 * The `preloadConfiguration` function preloads server configuration and sets up the server based on
 * the configuration provided.
 * @param serverDirPath - The `serverDirPath` parameter is a string that represents the path to the
 * directory where the server configuration files are located. It defaults to the current working
 * directory (`process.env.PWD` or `process.cwd()`).
 * @param {Application | Server['app']} [server] - The `server` parameter is an optional parameter that
 * represents the Express server or the `app` property of a `Server` object. It is used to determine
 * whether the server configuration is for a webpack dev server or a production server. If the `server`
 * parameter is provided, it means that the server is in developpment mode
 * @returns the `devServer` object.
*/
export const preloadConfiguration = async ( serverDirPath = process.env.PWD || process.cwd() , inuptServer?: Application & Server['app'] ) => {

  /**
    ========================================
    preload server configuration
    ========================================
  */

  /** print du message afin d'indiquer quel serveur est utilisé */
  if(inuptServer){
    printMessage( `preload with input server configuration` );
    devServer = inuptServer;
  }
  else printMessage( `preload production server configuration` );

  /** Declare the path to the `server.config.json` file. */
  let serverFileConfiguration = path.join( serverDirPath , 'server.config.json' );

  /** This variable `serverConfiguration` is responsible for loading and setting up the server configuration based on the `server.config.json` file. */
  let serverConfiguration:ThoriumServerConfiguration = {
    main:null,
    devServer:null,
    routes:null,
    client:{
      views:null
    }
  };

  if(fs.existsSync(serverFileConfiguration)){
    printSuccess( `server.config.json found in ${serverDirPath}` );
    serverConfiguration = JSON.parse( fs.readFileSync( serverFileConfiguration , 'utf-8' ) );

    if(inuptServer){

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

    const { default:loadMainScript } = require( path.join( serverDirPath ,  main ));
    devServer = loadMainScript( devServer );

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

  // Chargement des routes pour les views
  if( serverConfiguration.client.views ){

    let { views } = serverConfiguration.client;

    if(inuptServer){

      for(const route of Object.keys(views)){
        let filePath = path.join(serverDirPath , views[route]);
        devServer.get( route , ( req , res , next ) => {
          res.send( compileHTML( filePath , { build : 'static/build.js' } ) );
        })
      }
    }
    else if(!inuptServer) {

      for(const route of Object.keys(views)){
        let filePath = path.join(serverDirPath , views[route]);
        devServer.get( route , ( req , res , next ) => {
          res.send( compileHTML( filePath , { build : 'build.js' } ) );
        })
      }

    }
    
  }

  // Si devServer preparation des routes pour servir le dossier `static`
  if(inuptServer){

    devServer.get( '/static/:fileName' , ( req , res , next ) => {

      let filePath = path.join( serverDirPath , 'static' , req.params.fileName );
      if(fs.existsSync( filePath )){
        res.sendFile( filePath );
      }else res.status(404).send({ error : 'file not fund' });

    })

  }

  // Si pas de webpack-dev-server
  // Lecture et exploitation de package et views avec thorium-server
  // The code block you provided is responsible for loading and setting up the views and package endpoints in the Thorium Server.
  else if(!inuptServer){

    //Load package
    if(serverConfiguration.package){

      printMessage( `read package bundler` );
      let zip = await thoriumPackager.readPackage( path.join( serverDirPath , serverConfiguration.package ) );
      for( let entry of zip.entries ){
        printMessage( `adding /${entry.path} autodrained file's endpoint` );
        devServer.get( `/${entry.path}` , (req , res , next) => { res.send( entry.buffer.toString() ) } )
      }

    }

    devServer.listen( serverConfiguration.devServer.port , () => {
      printMessage( `Production server listing on port ${serverConfiguration.devServer.port}` )
    } )

  }

  return devServer;

}

export default devServer;