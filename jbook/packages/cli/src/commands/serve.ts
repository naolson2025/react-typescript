// uses commander to invoke this from the command line
import { Command } from 'commander';
import { serve } from 'local-api';
import path from 'path'

interface LocalApiError {
  code: string;
}

// we will set up a script in package.json to replace process.env.NODE_ENV
// with 'production' so that when the project is packaged and deployed
// it will always run in production mode
const isProduction = process.env.NODE_ENV === 'production'

export const serveCommand = new Command()
  // square brackets mean optional
  .command('serve [filename]')
  .description('Open a file for editing')
  // angle brackets mean required
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action(async (filename = 'notebook.js', options: { port: string }) => {
    const isLocalApiError = (err: any): err is LocalApiError => {
      return typeof err.code === "string";
    };

    try {
      const dir = path.join(process.cwd(), path.dirname(filename))
      await serve(parseInt(options.port), path.basename(filename), dir, !isProduction)
      console.log(
        `Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file.`
      );
    } catch (err) {
      // example of error handling with typescript
      if (isLocalApiError(err)) {
        if (err.code === "EADDRINUSE") {
          console.error("Port is in use. Try running on a different port.");
        }
      } else if (err instanceof Error) {
        console.log("Heres the problem", err.message);
      }
      process.exit(1);
    }
  });
