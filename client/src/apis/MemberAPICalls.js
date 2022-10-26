
import { GET_MEMBER } from '../modules/MemberModule';

export const callGetMemberAPI = (params) => {

    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/account/member?code=${params.code}`;

    return async (dispatch, getState) => {

        const result = await fetch(requestURL, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access_token": window.localStorage.getItem("access_token")
            }
        })
        .then(response => response.json());

        console.log('result', result);

        dispatch({ type: GET_MEMBER,  payload: result.results[0] });
    };
}