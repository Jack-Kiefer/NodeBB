'use strict';
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.webInstall = exports.setup = void 0;
const winston = __importStar(require("winston"));
const path = __importStar(require("path"));
const nconf = __importStar(require("nconf"));
const web_1 = require("../../install/web");
Object.defineProperty(exports, "webInstall", { enumerable: true, get: function () { return web_1.install; } });
const constants_1 = require("../constants");
const localInstall = __importStar(require("../install"));
const build = __importStar(require("../meta/build"));
const prestart = __importStar(require("../prestart"));
const pkg = __importStar(require("../../package"));
function setup(initConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        winston.info('NodeBB Setup Triggered via Command Line');
        console.log(`\nWelcome to NodeBB v${pkg.version}!`);
        console.log('\nThis looks like a new installation, so you\'ll have to answer a few questions about your environment before we can proceed.');
        console.log('Press enter to accept the default setting (shown in brackets).');
        localInstall.values = initConfig;
        const data = yield localInstall.setup();
        let configFile = constants_1.paths.config;
        if (nconf.get('config')) {
            configFile = path.resolve(constants_1.paths.baseDir, nconf.get('config'));
        }
        prestart.loadConfig(configFile);
        if (!nconf.get('skip-build')) {
            yield build.buildAll();
        }
        let separator = '     ';
        if (process.stdout.columns > 10) {
            for (let x = 0, cols = process.stdout.columns - 10; x < cols; x += 1) {
                separator += '=';
            }
        }
        console.log(`\n${separator}\n`);
        if (data.hasOwnProperty('password')) {
            console.log('An administrative user was automatically created for you:');
            console.log(`    Username: ${data.username}`);
            console.log(`    Password: ${data.password}`);
            console.log('');
        }
        console.log('NodeBB Setup Completed. Run "./nodebb start" to manually start your NodeBB server.');
        // If I am a child process, notify the parent of the returned data before exiting (useful for notifying
        // hosts of auto-generated username/password during headless setups)
        if (process.send) {
            process.send(data);
        }
        process.exit();
    });
}
exports.setup = setup;
