import BacklogAndSprintCSS from './BacklogAndSprint.module.css';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import DivHeader from './DivHeader';
import BacklogCreationModal from './BacklogCreationModal';
import BacklogDetails from './BacklogDetails';

import { Dropdown } from 'primereact/dropdown';
import { callGetBacklogDetailsAPI, callGetBacklogsAPI, callGetFilteredBacklogsAPI, callCleanBacklog } from '../../../apis/BacklogAPICalls';
import { callGetBacklogCommentsAPI } from '../../../apis/BacklogCommentAPICalls';

function Backlogs() {
    
    const { projectCode } = useParams();
    const dispatch = useDispatch();
    const backlogs = useSelector(state => state.backlogReducer);
    const backlogDetails = useSelector(state => state.backlogDetailReducer);
    const backlogComments = useSelector(state => state.backlogCommentReducer);
    
    const [visibleRight, setVisibleRight] = useState(false);

    /* 페이징 */
    const [pageNo, setPageNo] = useState(0);

    /* 필터 조건 */
    const [progressStatus, setProgressStatus] = useState(null);
    const [urgency, setUrgency] = useState(null);
    const [issue, setIssue] = useState(null);

    /* 필터 조건 options */
    const progressStatusOptions = [
        { name: '진행 전', value: '진행 전' },
        { name: '진행 중', value: '진행 중' },
        { name: '완료', value: '완료' }
    ];
    const urgencyOptions = [
        { name: '낮음', value: '낮음' },
        { name: '보통', value: '보통' },
        { name: '긴급', value: '긴급' }
    ];
    const issueCheck = [
        { name: '기본', value: 0 },
        { name: '이슈', value: 1 }
    ];

    useEffect(
        () => {
            dispatch(callCleanBacklog());
            dispatch(callGetBacklogsAPI({
                'offset': pageNo,
                'limit': 10,
                'projectCode': projectCode
            }));
        },
        []
    );

    /* 목록 행 더보기 요청 onClick Handler fuction */
    const readMoreBacklogs = useCallback(
        () => {
            dispatch(callGetFilteredBacklogsAPI(
                {
                    'offset': (pageNo + 1) * 10, 
                    'limit': 10,
                    'projectCode': projectCode
                }
            ));
            setPageNo(pageNo + 1);
        },
        [backlogs]
    );

    /* 필터 조건을 적용한 목록행 조회 요청 */
    const findFilteredResults = useCallback(
        () => {
            dispatch(callGetFilteredBacklogsAPI(
                {
                    offset: pageNo,
                    limit: 10,
                    projectCode: projectCode,
                    urgency: urgency,
                    issue: issue
                }
            ));
        },
        [backlogs, urgency, issue]
    );

    /* 백로그 상세내용 조회 요청 */
    const seeBacklogDetails = useCallback(
        (backlogCode) => {
            dispatch(callGetBacklogDetailsAPI(backlogCode));
            dispatch(callGetBacklogCommentsAPI({
                backlogCode: backlogCode,
                offset: 0,
                limit: 5
            }));
            setVisibleRight(true);
        },
        []
    );

    return (
        <>
            <span className={ BacklogAndSprintCSS.divTitle }>백로그 목록</span>
            <hr className={ BacklogAndSprintCSS.divisionLine }/>
            {/* <div id={ BacklogAndSprintCSS.filterConditions }>
                <Dropdown 
                    value={ urgency } 
                    options={ urgencyOptions } 
                    onChange={ (e) => setUrgency(e.target.value) }  
                    optionLabel="name" 
                    optionValue="value" 
                    placeholder="긴급도"
                />
                <Dropdown 
                    value={ issue } 
                    options={ issueCheck } 
                    optionLabel="name" 
                    optionValue="value" 
                    onChange={ (e) => setIssue(e.target.value) } 
                    placeholder="구분"
                />
                <button onClick={ () => findFilteredResults() }>적용</button>            
            </div> */}
            <div>
                 <DivHeader/>
                 { 
                    backlogs.length === 0? 
                    <div className={ BacklogAndSprintCSS.backlogItem }>
                        등록된 백로그가 없습니다.
                    </div> 
                    :
                    backlogs.map(backlog => 
                        <div 
                            className={ BacklogAndSprintCSS.backlogItem }
                            key={ backlog.backlogCode }
                        >
                            <div>{ backlog.issue === 1? '이슈' : '기본' }</div>
                            <div>{ backlog.backlogTitle }</div>
                            <div>{ backlog.progressStatus }</div>
                            <div>{ backlog.urgency }</div>
                            <div>{ backlog.memberName }</div>
                            <div>
                                <button 
                                    id={ BacklogAndSprintCSS.moreDetailsBtn }
                                    onClick={ () => seeBacklogDetails(backlog.backlogCode) }
                                >
                                    자세히
                                </button>
                            </div>
                        </div>  
                    )
                }
                <BacklogDetails
                    visibleRight = { visibleRight }
                    setVisibleRight = { setVisibleRight }
                />
            </div>
            <button id={ BacklogAndSprintCSS.readMoreBtn }
                onClick={ () => readMoreBacklogs() }
                style={{ visibility: backlogs.length === 0? 'hidden' : 'visible' }}
            >
                <i className="pi pi-fw pi-ellipsis-h"/> 더보기 
            </button><br/>
            <BacklogCreationModal/>
        </>
    );
}

export default Backlogs;