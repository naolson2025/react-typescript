import axios from 'axios';
import * as esbuild from 'esbuild-wasm';

// create a custom plugin that will override esbuilds default behavior
export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // find where a file is stored
      // override esbuilds default behavior of finding a file
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }

        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            path: new URL(
              args.path, 'https://unpkg.com' + args.resolveDir + '/'
            ).href,
          };
        }

        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        }
        
        // else if (args.path === 'tiny-test-pkg') {
        //   return {
        //     namespace: 'a',
        //     path: `https://unpkg.com/tiny-test-pkg@1.0.0/index.js`,
        //     // path: `https://unpkg.com/${args.path}`,
        //   };
        // }
      });
 
      // override esbuilds default behavior of loading a file
      // from the file system. Instead, we will load it from
      // unpkg.com
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);
 
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import react from 'react';
              import reactDOM from 'react-dom';
              console.log(react, reactDOM);
            `,
          };
        }

        const { data, request } = await axios.get(args.path);
        return {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };
      });
    },
  };
};