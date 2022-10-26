import { createActions, handleActions } from "redux-actions";

const initialState = [];

export const GET_TASKS = "tasks/GET_TASKS";


const actions = createActions({
  [GET_TASKS]: () => {}
});

const tasksReducer = handleActions(
  {
    [GET_TASKS]: (state, { payload }) => {
      return payload;
    },
  },
  initialState
);

export default tasksReducer;
