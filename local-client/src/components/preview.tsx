import { useEffect, useRef } from 'react';
import './preview.css';

interface PreviewProps {
  code: string;
  err: string;
}

// take the bundled user's code and render it in an iframe,
// the iframe will listen for messages coming from the parent window (DOM)
const html = `
  <html>
    <head>
      <style>html { background-color: white; }</style>
    </head>
    <body>
      <div id="root"></div>
      <script>
        const handleError = (err) => {
          const root = document.querySelector("#root");
          root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
          console.error(err);
        };

        // handles async errors
        window.addEventListener("error", (event) => {
          event.preventDefault();
          handleError(event.error);
        });

        window.addEventListener("message", (event) => {
          try {
            eval(event.data);
          } catch (err) {
            handleError(err);
          }
        }, false);
      </script>
    </body>
  </html>
`;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    // this will reset the iframe to the original html
    // just in case a user cleared the iframe contents
    iframe.current.srcdoc = html;
    setTimeout(() => {
      // have the iframe listen for messages coming from the parent window (DOM)
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className='preview-wrapper'>
      <iframe
        title="code"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {err && <div className='preview-error'>{err}</div>}
    </div>
  );
};

export default Preview;
