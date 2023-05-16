"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const serve_1 = require("./commands/serve");
commander_1.program.addCommand(serve_1.serveCommand);
// process is a global variable that is available in NodeJS
commander_1.program.parse(process.argv);
