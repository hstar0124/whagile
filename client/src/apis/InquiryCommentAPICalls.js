import { REGIST_INQUIRY_COMMENT, FIND_INQUIRY_COMMENT, MODIFY_INQUIRY_COMMENT, REMOVE_INQUIRY_COMMENT, CLEAN_INQURIY_COMMENT } from '../modules/InquiryCommentModule.js';

/* 1:1 문의 답변 등록 API 호출 */
export function callPostInquiryCommentAPI(newComment) {

    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/inquiry-comment`;

    return async function registInquiryComment(dispatch, getState) {

        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': window.localStorage.getItem('access_token')
            },
            body: JSON.stringify(newComment)
        }).then(res => res.json());

        await dispatch({ type: REGIST_INQUIRY_COMMENT, payload: result });
    }
};

/* 1:1 문의 답변 조회 API 호출 */
export function callGetInquiryCommentAPI(inquiryCode) {

    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/inquiry-comment?code=${ inquiryCode }`;

    return async function findInquiryComment(dispatch, getState) {

        const result = await fetch(requestURL).then(res => res.json());

        await dispatch({ type: FIND_INQUIRY_COMMENT, payload: result.results[0] });
    }
};

/* 1:1 문의 답변 수정 API 호출 */
export function callPutInquiryCommentAPI(modifyingContent) {

    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/inquiry-comment`;

    return async function removeInquiryComment(dispatch, getState) {

        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': window.localStorage.getItem('access_token')
            },
            body: JSON.stringify(modifyingContent)
        }).then(res => res.json());

        await dispatch({ type: MODIFY_INQUIRY_COMMENT, payload: result });
    }
};

/* 1:1 문의 답변 삭제 API 호출 */
export function callDeleteInquiryCommentAPI(params) {

    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/inquiry-comment`;

    return async function removeInquiryComment(dispatch, getState) {

        const result = await fetch(requestURL, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': window.localStorage.getItem('access_token')
            },
            body: JSON.stringify(params)
        }).then(res => res.json());

        await dispatch({ type: REMOVE_INQUIRY_COMMENT, payload: result });
    }
};

/* 1:1 문의 답변 데이터 초기화 */
export function callCleanInquiryComment() {

    return async function cleanInquiryComment(dispatch, getState) {

        await dispatch({ type: CLEAN_INQURIY_COMMENT, payload: [] });
    }
}