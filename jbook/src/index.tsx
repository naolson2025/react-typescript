import ReactDOM from "react-dom";
import { useEffect, useState, useRef } from "react";
// import esbuild web assembly. This is a special version of esbuild that runs in the browser
import * as esbuild from "esbuild-wasm";
// are own custom plugin
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

const App = () => {
  // using ref instead of state because we don't want to re-render the esbuild component when the value changes
  const ref = useRef<any>();
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    // take the user input code and transpile it from jsx to es2015
    // const result = await ref.current.transform(input, {
    //   loader: "jsx",
    //   target: "es2015",
    // })
    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      // provide custom plugin to esbuild
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      }
    });
    setCode(result.outputFiles[0].text);

    try {
      eval(result.outputFiles[0].text)
    } catch (error) {
      alert(error);
    }
  }

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


  return <div>
    <textarea
      onChange={e => setInput(e.target.value)}
      value={input}
    >
    </textarea>
    <div>
      <button onClick={onClick}>Submit</button>
    </div>
    <pre>{code}</pre>
    <iframe src='/test.html' sandbox='allow-scripts' />
  </div>;
};

ReactDOM.render(<App />, document.getElementById("root"));