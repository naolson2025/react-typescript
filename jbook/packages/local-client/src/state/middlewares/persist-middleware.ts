// redux middleware

import { Dispatch } from 'redux';
import { Action } from '../actions';
import { ActionType } from '../action-types';
import { saveCells } from '../action-creators';
import { RootState } from '../reducers';

// redux middlewares are a function, that calls a function, that calls a function
export const persistMiddleware = ({
  dispatch,
  getState,
}: {
  dispatch: Dispatch<Action>;
  getState: () => RootState;
}) => {
  let timer: any;

  return (next: (action: Action) => void) => {
    return (action: Action) => {
      // no matter what we forward on every action to the next middleware (if there is one)
      next(action);

      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.INSERT_CELL_AFTER,
          ActionType.DELETE_CELL,
        ].includes(action.type)
      ) {
        if (timer) {
          clearTimeout(timer);
        }

        // debounce the saveCells function
        timer = setTimeout(() => {
          // save the cells to the db
          // call saveCells, which returns a function, then call that function
          saveCells()(dispatch, getState);
        }, 1000);
      }
    };
  };
};
