// uses commander to invoke this from the command line
import { Command } from 'commander';
import { serve } from 'local-api';
import path from 'path'

export const serveCommand = new Command()
  // square brackets mean optional
  .command('serve [filename]')
  .description('Open a file for editing')
  // angle brackets mean required
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action((filename = 'notebook.js', options: { port: string }) => {
    const dir = path.join(process.cwd(), path.dirname(filename))
    serve(parseInt(options.port), path.basename(filename), dir, false)
  });
