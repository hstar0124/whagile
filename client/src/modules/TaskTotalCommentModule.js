import { createActions, handleActions } from "redux-actions";


const initialState = [];

export const GET_TASK_COMMENTS = "task/GET_TASK_COMMENTS";


const actions = createActions({
  [GET_TASK_COMMENTS]: () => {},
});


const taskTotalCommentReducer = handleActions(
  {
   [GET_TASK_COMMENTS]: (state, { payload }) => {
    // console.log("payload", payload);
      return payload;
    },
  },
  initialState
);

export default taskTotalCommentReducer;
