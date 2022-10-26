import { GET_TASK_COUNT } from "../modules/ProjectStatisticsModule";
import { decodeJwt } from '../utils/tokenUtils';

export function callGetProjectStatisticsAPI(data) {
    
    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/project-statistics/${ data.projectCode }/counting-tasks`;

    return async function getProjectStatistics(dispatch, getState) {
        
        const result = await fetch(requestURL).then(res => res.json());

        dispatch({ type: GET_TASK_COUNT, payload: result.results });
    }
}