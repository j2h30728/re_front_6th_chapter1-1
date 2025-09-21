import { createObserver } from "./createObserver";

export default function createStore(reducer, initialState) {
  const { subscribe, notify, clear } = createObserver();
  let state = initialState;

  const getState = () => state;

  const dispatch = (action) => {
    const newState = reducer(state, action);
    if (!Object.is(state, newState)) {
      state = newState;
      notify(state);
    }
  };

  return {
    getState,
    dispatch,
    subscribe,
    clear,
  };
}
