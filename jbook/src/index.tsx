import ReactDOM from 'react-dom';
import { useEffect, useState, useRef } from 'react';
// import esbuild web assembly. This is a special version of esbuild that runs in the browser
import * as esbuild from 'esbuild-wasm';
// are own custom plugin
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import { CodeEditor } from './components/code-editor';
import 'bulmaswatch/superhero/bulmaswatch.min.css'

const App = () => {
  // using ref instead of state because we don't want to re-render the esbuild component when the value changes
  const ref = useRef<any>();
  const iframe = useRef<any>();
  const [input, setInput] = useState('');

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    // this will reset the iframe to the original html
    // just in case a user cleared the iframe contents
    iframe.current.srcdoc = html;

    // bundle the code
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      // provide custom plugin to esbuild
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    // have the iframe listen for messages coming from the parent window (DOM)
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  };

  // esbuild runs in the browser and can transpile & bundle code
  const startService = async () => {
    // example of using a ref on a function component
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
      // wasmURL: 'https://cdn.jsdelivr.net/npm/esbuild-wasm/esbuild.wasm',
      // can also use a local version of esbuild.wasm
      // wasmURL: "/esbuild.wasm",
    });
  };

  // take the bundled user's code and render it in an iframe,
  // the iframe will listen for messages coming from the parent window (DOM)
  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener("message", (event) => {
            try {
              eval(event.data);
            } catch (err) {
              const root = document.querySelector("#root");
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
              console.error(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

  return (
    <div>
      <CodeEditor
        initialValue='const a = 1;'
        onChange={(value) => setInput(value)}
      />
      <textarea
        onChange={(e) => setInput(e.target.value)}
        value={input}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe title="code" ref={iframe} sandbox="allow-scripts" srcDoc={html} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
