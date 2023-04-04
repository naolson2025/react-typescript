import ReactDOM from "react-dom";
import { useEffect, useState, useRef } from "react";
// import esbuild web assembly. This is a special version of esbuild that runs in the browser
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";

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
      plugins: [unpkgPathPlugin()],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      }
    });
    setCode(result.outputFiles[0].text);
  }

  // esbuild runs in the browser and can transpile & bundle code
  const startService = async () => {
    // example of using a ref on a function component
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "/esbuild.wasm",
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
  </div>;
};

ReactDOM.render(<App />, document.getElementById("root"));