import './code-cell.css';
import { useEffect } from 'react';
import { CodeEditor } from '../components/code-editor';
import Preview from './preview';
import Resizable from './resizable';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  // update cell in redux store
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  // the purpose cumulativeCode so to allow code cells to access
  // variables declared in previous cells
  const cumulativeCode = useTypedSelector((state) => {
    // get all the cells before the current cell
    // and join their content together
    // this will be the code that will be sent to the bundler
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);
    // get the content of all the cells
    const cumulativeCode = [];
    for (let c of orderedCells) {
      // if the cell is a code cell
      if (c.type === 'code') {
        // add the content of the cell to cumulativeCode
        cumulativeCode.push(c.content);
      }
      if (c.id === cell.id) {
        // if we are at the current cell, stop
        break;
      }
    }
    return cumulativeCode;
  });

  console.log(cumulativeCode);

  // debouncing
  // we don't want to run the bundler every time the user types
  // we want to wait for a second after the user stops typing
  // this technique is called debouncing
  useEffect(() => {
    // if there is no bundle, create and return without debouncing
    if (!bundle) {
      createBundle(cell.id, cell.content);
      return;
    }

    const timer = setTimeout(async () => {
      createBundle(cell.id, cell.content);
    }, 1000);

    // clean up function
    // this will run when the component is unmounted
    // or the next time useEffect runs
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.content, cell.id, createBundle]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {
            // when to show progress bar
            // 1. if the user is only writing JS with no imports bundling will be fast
            // so don't show progress bar
            // 2. if the user is writing JS with imports, bundling will take time
            // so show progress bar
            // 3. if it takes longer than .2s to bundle, show progress bar
            // because it will likely take longer
            // we will use CSS to reveal the progress bar if it takes longer than .2s
            !bundle || bundle.loading ? (
              <div className="progress-cover">
                <progress className="progress is-small is-primary" max="100">
                  Loading
                </progress>
              </div>
            ) : (
              <Preview code={bundle.code} err={bundle.err} />
            )
          }
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
