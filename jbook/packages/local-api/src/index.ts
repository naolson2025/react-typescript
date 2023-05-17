import express from 'express'

// local api goals
// 1. GET / -> send back production index.html/js/css assets
// 2. GET /cells -> list of cells in the file
// 3. POST /cells -> add a cell to the file

export const serve = async (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express()

  // the purpose of wrapping express in a promise is to improve the error handling
  // express doesn't have a good way to handle async errors
  // this way when the cli serve.ts file calls this function if there is an error
  // starting the app it will be caught and logged
  // an example error would be if the port is already in use
  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject)
  })
};
