import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path'
import { createCellsRouter } from './routes/cells'

// local api goals
// 1. GET / -> send back production index.html/js/css assets
// 1.a. If we are running in development mode, redirect to localhost:3000 create-react-app server
// 1.b. If we are running in production mode, send back index.html/js/css assets
// 2. GET /cells -> list of cells in the file
// 3. POST /cells -> add a cell to the file

export const serve = async (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express()

  if (useProxy) {
    // this middleware will redirect us to the create-react-app server
    // when we are developing
    app.use(createProxyMiddleware({
      target: 'http://localhost:3000',
      // web sockets are used for communication between the browser and the server
      ws: true,
      logLevel: 'silent',
    }))
  } else {
    // this middleware will load production assets from the build folder
    const packagePath = require.resolve('local-client/build/index.html')
    // path.dirname will return the directory name of the path
    app.use(express.static(path.dirname(packagePath)));
  }

  app.use(createCellsRouter(filename, dir))

  // the purpose of wrapping express in a promise is to improve the error handling
  // express doesn't have a good way to handle async errors
  // this way when the cli serve.ts file calls this function if there is an error
  // starting the app it will be caught and logged
  // an example error would be if the port is already in use
  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject)
  })
};
