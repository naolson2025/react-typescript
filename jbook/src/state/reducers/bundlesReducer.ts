import { produce } from 'immer';
import { Action } from '../actions';
import { ActionType } from '../action-types';

interface BundlesState {
  [key: string]:
    | {
        loading: boolean;
        code: string;
        err: string;
      }
    | undefined;
}

const initialState: BundlesState = {};

// We're going to use Immer to help us write this reducer. Immer is a library
// that makes it easier to write reducers that produce new state objects. It
// does this by allowing us to write code that looks like we're mutating state
// directly, but behind the scenes, Immer is actually producing a new state
// object for us.
const bundlesReducer = produce(
  (state: BundlesState = initialState, action: Action): BundlesState => {
    switch (action.type) {
      case ActionType.BUNDLE_START:
        state[action.payload.cellId] = {
          loading: true,
          code: '',
          err: '',
        };
        return state;
      case ActionType.BUNDLE_COMPLETE:
        state[action.payload.cellId] = {
          loading: false,
          code: action.payload.bundle.code,
          err: action.payload.bundle.err,
        };
        return state;
      default:
        return state;
    }
  },
  initialState
);

export default bundlesReducer;
