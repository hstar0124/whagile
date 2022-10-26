import BacklogAndSprintCSS from './BacklogAndSprint.module.css';

import { useSelector } from 'react-redux';

import SprintEditModal from './SprintEditModal';
import SprintStartModal from './SprintStartModal';
import SprintEndModal from './SprintEndModal';

function SprintItem() {

    const sprints = useSelector(state => state.sprintsForBacklogReducer);

    /* 스프린트 펼치기 */
    const setVisible = (sprintCode) => {
        document.getElementById(sprintCode).style.display = 'block';
        document.getElementById('toggleOn' + sprintCode).style.display = 'none';
        document.getElementById('toggleOff' + sprintCode).style.display = 'block';
    }
    
    /* 스프린트 접기 */
    const setInvisible = (sprintCode) => {
        document.getElementById(sprintCode).style.display = 'none';
        document.getElementById('toggleOn' + sprintCode).style.display = 'block';
        document.getElementById('toggleOff' + sprintCode).style.display = 'none';
    }

    return (
        <>{
            sprints.map(sprint => 
                <div 
                    key={ sprint.sprintCode } 
                    className={ BacklogAndSprintCSS.sprintItem }
                >
                    <div className={ BacklogAndSprintCSS.sprintSummary }>
                        <div>
                            <button
                                id={ 'toggleOn' + sprint.sprintCode }
                                className={ BacklogAndSprintCSS.sprintSelectBtn }
                                style={{ display: 'block' }}
                                onClick={ () => setVisible(sprint.sprintCode) }
                                >
                            <i className="pi pi-chevron-right"/>
                            </button>
                            <button
                                id={ 'toggleOff' + sprint.sprintCode }
                                className={ BacklogAndSprintCSS.sprintSelectBtn }
                                style={{ display: 'none' }}
                                onClick={ () => setInvisible(sprint.sprintCode) }
                            >
                                <i className="pi pi-chevron-down"/>
                            </button>
                        </div>
                        <div>{ sprint.sprintName }</div>
                        <div>
                            { 
                                (sprint.sprintStartDate && sprint.sprintEndDate)
                                ? <label>{sprint.sprintStartDate.slice(0, 10)} ~ {sprint.sprintEndDate.slice(0, 10)}</label>
                                : <label className={ BacklogAndSprintCSS.fontColoring }>스프린트 기간 미지정</label>
                            }
                        </div>
                        <div>
                            <SprintEditModal sprint={ sprint }/>
                        </div>
                        <div  style={{ display: sprint.sprintProgressStatus === 'N'? 'block' : 'none' }}>
                            <SprintStartModal sprint={ sprint }/>
                        </div>
                        <div style={{ display: sprint.sprintProgressStatus === 'Y'? 'block' : 'none' }}>
                            <SprintEndModal sprint={ sprint }/>
                        </div>
                    </div>
                    <div 
                        id={ sprint.sprintCode }
                        className={ BacklogAndSprintCSS.taskItems }
                        style={{ display: 'none' }}    
                    >
                        <div className={ BacklogAndSprintCSS.sprintTarget }>
                            { sprint.sprintTarget === null || sprint.sprintTarget === '' 
                                ? '스프린트 목표가 없습니다.'
                                : sprint.sprintTarget }
                        </div>
                        <div id={ BacklogAndSprintCSS.divHeader }>
                            <div>구분</div>
                            <div>제목</div>
                            <div>진행상태</div>
                            <div>긴급도</div>
                            <div>담당자</div>
                            <div>자세히</div>
                        </div>
                            { 
                                sprint.tasks.length > 0
                                ? sprint.tasks.map(
                                    task => 
                                    <div className={ BacklogAndSprintCSS.backlogItem }>
                                        <div>{ task.issue === 1? '이슈' : '기본' }</div>
                                        <div>{ task.backlogTitle }</div>
                                        <div>{ task.progressStatus }</div>
                                        <div>{ task.urgency }</div>
                                        <div>{ task.memberName? task.memberName : '담당자 없음' }</div>
                                        <div 
                                            id={ BacklogAndSprintCSS.moreDetailsBtn } 
                                            onClick={ () => alert('뿅')}
                                        >
                                            자세히
                                        </div>
                                    </div>
                                ) 
                                : <div className={ BacklogAndSprintCSS.backlogItem }>등록된 일감이 없습니다.</div>
                            }    
                    </div>
                </div>
            )
        }</>
    );
}

export default SprintItem;