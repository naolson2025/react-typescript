import { Dispatch } from 'redux';
import axios from 'axios';
import { ActionType } from '../action-types';
import {
  DeleteCellAction,
  Direction,
  InsertCellAfterAction,
  MoveCellAction,
  UpdateCellAction,
  Action,
} from '../actions';
import { Cell, CellTypes } from '../cell';
import bundle from '../../bundler';
import { RootState } from '../reducers';

export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      id,
      content,
    },
  };
};

export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: id,
  };
};

export const moveCell = (
  id: string,
  direction: Direction
): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      id,
      direction,
    },
  };
};

export const insertCellAfter = (
  id: string | null,
  type: CellTypes
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      id,
      type,
    },
  };
};

export const createBundle = (cellId: string, input: string) => {
  return async (dispatch: Dispatch<Action>) => {
    // dispatch an action to indicate that we are starting the bundling process
    // for a particular cell
    // which will set the state of that cell to loading
    dispatch({
      type: ActionType.BUNDLE_START,
      payload: {
        cellId: cellId,
      },
    });

    const result = await bundle(input);

    dispatch({
      type: ActionType.BUNDLE_COMPLETE,
      payload: {
        cellId,
        bundle: result,
      },
    });
  };
};

export const fetchCells = () => {
  return async (dispatch: Dispatch<Action>) => {
    // dispatch an action to indicate that we are fetching cells
    // sets loading to true
    dispatch({
      type: ActionType.FETCH_CELLS,
    });

    try {
      // fetch cells from the api
      const { data }: { data: Cell[] } = await axios.get('/cells');

      // dispatch an action to indicate that we have successfully fetched cells
      dispatch({
        type: ActionType.FETCH_CELLS_COMPLETE,
        payload: data,
      });
    } catch (err) {
      if (err instanceof Error) {
        // dispatch an action to indicate that we have failed to fetch cells
        dispatch({
          type: ActionType.FETCH_CELLS_ERROR,
          payload: err.message,
        });
      }
    }
  };
};

export const saveCells = () => {
  // getState is a function that returns the redux store
  // we can use it to get access to the redux store
  // and get access to the cells state
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    // get access to the cells state
    const {
      cells: { data, order },
    } = getState();

    // create an array of cells
    // from the cells state
    const cells = order.map((id: string) => data[id]);

    // try to save the cells
    try {
      // post the cells to the api
      await axios.post('/cells', { cells });
    } catch (err) {
      if (err instanceof Error) {
        // dispatch an action to indicate that we have failed to save cells
        dispatch({
          type: ActionType.SAVE_CELLS_ERROR,
          payload: err.message,
        });
      }
    }
  };
};
