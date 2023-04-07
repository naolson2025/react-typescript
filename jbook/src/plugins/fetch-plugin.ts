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
      // each onload will only execute if there is a file that matches
      // the filter. If there is no match, esbuild will continue to the
      // next plugin or the default behavior
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      });

      // as long as we don't return a result, esbuild will continue to
      // the next plugin or the default behavior
      // this will run for every file that is loaded
      // so we can store common code here to execute on every file
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // check to see if we have already fetched this file
        // and if it is in the cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
  
        // if it is, return it immediately
        if (cachedResult) {
          return cachedResult;
        }
        return null;
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {  
        const { data, request } = await axios.get(args.path);

        // hacky workaround for css files
        // insert css into a style tag with JS, need to escape quotes
        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        const contents = `
          const style = document.createElement('style');
          style.innerText = '${escaped}';
          document.head.appendChild(style);
          `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };
        // store response in cache
        await fileCache.setItem(args.path, result);
  
        return result;
      });
      // override esbuilds default behavior of loading a file
      // from the file system. Instead, we will load it from
      // unpkg.com
      build.onLoad({ filter: /.*/ }, async (args: any) => {  
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };
        // store response in cache
        await fileCache.setItem(args.path, result);
  
        return result;
      });
    }
  }
}