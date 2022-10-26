import { FIND_INQUIRIES, MORE_INQUIRIES, INIT_INQUIRIES } from "../modules/InquiriesModule";
import { REGIST_INQUIRY, FIND_INQUIRY, MODIFY_INQUIRY, REMOVE_INQUIRY } from "../modules/InquiryModule";

/* 1:1 문의 목록 조회 API 호출 */
export function callGetInquiriesAPI(params) {

    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/inquiries`;

    if(Object.keys(params).length !== 0) {

        const paramKeys = [];
        const paramValues = [];

        Object.keys(params).forEach(param => paramKeys.push(param));
        Object.values(params).forEach(param => paramValues.push(param));

        requestURL = requestURL += '?';

        for(let i = 0; i < Object.keys(params).length; i++) {
            requestURL += `${paramKeys[i]}=${paramValues[i]}&`;
        }

        requestURL = requestURL.slice(0, requestURL.length - 1);
    }
    console.log('params...', params);
    console.log('requestURL...', requestURL);

    return async function findInquiries(dispatch, getState) {
        
        const result = await fetch(requestURL, {
            headers: {
                'Access-Token': window.localStorage.getItem('access_token')
            }
        }).then(res => res.json());

        if (params.offset > 0) {
            await dispatch({ type: MORE_INQUIRIES,  payload: result.results });
        } else {
            await dispatch({ type: FIND_INQUIRIES,  payload: result.results });
        }
    };
}

/* 1:1 문의 등록 API 호출 */
export function callPostInquiryAPI(newInquiry) {

    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/inquiries`;

    return async function registInquiry(dispatch, getState) {

        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': window.localStorage.getItem('access_token')
            },
            body: JSON.stringify(newInquiry)
        }).then(res => res.json());

        await dispatch({ type: REGIST_INQUIRY, payload: result });
    }
}

/* 1:1 문의 상세 조회 API 호출 */
export function callGetInquiryDetailAPI(inquiryCode) {

    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/inquiries/${ inquiryCode }`;

    return async function findInquiry(dispatch, getState) {

        const result = await fetch(requestURL).then(res => res.json());

        await dispatch({ type: FIND_INQUIRY, payload: result.results[0] });
        console.log('InquiryDetail : ', result.results[0])
    }
}

/* 1:1 문의 수정 API 호출 */
export function callPutInquiryAPI(modifiedInquiry) {

    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/inquiries`;

    return async function modifyInquiry(dispatch, getState) {

        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': window.localStorage.getItem('access_token')
            },
            body: JSON.stringify(modifiedInquiry)
        }).then(res => res.json());

        await dispatch({ type: MODIFY_INQUIRY, payload: result });
    }
}

/* 1:1 문의 삭제 API 호출 */
export function callDeleteInquiryAPI(inquiryCode) {

    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/inquiries`;

    return async function removeInquiry(dispatch, getState) {

        const result = await fetch(requestURL, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': window.localStorage.getItem('access_token')
            },
            body: JSON.stringify({
                'inquiryCode': inquiryCode
            })
        }).then(res => res.json());

        await dispatch({ type: REMOVE_INQUIRY, payload: result });
    }
}

/* 기존 state reset */
export function callCleanInquiries() {

    return async function initInquiries(dispatch, getState) {
        await dispatch({ type: INIT_INQUIRIES, payload: [] });
    }
}