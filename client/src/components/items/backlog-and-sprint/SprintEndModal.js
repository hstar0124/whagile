import BacklogModalsCSS from './BacklogModals.module.css';

import { useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';

import { decodeJwt } from '../../../utils/tokenUtils';
import { callChangeSprintStatusAPI } from '../../../apis/SprintsForBacklogAPICalls';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

function SprintEndModal({ sprint }) {

    const dispatch = useDispatch();
    const { projectCode } = useParams();
    const loginUser = decodeJwt(window.localStorage.getItem('access_token'));

    /* 다이얼로그 표시 상태 */
    const [displayDialog, setDisplayDialog] = useState(false);
    const [position, setPosition] = useState('center');

    /* 완료된 일감, 미해결 일감 state */
    const [tasksComplete, setTasksComplete] = useState([]);
    const [tasksIncomplete, setTasksIncomplete] = useState([]);

    const onShow = () => {

        /* 완료된 일감, 미해결 일감 분류 */
        setTasksComplete(sprint.tasks.filter(task => task.progressStatus === '완료'));
        setTasksIncomplete(sprint.tasks.filter(task => task.progressStatus !== '완료'));

        setDisplayDialog(true);
        setPosition('center');
    };

    const renderFooter = (displayDialog) => {
        return (
            <div>
                <Button 
                    id={ BacklogModalsCSS.endBtn }
                    label="종료" 
                    onClick={ confirmEnd }
                />
                <Button 
                    id={ BacklogModalsCSS.cancelBtn }
                    label="취소" 
                    onClick={ onHide } 
                />
            </div>
        );
    }

    /* 스프린트 종료 API 요청 */
    const confirmEnd = () => {
        
        return new Promise(async (resolve, reject) => {
            await dispatch(callChangeSprintStatusAPI({
                sprintProgressStatus: sprint.sprintProgressStatus,
                sprintCode: sprint.sprintCode,
                currentInfo: {
                    sprintCode: sprint.sprintCode,
                    projectCode: projectCode,
                    memberCode: loginUser.code
                }
            }));
            await window.location.replace(window.location.href);
        });
    }

    const onHide = () => {
        setDisplayDialog(false);
    };

    return (
        <>
            <Button
                id={ BacklogModalsCSS.sprintEndBtn }
                label='스프린트 종료'
                onClick={ onShow }
            />
            <Dialog
                id={ BacklogModalsCSS.sprintCreationDialog }
                header={ sprint.sprintName } 
                visible={ displayDialog } 
                style={{ width: '30vw' }} 
                footer={ renderFooter(displayDialog) } 
                onHide={ onHide }
            >
                <br/>
                <div className='field'>
                    <label className={ BacklogModalsCSS.inputTags }>스프린트에 포함된 일감</label>
                    <div id={ BacklogModalsCSS.infoBox }>
                        <i className='pi pi-check'/><label>{ tasksComplete.length }개의 완료된 일감</label><br/>
                        <i className='pi pi-check'/><label>{ tasksIncomplete.length }개의 미해결 일감</label><br/>
                    </div>
                </div>
                <br/>
                <div>
                    <label className={ BacklogModalsCSS.inputTags }>미해결 일감을 백로그로 이동합니다.</label>
                    <div id={ BacklogModalsCSS.infoBox }>
                        { tasksIncomplete.map(task => <li>{ task.backlogTitle}</li>) }
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default SprintEndModal;