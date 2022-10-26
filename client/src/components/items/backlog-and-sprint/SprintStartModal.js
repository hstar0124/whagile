import BacklogModalsCSS from './BacklogModals.module.css';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { decodeJwt } from '../../../utils/tokenUtils';
import { callChangeSprintStatusAPI } from '../../../apis/SprintsForBacklogAPICalls';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

function SprintStartModal({ sprint }) {

    const dispatch = useDispatch();
    const sprints = useSelector(state => state.sprintsForBacklogReducer);
    const sprintInprogress = sprints.filter(sprint => sprint.sprintProgressStatus === 'Y');
    const { projectCode } = useParams();
    const loginUser = decodeJwt(window.localStorage.getItem('access_token'));

    /* 다이얼로그 표시 상태 */
    const [displayDialog, setDisplayDialog] = useState(false);
    const [position, setPosition] = useState('center');

    /* 모달창에 표시될 날짜 데이터 slice하기 */
    const [sprintStartDate, setSprintStartDate] = useState(sprint.sprintStartDate);
    const [sprintEndDate, setSprintEndDate] = useState(sprint.sprintEndDate);


    const onShow = () => {

        if(sprintInprogress.length > 0) {
            alert('진행 중인 스프린트가 있는 경우 새 스프린트를 시작할 수 없습니다.');
        } else {
            if(sprintStartDate === null || sprintEndDate === null) {
                alert('스프린트 기간을 지정해주세요.');
            } else {
                setSprintStartDate(sprintStartDate.slice(0, 10));
                setSprintEndDate(sprintEndDate.slice(0, 10));

                setDisplayDialog(true);
                setPosition('center');
            }
        }
    };

    const renderFooter = (displayDialog) => {
        return (
            <div>
                <Button 
                    id={ BacklogModalsCSS.startBtn }
                    label="시작" 
                    onClick={ confirmStart }
                />
                <Button 
                    id={ BacklogModalsCSS.cancelBtn }
                    label="취소" 
                    onClick={ onHide } 
                />
            </div>
        );
    }

    /* 스프린트 시작 API 요청 */
    const confirmStart = () => {
        
        return new Promise(async (resolve, reject) => {
            await dispatch(callChangeSprintStatusAPI({
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
                id={ BacklogModalsCSS.sprintStartBtn }
                label='스프린트 시작'
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
                    <label className={ BacklogModalsCSS.inputTags }>스프린트 기간</label>
                    <div id={ BacklogModalsCSS.infoBox }>
                        <label>시작일 </label><label>{ sprintStartDate }</label><br/>
                        <label>종료일 </label><label>{ sprintEndDate }</label><br/>
                    </div>
                </div>
                <br/>
                <div>
                    <label className={ BacklogModalsCSS.inputTags }>{ sprint.tasks.length }개의 일감을 스프린트에 포함합니다.</label>
                </div>
            </Dialog>
        </>
    );
}

export default SprintStartModal;