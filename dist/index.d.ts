import { Application } from 'express';
import Server, { Configuration as DevServerConfiguration } from "webpack-dev-server";
import 'colors';
export type ThoriumServer = Application & Server['app'];
/** The `devServer` is declaring a variable named `devServer` with the type `Express | Server['app']`. It is initializing the variable with the result of calling the `express()` function, which creates a new Express application. */
declare let devServer: ThoriumServer;
/** The `IThoriumServerConfiguration` interface defines the structure of the server configuration object used in the Thorium Server. It has the following properties: */
export interface IThoriumServerConfiguration {
    /** The `main?:string;` line is defining a property called `main` in the `IThoriumServerConfiguration`
    interface. The `main` property is of type `string` and represents the path to the main.js file of
    the application. This file can have any name. If the `main` property is defined, it will be
    executed by passing the Express server as an argument and retrieving it as the output. This allows
    you to modify the server. */
    main: string;
    /** The `package?:string;` line is defining a property called `package` in the
    `IThoriumServerConfiguration` interface. The `package` property is of type `string` and represents
    the path to a zip file or a `solution` containing the result of packaging the source code using
    `thorium-cli`. This package will be used by the server to establish static routes and distribute
    the content of the solution. */
    package: string;
    /** The `devServer?:DevServerConfiguration;` line is defining an optional property called `devServer`
    in the `IThoriumServerConfiguration` interface. The `devServer` property is of type
    `DevServerConfiguration`, which represents the configuration options for the webpack-dev-server.
    This property allows you to specify custom configuration options for the webpack-dev-server when
    using it in the Thorium Server. If the `devServer` property is not provided in the server
    configuration, it will default to `null`. */
    devServer: DevServerConfiguration;
    /** The `routes?:string[];` line is defining an optional property called `routes` in the
    `IThoriumServerConfiguration` interface. The `routes` property is an array of strings that
    represents the paths to the router scripts that will be loaded and used by the server. Each string
    in the array should be a valid file path to a router script. If the `routes` property is provided
    in the server configuration, the Thorium Server will load and use the specified router scripts to
    handle different routes and endpoints. */
    routes: string[];
    /** The `debug?:boolean;` property in the `IThoriumServerConfiguration` interface is an optional
    property that allows you to enable or disable debug mode for the Thorium Server. If the `debug`
    property is set to `true`, it means that debug mode is enabled and additional debug information
    will be logged. If the `debug` property is not provided or set to `false`, debug mode is disabled
    and no additional debug information will be logged. */
    debug: boolean;
    /** The `client?` is a property in the `IThoriumServerConfiguration` interface that represents the
    client-specific configuration options for the Thorium Server. It allows you to specify additional
    configuration options related to the client-side of the application. */
    client: {
        /** The `views?: Record<string,string>` property in the `client` property of the
        `IThoriumServerConfiguration` interface represents the views that will be loaded and used by the
        Thorium Server. */
        views: Record<string, string>;
    };
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
export declare const preloadConfiguration: (serverDirPath?: string, inuptServer?: Application & Server['app']) => Promise<ThoriumServer>;
export default devServer;
