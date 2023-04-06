import axios from 'axios';
import * as esbuild from 'esbuild-wasm';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
  // name can be anything we want
  name: 'filecache',
});

// immediately invoked function expression, just for testing
// (async () => {
//   await fileCache.setItem('color', 'red');
//   const color = await fileCache.getItem('color');
//   console.log(color);
// })();

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      // override esbuilds default behavior of loading a file
      // from the file system. Instead, we will load it from
      // unpkg.com
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: inputCode,
          };
        }
  
        // check to see if we have already fetched this file
        // and if it is in the cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
  
        // if it is, return it immediately
        if (cachedResult) {
          return cachedResult;
        }
  
        const { data, request } = await axios.get(args.path);

        // match the file type
        const fileType = args.path.match(/.css$/) ? 'css' : 'jsx';

        // hacky workaround for css files
        // insert css into a style tag with JS
        const contents = fileType === 'css' ?
          `
          const style = document.createElement('style');
          style.innerText = 'body { background-color: "red" }';
          document.head.appendChild(style);
          ` : data;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };
        // store response in cache
        await fileCache.setItem(args.path, result);
  
        return result;
      });
    }
  }
}