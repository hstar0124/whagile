import BacklogModalsCSS from './BacklogModals.module.css';

import { useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { decodeJwt } from '../../../utils/tokenUtils';
import { callPostSprintAPI } from '../../../apis/SprintsForBacklogAPICalls';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

function SprintCreationModal() {

    const dispatch = useDispatch();
    const sprintResult = useSelector(state => state.sprintForBacklogReducer);
    const { projectCode } = useParams();
    const loginUser = decodeJwt(window.localStorage.getItem('access_token'));


    /* 다이얼로그 표시 상태 */
    const [displayDialog, setDisplayDialog] = useState(false);
    const [position, setPosition] = useState('center');

    /* 스프린트 생성 데이터 임시 저장용 state */
    const [sprintName, setSprintName ] = useState('');
    const [sprintTarget, setSprintTarget ] = useState('');
    const [sprintStartDate, setSprintStartDate ] = useState('');
    const [sprintEndDate, setSprintEndDate ] = useState('');

    const onShow = () => {
        setDisplayDialog(true);
        setPosition('center');
    };

    const renderFooter = (displayDialog) => {
        return (
            <div>
                <Button 
                    id={ BacklogModalsCSS.createBtn }
                    label="만들기" 
                    onClick={ createNewSprint }
                />
                <Button 
                    id={ BacklogModalsCSS.cancelBtn }
                    label="취소" 
                    onClick={ onHide } 
                />
            </div>
        );
    }

    /* 스프린트 생성 API 요청 */
    const createNewSprint = () => {
        /* 필수입력사항 기입 여부 확인 */
        if(sprintName === '') {
            alert('필수 입력사항을 모두 입력해주세요.');

        } else {

            console.log('왔니?')
            const newSprint = {
                sprintName: sprintName,
                sprintTarget: sprintTarget,
                sprintStartDate: sprintStartDate? sprintStartDate.toISOString() : null,
                sprintEndDate: sprintEndDate? sprintEndDate.toISOString() : null,
                currentInfo: {
                    projectCode: projectCode,
                    backlogCreatorCode: loginUser.code
                }
            }
            // dispatch(callPostSprintAPI(newSprint))

            return new Promise(async (resolve, reject) => {
                console.log('와써?')
                await dispatch(callPostSprintAPI(newSprint));
                await window.location.replace(window.location.href);
            });
        }
    };

    const onHide = () => {
        setDisplayDialog(false);
        /* 다이얼로그 창이 닫힐 때 저장된 임시저장용 state를 초기화한다. */
        setSprintName('');
        setSprintTarget(''); 
        setSprintStartDate('');
        setSprintEndDate('');
    };

    return (

        <>
            <Button
                id={ BacklogModalsCSS.createNewSprintBtn }
                label='스프린트 생성'
                onClick={ onShow }
            />
            <Dialog
                id={ BacklogModalsCSS.sprintCreationDialog }
                header="백로그 생성" 
                visible={ displayDialog } 
                style={{ width: '30vw' }} 
                footer={ renderFooter(displayDialog) } 
                onHide={ onHide }
            >
                <div className="field">
                    <label className={ BacklogModalsCSS.inputTags }>제목*</label>
                    <InputText 
                        id={ BacklogModalsCSS.inputTitle } 
                        className="block"
                        value={ sprintName }
                        onChange={ (e) => setSprintName(e.target.value) }
                    />
                </div>
                <div>
                    <label className={ BacklogModalsCSS.inputTags }>스프린트 시작일</label>
                    <Calendar
                        dateFormat="yy-mm-dd" 
                        value={ sprintStartDate } 
                        onChange={ (e) => setSprintStartDate(e.value) }
                    />
                </div>
                <div>
                    <label className={ BacklogModalsCSS.inputTags }>스프린트 종료일</label>
                    <Calendar
                        dateFormat="yy-mm-dd" 
                        minDate={ sprintStartDate }
                        value={ sprintEndDate } 
                        onChange={ (e) => setSprintEndDate(e.value) }
                    />
                </div>
                <div>
                    <label className={ BacklogModalsCSS.inputTags }>스프린트 목표</label>
                    <InputTextarea 
                        id={ BacklogModalsCSS.inputTitle } 
                        className="block"
                        value={ sprintTarget }
                        onChange={ (e) => setSprintTarget(e.target.value) }
                    />
                </div>
                <div
                    style={ 
                        {
                            display: sprintName === ''? 'block' : 'none'
                        } 
                    }
                >
                    <small 
                        className="p-error block"
                    >
                        *은 필수 입력 사항입니다.
                    </small>
                </div>
            </Dialog>
        </>
    );
}

export default SprintCreationModal;