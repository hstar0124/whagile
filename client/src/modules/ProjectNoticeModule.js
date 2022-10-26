import { createActions, handleActions } from 'redux-actions';

/* 초기 값 */
const initialState = [];

/* 액션 */
export const GET_PROJECT_NOTICE = 'projects/GET_PROJECT_NOTICE';
export const PUT_PROJECT_NOTICE = 'projects/PUT_PROJECT_NOTICE';

const actions = createActions({
    [GET_PROJECT_NOTICE]: () => {},
    [PUT_PROJECT_NOTICE]: () => {}
});

/* 리듀서 */
const ProjectNoticeReducer = handleActions(
    {
        [GET_PROJECT_NOTICE]: (state, { payload }) => {
            if (payload !== undefined) {
                return payload;
            } else {
                return state;
            }
        },
        [PUT_PROJECT_NOTICE]: (state, { payload }) => {
            if (payload !== undefined) {
                return payload;
            } else {
                return state;
            }
        }
    },
    initialState
);

export default ProjectNoticeReducer;