import BacklogAndSprintCSS from './BacklogAndSprint.module.css';
import SprintItem from './SprintItem';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { callGetSprintsAPI } from '../../../apis/SprintsForBacklogAPICalls';

import SprintCreationModal from './SprintCreationModal';
import { Button } from 'primereact/button';

function Sprints() {

    const { projectCode } = useParams();
    const sprints = useSelector(state => state.sprintsForBacklogReducer);
    const sprint = useSelector(state => state.sprintForBacklogReducer);
    const dispatch = useDispatch();

    /* 스프린트 목록 조회 */
    useEffect(
        () => {
            dispatch(callGetSprintsAPI({
                projectCode: projectCode,
                offset: 0,
                limit: 10
            }));
        },
        []
    );

    useEffect(
        () => {
            if(sprint.status === 200 || sprint.status === 201) {
                alert(sprint.message);
            }
        },
        [sprint]
    );
    
    return (
        <>
            <div id={ BacklogAndSprintCSS.sprintBox }>
                <div>
                    <span className={ BacklogAndSprintCSS.divTitle }>스프린트</span>
                </div>
                <div>
                    <SprintCreationModal/>
                </div>
            </div>
            {  
                sprints.length > 0
                ? <SprintItem/>
                : <div id={ BacklogAndSprintCSS.noSprint }>등록된 스프린트가 없습니다.</div>
            }
        </>
    );
}

export default Sprints;