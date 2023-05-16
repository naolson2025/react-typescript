import { useTypedSelector } from './use-typed-selector';

export const useCumulativeCode = (cellId: string) => {
  // the purpose cumulativeCode is to allow code cells to access
  // variables declared in previous cells
  return useTypedSelector((state) => {
    // get all the cells before the current cell
    // and join their content together
    // this will be the code that will be sent to the bundler
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);
    // get the content of all the cells
    // providing a default function to show variable in preview
    const showFunc = `
      import _React from 'react';
      import _ReactDOM from 'react-dom';
      var show = (value) => {
        const root = document.querySelector('#root');

        if (typeof value === 'object') {
          if (value.$$typeof && value.props) {
            // if the value is a react component
            _ReactDOM.render(value, root);
          } else {
            root.innerHTML = JSON.stringify(value);
          }
        } else {
          root.innerHTML = value;
        }
      }
    `

    const showFuncNoop = 'var show = () => {}';

    const cumulativeCode = [];
    for (let c of orderedCells) {
      // if the cell is a code cell
      if (c.type === 'code') {
        if (c.id === cellId) {
          // if we are at the current cell, add the show function
          cumulativeCode.push(showFunc);
        } else {
          // if we are not at the current cell, add the noop function
          cumulativeCode.push(showFuncNoop);
        }
        // add the content of the cell to cumulativeCode
        cumulativeCode.push(c.content);
      }
      if (c.id === cellId) {
        // if we are at the current cell, stop
        break;
      }
    }
    return cumulativeCode;
  }).join('\n');
};