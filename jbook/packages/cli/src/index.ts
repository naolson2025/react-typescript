#!/usr/bin/env node

// The above comment specifies this file is the entry point for the CLI
import { program } from "commander";
import { serveCommand } from "./commands/serve";

program.addCommand(serveCommand);

// process is a global variable that is available in NodeJS
program.parse(process.argv);