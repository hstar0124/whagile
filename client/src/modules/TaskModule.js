import { createActions, handleActions } from "redux-actions";

const initialState = [];

export const GET_TASK = "task/GET_TASK";
export const PUT_TASK = "task/PUT_TASK";
export const POST_TASK = "task/POST_TASK";
export const DELETE_TASK = "task/DELETE_TASK";

const actions = createActions({
  [GET_TASK]: () => {}, // 일감 개별 조회
  [PUT_TASK]: () => {}, // 일감 수정
  [POST_TASK]: () => {}, // 일감 생성
  [DELETE_TASK]: () => {}, // 일감 삭제
});

const taskReducer = handleActions(
  {
    [GET_TASK]: (state, { payload }) => {
      return payload;
    },
    [PUT_TASK]: (state, { payload }) => {
      return payload;
    },
    [POST_TASK]: (state, { payload }) => {
      return payload;
    },
    [DELETE_TASK]: (state, { payload }) => {
      return payload;
    },
  },
  initialState
);

export default taskReducer;
