import { program } from "commander";
import { serveCommand } from "./commands/serve";

program.addCommand(serveCommand);

// process is a global variable that is available in NodeJS
program.parse(process.argv);