import { GET_AUTHS } from "../modules/AuthsModule";
import { GET_AUTH } from "../modules/AuthModule";
import { GET_AUTH_ORDER } from "../modules/AuthOrderModule";

export const callGetAuthsAPI = (params) => { // 권한 목록 조회

    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/auth`;
    
    let defaultParams = { 
        // offset: 0,
        // limit: 30,
        orderCondition: 'code',
        orderValue: 'desc'
    };

    if(params === undefined || Object.keys(params).length === 0) {
        requestURL += `?${Object.entries(defaultParams).map(param => param.join('=')).join('&')}`;
    } else {
        requestURL += `?${Object.entries(params).map(param => param.join('=')).join('&')}`;
    }
    
    return async (dispatch, getState) => {
        
        const result = await fetch(requestURL).then(res => res.json());

        dispatch({ type: GET_AUTHS, payload: result.results });
    }
}

export const callGetAuthAPI = (params) => { // 권한 조회

    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/auth/${params.authorityCode}`;

    return async (dispatch, getState) => {
        
        const result = await fetch(requestURL).then(res => res.json());
        
        dispatch({ type: GET_AUTH, payload: result.results[0] });
    }
}

export const callPostAuthAPI = (paramAuth, paramAuthOrder) => { // 권한 생성
    
    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/auth`;
    
    return async (dispatch, getState) => {
        
        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authorityName: paramAuth.authorityName,
                authorityActivatedYn: paramAuth.authorityActivatedYn,
                authorityExposureOrder: (paramAuth.authorityExposureOrder)? paramAuth.authorityExposureOrder: '',
                authorityDescription: paramAuth.authorityDescription
            })
        }).then(res => res.json());

        await dispatch(callGetAuthsAPI());
        // await dispatch(callGetAuthAPI({
        //     authorityCode: result.results.insertId
        // }));
        
        await dispatch(callPutAuthOrderAPI(paramAuthOrder));
    }
}

export const callPutAuthAPI = (paramAuth, paramAuthOrder) => { // 권한 변경
    
    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/auth`;
    
    return async (dispatch, getState) => {

        await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authorityCode: paramAuth.authorityCode,
                authorityName: paramAuth.authorityName,
                authorityActivatedYn: paramAuth.authorityActivatedYn,
                authorityExposureOrder: (paramAuth.authorityExposureOrder)? paramAuth.authorityExposureOrder: '',
                authorityDescription: paramAuth.authorityDescription
            })
        })

        if(paramAuth.authorityActivatedYn.toUpperCase() === 'Y') {
            
            await dispatch(callPutAuthOrderAPI(paramAuthOrder));
        } else {
            
            // 비활성화된 auth를 제외하고 authorityExposureOrder를 재정렬
            let newAuthOrder = paramAuthOrder.filter((auth) => auth.authorityCode !== paramAuth.authorityCode);
            for(let i = 0; i < newAuthOrder.length; i++) {
                newAuthOrder[i].authorityExposureOrder = i + 1;
            }
            
            await dispatch(callPutAuthOrderAPI(newAuthOrder));
        }

        await dispatch(callGetAuthsAPI());
    }
}

export const callDeleteAuthAPI = (paramAuth, paramAuthOrder) => { // 권한 삭제
    
    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/auth`;
    
    return async (dispatch, getState) => {
        
        await fetch(requestURL, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authorityCode: paramAuth.authorityCode
            })
        })
        
        // 삭제된 auth를 제외하고 authorityExposureOrder를 재정렬
        let newAuthOrder = paramAuthOrder.filter((auth) => auth.authorityCode !== paramAuth.authorityCode);
        for(let i = 0; i < newAuthOrder.length; i++) {
            newAuthOrder[i].authorityExposureOrder = i + 1;
        }

        await dispatch(callPutAuthOrderAPI(newAuthOrder));

        await dispatch(callGetAuthsAPI());
    }
}

export const callGetAuthOrderAPI = (params) => { // 권한 순서 조회

    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/auth`;
    
    let defaultParams = { 
        searchCondition: 'activated_yn',
        searchValue: 'Y',
        orderCondition: 'exposure_order',
        orderValue: 'asc'
    };

    if(params === undefined || Object.keys(params).length === 0) {
        requestURL += `?${Object.entries(defaultParams).map(param => param.join('=')).join('&')}`;
    } else {
        requestURL += `?${Object.entries(params).map(param => param.join('=')).join('&')}`;
    }
    
    return async (dispatch, getState) => {
        
        const result = await fetch(requestURL).then(res => res.json());
        
        dispatch({ type: GET_AUTH_ORDER, payload: result.results });
    }
}

export const callPutAuthOrderAPI = (params) => { // 권한 순서 변경
    
    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/auth/order`;
    
    return async (dispatch, getState) => {
        
        await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });
        
        await dispatch(callGetAuthOrderAPI());
    }
}