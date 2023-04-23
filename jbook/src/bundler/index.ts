// import esbuild web assembly. This is a special version of esbuild that runs in the browser
import * as esbuild from 'esbuild-wasm';
// are own custom plugin
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

let service: esbuild.Service;

// esbuild runs in the browser and can transpile and bundle code
const bundler = async (rawCode: string) => {
  // if the service hasn't been initialized yet, initialize it
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
      // wasmURL: 'https://cdn.jsdelivr.net/npm/esbuild-wasm/esbuild.wasm',
      // can also use a local version of esbuild.wasm
      // wasmURL: "/esbuild.wasm",
    });
  }

  try {
    const result = await service.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      // provide custom plugin to esbuild
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });
    return {
      code: result.outputFiles[0].text,
      err: '',
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        code: '',
        err: err.message,
      };
    } else {
      throw err;
    }
  }
};

export default bundler;
