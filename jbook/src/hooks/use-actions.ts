import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';

// This hook will return an object with all the action creators
// wrapped in a call to dispatch
export const useActions = () => {
  const dispatch = useDispatch();

  // bindActionCreators takes an object of action creators
  // and the dispatch function
  // and returns an object with all the action creators
  // wrapped in a call to dispatch
  return bindActionCreators(actionCreators, dispatch);
}