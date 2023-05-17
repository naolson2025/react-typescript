import express from 'express';
// fs/promises uses promises instead of callbacks which is better for async/await
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

interface LocalApiError {
  code: string;
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get('/cells', async (req, res) => {
    const isLocalApiError = (err: any): err is LocalApiError => {
      return typeof err.code === 'string';
    };

    try {
      // read the file
      const result = await fs.readFile(fullPath, { encoding: 'utf-8' });
      
      // parse a list of cells out and send them back to browser
      res.send(JSON.parse(result));
    } catch (err) {
      // inspect the error, see if it says that the file doesn't exist
      if (isLocalApiError(err)) {
        // ENOENT means error no entity
        if (err.code === 'ENOENT') {
          // create file and add default cells
          await fs.writeFile(fullPath, '[]', 'utf-8');
          res.send([]);
        }
      } else {
        throw err;
      }
    }
  });

  router.post('/cells', async (req, res) => {
    // take the list of cells from the request object
    // serialize them
    const { cells }: { cells: Cell[] } = req.body;
    // write the cells into the file
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

    res.send({ status: 'ok' });
  });

  return router;
};
