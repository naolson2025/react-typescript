import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';
import { useMemo } from 'react';

// This hook will return an object with all the action creators
// wrapped in a call to dispatch
export const useActions = () => {
  const dispatch = useDispatch();

  // bindActionCreators takes an object of action creators
  // and the dispatch function
  // and returns an object with all the action creators
  // wrapped in a call to dispatch
  // we memoize the return value so that we only create the
  // object when the component is first rendered
  // and not on every re-render
  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
}