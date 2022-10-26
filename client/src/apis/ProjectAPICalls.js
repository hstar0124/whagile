import { GET_PROJECT, GET_PROJECTS, POST_PROJECT, PUT_PROJECT,  DELETE_PROJECT } from "../modules/ProjectModule";
import { GET_PROJECT_MEMBER } from "../modules/ProjectMemberModule";
import { GET_INVITED_MEMBER, PUT_MODIFY_AUTHORITY, DELETE_PROJECT_MEMBER } from "../modules/ProjectMemberModule";
import { GET_PROJECT_MEMBER_INFO } from "../modules/ProjectMembersModule";
import { GET_PROJECT_NOTICE, PUT_PROJECT_NOTICE } from "../modules/ProjectNoticeModule";
import { decodeJwt } from '../utils/tokenUtils';

export function callGetProjectsAPI(params) {
    
    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/projects`;

    if(Object.keys(params).length !== 0) {
        requestURL += `?${Object.entries(params).map(param => param.join('=')).join('&')}`;
    }

    return async function getProjects(dispatch, getState) {
        
        const result = await fetch(requestURL).then(res => res.json());

        dispatch({ type: GET_PROJECTS, payload: result.results });
    }
}

export function callGetProjectAPI(params) {

    // let requestURL = `http://localhost:8888/api/projects/`;
    // requestURL += `${Object.entries(params).map(param => param.slice(1))}`;

    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/projects/${params.projectCode}`;

    return async function getProject(dispatch, getState) {

        const result = await fetch(requestURL).then(res => res.json());

        dispatch({ type: GET_PROJECT, payload: result.results});
    }
}

export const  callPostProjectAPI = (projectName, projectDescription, emails) => {
    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/projects`;
    const decoded = decodeJwt(window.localStorage.getItem("access_token"));

    return async (dispatch, getState) => {

        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectName: projectName,
                projectDescription: projectDescription,
                loginMember: (decoded !== 'undefined')? decoded.code: '',
                emails: emails
            })
        })
        .then(res => res.json());
        await dispatch({ type: POST_PROJECT, payload: result.results });
        await console.log(result.results);
    }
}

export const callPutProjectAPI = (projectCode, projectName, projectDescription, projectOwner) => {
    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/projects/`;

    requestURL += `${ projectCode }`

    return async function getProject(dispatch, getState) {

        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectCode: Number(projectCode),
                projectName: projectName,
                projectDescription: projectDescription,
                projectOwner: projectOwner
            })

        })
        .then(res => res.json());
        await dispatch({ type: PUT_PROJECT, payload: result.results });
    }
}

export const callDeleteProjectAPI = (params) => {

    console.log('callDeleteProjectAPI',params);
    console.log(params.projectCode);
    console.log(params.loginMember);

    let requestURL =  `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/projects`;

    if(Object.keys(params).length !== 0) {
        requestURL += `?${Object.entries(params).map(param => param.join('=')).join('&')}`;
    }

    // requestURL += `${ params.projectCode }`;

    console.log('requestURL: ', requestURL);

    return async function getProject(dispatch, getState) {

        const result = await fetch(requestURL,{
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());

        console.log(result);
        dispatch({ type: DELETE_PROJECT, payload: result.results});
    }
}

export const callGetProjectMemberAPI = (params) => {

    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/projects/`;

    requestURL += `${Object.entries(params).map(param => param.slice(1))}`;

    requestURL += `/member`;

    return async function getProjectMembers(dispatch, getState) {

        const result = await fetch(requestURL).then(res => res.json());

        dispatch({ type: GET_PROJECT_MEMBER, payload: result.results});
    }
}

export const callGetProjectMemberInfoAPI = (params) => {

    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/projects/${ params.projectCode}/member/${ params.memberCode }`;

    return async function getProjectMemberInfo(dispatch, getState) {

        const result = await fetch(requestURL).then(res => res.json());

        dispatch({ type: GET_PROJECT_MEMBER_INFO, payload: result.results});
    }

}

export const callDeleteProjectMemberAPI = (params) => {

    console.log(params);

    let requestURL =  `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/projects/`

    requestURL += `${ params.projectCode }`;

    requestURL += `/removeProjectMember/`

    requestURL += `${ params.memberCode }`;

    console.log(requestURL);

    return async function getProject(dispatch, getState) {

        const result = await fetch(requestURL,{
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());

        console.log(result);
        dispatch({ type: DELETE_PROJECT_MEMBER, payload: result.results});
    }
}

export const callPostInviteMemberAPI = (emails, projectCode) => {

    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/projects/invitation`;

    return async function getProject(dispatch, getState) {

        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emails: emails,
                projectCode: projectCode
            })
        }).then(res => res.json());

        dispatch({ type: GET_INVITED_MEMBER, payload: result.results});
    }
}

export const callPutModifyAuthorityProjectMemberAPI = (data) => {

    console.log('api에 넘어온 데이터 확인 : ', data);

    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/projects/${ data.projectCode }/member/${ data.memberCode }`;

    return async function getProject(dispatch, getState) {

        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authorityCode: data.authorityCode
            })
        }).then(res => res.json());

        dispatch({ type: PUT_MODIFY_AUTHORITY, payload: result.results});
    };
};

export const callGetNoticeAPI = (data) => {

    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/projects/${ data.projectCode }/notice`;

    return async function getProject(dispatch, getState) {

        const result = await fetch(requestURL).then(res => res.json());

        dispatch({ type: GET_PROJECT_NOTICE, payload: result.results});
    }
}

export const callPutModifyNoticeAPI = (data) => {

    console.log('data는 ', data);
    const decoded = decodeJwt(window.localStorage.getItem("access_token"));
    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/projects/${ data.projectCode }/notice`;

    return async function registNotice(dispatch, getState) {

        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectCode: data.projectCode,
                noticeCode : data.noticeCode,
                content: data.content,
                modifier: (decoded !== 'undefined')? decoded.code: ''
            })
        }).then(res => res.json());

        dispatch({ type : PUT_PROJECT_NOTICE, payload : result.results});
    }


} 