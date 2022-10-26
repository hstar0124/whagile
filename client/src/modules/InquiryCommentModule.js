import { createActions, handleActions } from 'redux-actions';

/* 초기값 */
const initialState = [];

/* 액션 */
export const FIND_INQUIRY_COMMENT = 'inquiry/FIND_INQUIRY_COMMENT';
export const REGIST_INQUIRY_COMMENT = 'inquiry/REGIST_INQUIRY_COMMENT';
export const MODIFY_INQUIRY_COMMENT = 'inquiry/MODIFY_INQUIRY_COMMENT';
export const REMOVE_INQUIRY_COMMENT = 'inquiry/REMOVE_INQUIRY_COMMENT';
export const CLEAN_INQURIY_COMMENT = 'inquiry/CLEAN_INQURIY_COMMENT';

const actions = createActions({
    [FIND_INQUIRY_COMMENT]: () => {},
    [REGIST_INQUIRY_COMMENT]: () => {},
    [MODIFY_INQUIRY_COMMENT]: () => {},
    [REMOVE_INQUIRY_COMMENT]: () => {},
    [CLEAN_INQURIY_COMMENT]: () => {}
});

/* 리듀서 */
const inquiryCommentReducer = handleActions(
    {
        [FIND_INQUIRY_COMMENT]: (state, { payload }) => {
            console.log('find inquiry comment...', payload)
            return payload;
        },
        [REGIST_INQUIRY_COMMENT]: (state, { payload }) => {
            return payload;
        },
        [MODIFY_INQUIRY_COMMENT]: (state, { payload }) => {
            return payload;
        },
        [REMOVE_INQUIRY_COMMENT]: (state, { payload }) => {
            return payload;
        },
        [CLEAN_INQURIY_COMMENT]: (state, { payload }) => {
            state = initialState;    //초기 state값으로 clean up 한다
            return state;
        }
    },
    initialState
);

export default inquiryCommentReducer;