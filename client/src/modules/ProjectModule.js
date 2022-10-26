import { createActions, handleActions } from 'redux-actions';

/* 초기 값 */
const initialState = [];

/* 액션 */
export const GET_PROJECTS = 'projects/GET_PROJECTS';
export const GET_PROJECT = 'projects/GET_PROJECT';
export const POST_PROJECT = 'projects/POST_PROJECT';
export const PUT_PROJECT = 'projects/PUT_PROJECT';
export const DELETE_PROJECT = 'projects/DELETE_PROJECT';
export const GET_MEMBER = 'projects/GET_MEMBER';

const actions = createActions({
    [GET_PROJECTS]: () => {},
    [GET_PROJECT]: () => {},
    [POST_PROJECT]: () => {},
    [PUT_PROJECT]: () => {},
    [DELETE_PROJECT]: () => {}
});

/* 리듀서 */
const projectsReducer = handleActions(
    {
        [GET_PROJECTS]: (state, { payload }) => {
            return payload;
        },
        [GET_PROJECT]: (state, { payload }) => {
            return payload;
        },
        [POST_PROJECT]: (state, { payload }) => {
            return payload;
        },
        [PUT_PROJECT]: (state, { payload }) => {
            return payload;
        },
        [DELETE_PROJECT]: (state, { payload }) => {
            return payload;
        }
    },
    initialState
);

export default projectsReducer;