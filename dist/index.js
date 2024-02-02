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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preloadConfiguration = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const express_1 = __importDefault(require("express"));
const webpack_1 = __importDefault(require("webpack"));
const webpack_dev_middleware_1 = __importDefault(require("webpack-dev-middleware"));
require("colors");
const thorium_packager_1 = require("thorium-packager");
const logger_1 = require("./logger");
const compile_html_1 = require("./compile-html");
/** The `devServer` is declaring a variable named `devServer` with the type `Express | Server['app']`. It is initializing the variable with the result of calling the `express()` function, which creates a new Express application. */
let devServer = (0, express_1.default)();
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
const preloadConfiguration = (serverDirPath = process.env.PWD || process.cwd(), inuptServer) => __awaiter(void 0, void 0, void 0, function* () {
    /**
      ========================================
      preload server configuration
      ========================================
    */
    /** print du message afin d'indiquer quel serveur est utilisé */
    if (inuptServer) {
        (0, logger_1.printMessage)(`preload with input server configuration`);
        devServer = inuptServer;
    }
    else
        (0, logger_1.printMessage)(`preload production server configuration`);
    /** Declare the path to the `server.config.json` file. */
    let serverFileConfiguration = path.join(serverDirPath, 'server.config.json');
    /** This variable `serverConfiguration` is responsible for loading and setting up the server configuration based on the `server.config.json` file. */
    let serverConfiguration = {
        main: null,
        devServer: null,
        routes: null,
        client: {
            views: null
        }
    };
    if (fs.existsSync(serverFileConfiguration)) {
        (0, logger_1.printSuccess)(`server.config.json found in ${serverDirPath}`);
        serverConfiguration = JSON.parse(fs.readFileSync(serverFileConfiguration, 'utf-8'));
        if (inuptServer) {
            (0, logger_1.printMessage)(`set up webpack middleware`);
            devServer.use((0, webpack_dev_middleware_1.default)((0, webpack_1.default)({
                mode: "development",
                entry: path.join(serverDirPath, serverConfiguration.main),
            }), {}));
        }
    }
    else
        (0, logger_1.printError)(`no server.config.json found in ${serverDirPath}`);
    /**
      =================================
      preload server configuration over
      =================================
    */
    /** This block is responsible for loading and setting up the main server script and router scripts based on the server configuration. */
    if (serverConfiguration.main) {
        let { main } = serverConfiguration;
        let mainServerFile = path.join(serverDirPath, main);
        if (fs.existsSync(mainServerFile)) {
        }
        else {
            (0, logger_1.printError)(`${path.resolve(serverDirPath, main)} not found`);
            (0, logger_1.printWarning)(`loading server conf without custom main.js`);
        }
        const { default: loadMainScript } = require(path.join(serverDirPath, main));
        devServer = loadMainScript(devServer);
    }
    // // Load of router scripts
    if (serverConfiguration.routes) {
        let { routes } = serverConfiguration;
        for (let routerPath of routes) {
            (0, logger_1.printMessage)(`loading ${path.resolve(serverDirPath, routerPath)} middleware`);
            let { default: router } = require(path.resolve(serverDirPath, routerPath));
            devServer.use(router);
        }
    }
    // Chargement des routes pour les views
    if (serverConfiguration.client.views) {
        let { views } = serverConfiguration.client;
        if (inuptServer) {
            for (const route of Object.keys(views)) {
                let filePath = path.join(serverDirPath, views[route]);
                devServer.get(route, (req, res, next) => {
                    res.send((0, compile_html_1.compileHTML)(filePath, { build: 'static/build.js' }));
                });
            }
        }
        else if (!inuptServer) {
            for (const route of Object.keys(views)) {
                let filePath = path.join(serverDirPath, views[route]);
                devServer.get(route, (req, res, next) => {
                    res.send((0, compile_html_1.compileHTML)(filePath, { build: 'build.js' }));
                });
            }
        }
    }
    // Si devServer preparation des routes pour servir le dossier `static`
    if (inuptServer) {
        devServer.get('/static/:fileName', (req, res, next) => {
            let filePath = path.join(serverDirPath, 'static', req.params.fileName);
            if (fs.existsSync(filePath)) {
                res.sendFile(filePath);
            }
            else
                res.status(404).send({ error: 'file not fund' });
        });
    }
    // Si pas de webpack-dev-server
    // Lecture et exploitation de package et views avec thorium-server
    // The code block you provided is responsible for loading and setting up the views and package endpoints in the Thorium Server.
    else if (!inuptServer) {
        //Load package
        if (serverConfiguration.package) {
            (0, logger_1.printMessage)(`read package bundler`);
            let zip = yield thorium_packager_1.thoriumPackager.readPackage(path.join(serverDirPath, serverConfiguration.package));
            for (let entry of zip.entries) {
                (0, logger_1.printMessage)(`adding /${entry.path} autodrained file's endpoint`);
                devServer.get(`/${entry.path}`, (req, res, next) => { res.send(entry.buffer.toString()); });
            }
        }
        devServer.listen(serverConfiguration.devServer.port, () => {
            (0, logger_1.printMessage)(`Production server listing on port ${serverConfiguration.devServer.port}`);
        });
    }
    return devServer;
});
exports.preloadConfiguration = preloadConfiguration;
exports.default = devServer;
//# sourceMappingURL=index.js.map