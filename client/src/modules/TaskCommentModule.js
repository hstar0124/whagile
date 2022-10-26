import { createActions, handleActions } from "redux-actions";


const initialState = [];

export const POST_TASK_COMMENT = "task/POST_TASK_COMMENT";
export const PUT_TASK_COMMENT = "task/PUT_TASK_COMMENT";
export const DELETE_TASK_COMMENT = "task/DELETE_TASK_COMMENT";

const actions = createActions({
  [POST_TASK_COMMENT]: () => {},
  [PUT_TASK_COMMENT]: () => {},
  [DELETE_TASK_COMMENT]: () => {},
});

const taskCommentReducer = handleActions(
  {
    [POST_TASK_COMMENT]: (state, { payload }) => {
      return payload;
    },
    [PUT_TASK_COMMENT]: (state, { payload }) => {
      return payload;
    },
    [DELETE_TASK_COMMENT]: (state, { payload }) => {
      return payload;
    },
  },
  initialState
);

export default taskCommentReducer;
