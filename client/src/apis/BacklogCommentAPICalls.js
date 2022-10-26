import { FIND_BACKLOG_COMMENTS, MORE_BACKLOG_COMMENTS, CLEAN_BACKLOG_COMMENTS } from '../modules/BacklogCommentModule';
import { REGIST_BACKLOG_COMMENT, MODIFY_BACKLOG_COMMENT, REMOVE_BACKLOG_COMMENT } from '../modules/BacklogCommentDetailModule';

/* 백로그 댓글 목록 조회 API 호출 */
export function callGetBacklogCommentsAPI(params) {

    console.log('백로그 댓글 파라미터: ', params);

    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/backlog-comments/`;

    requestURL += `${params.backlogCode}?offset=${params.offset}&limit=${params.limit}`;

    console.log('백로그 댓글 목록 조회 url : ', requestURL)

    return async function findBacklogComments(dispatch, getState) {

        const preState = getState().backlogCommentReducer;

        const result = await fetch(requestURL)
                            .then(res => res.json());
        
        if(preState.length > 0) {
            await dispatch({ type: MORE_BACKLOG_COMMENTS, payload: result.results});
        } else {
            await dispatch({ type: FIND_BACKLOG_COMMENTS,  payload: result.results });
        }

        console.log('백로그 댓글 목록 result: ', result.results)
    };
}

/* 백로그 댓글 생성 API 호출 */
export function callPostBacklogCommentAPI(newComment) {

    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/backlog-comments`;

    return async function registBacklogComment(dispatch, getState) {

        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': window.localStorage.getItem('access_token')
            },
            body: JSON.stringify(newComment)
        }).then(res => res.json());

        await dispatch({ type: REGIST_BACKLOG_COMMENT, payload: result });
    }
}

/* 백로그 댓글 수정 API 호출 */
export function callPutBacklogCommentAPI(modifyRequest) {

    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/backlog-comments`;

    return async function modifyBacklogComment(dispatch, getState) {
        
        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': window.localStorage.getItem('access_token')
            },
            body: JSON.stringify(modifyRequest)
        }).then(res => res.json());

        await dispatch({ type: MODIFY_BACKLOG_COMMENT, payload: result });
    }
}

/* 백로그 댓글 삭제 API 호출 */
export function callDeleteBacklogCommentAPI(removeRequest) {

    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/backlog-comments`;

    return async function removeBacklogComment(dispatch, getState) {

        const result = await fetch(requestURL, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': window.localStorage.getItem('access_token')
            },
            body: JSON.stringify(removeRequest)
        }).then(res => res.json());

        await dispatch({ type: REMOVE_BACKLOG_COMMENT, payload: result });
    }
}

/* 기존 state reset */
export function callCleanBacklogComments() {

    return async function cleanBacklogComments(dispatch, getState) {
        await dispatch({ type: CLEAN_BACKLOG_COMMENTS, payload: [] });
    }
};