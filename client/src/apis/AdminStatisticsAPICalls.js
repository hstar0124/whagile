import { GET_COUNTS } from "../modules/AdminStatisticsModule";
import { GET_CHART_COUNTS } from "../modules/AdminStatisticsChartModule";

export function callGetAdminStatisticsAPI() {
    
    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/admin-statistics`;

    return async function getAdminStatisticsAPI(dispatch, getState) {
        
        const result = await fetch(requestURL).then(res => res.json());

        dispatch({ type: GET_COUNTS, payload: result.results });
    }
}

export function callGetAdminStatisticsChartAPI(params) {
   
    if(params.searchValue) {
        params.searchValue2 = dateFormat2(params.searchValue);
        params.searchValue = dateFormat(params.searchValue);
    }

    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/admin-statistics/chart`;

    requestURL += `?${Object.entries(params).map(param => param.join('=')).join('&')}`;

    return async function getAdminStatisticsChartAPI(dispatch, getState) {
        
        const result = await fetch(requestURL).then(res => res.json());

        dispatch({ type: GET_CHART_COUNTS, payload: result.results });
    }
}

function dateFormat(date) { // Fri Jul 22 2022 00:00:00 GMT+0900 (한국 표준시) 형식을 '21/07/22'으로 바꿔줌
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    second = second >= 10 ? second : '0' + second;

    return day + '/' + month + '/' + date.getFullYear().toString().substr(2, 2);
}

function dateFormat2(date) { // Fri Jul 22 2022 00:00:00 GMT+0900 (한국 표준시) 형식을 '21/07/22'으로 바꿔줌
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    second = second >= 10 ? second : '0' + second;

    return date.getFullYear() + '-' + month + '-' + day;
}