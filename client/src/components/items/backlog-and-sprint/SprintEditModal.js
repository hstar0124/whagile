import BacklogModalsCSS from './BacklogModals.module.css';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { decodeJwt } from '../../../utils/tokenUtils';
import { callPutSprintAPI, callDeleteSprintAPI } from '../../../apis/SprintsForBacklogAPICalls';

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

function SprintEditModal({ sprint }) {

    const dispatch = useDispatch();
    const { projectCode } = useParams();
    const loginUser = decodeJwt(window.localStorage.getItem('access_token'));

    /* 다이얼로그 표시 상태 */
    const [displayDialog, setDisplayDialog] = useState(false);
    const [position, setPosition] = useState('center');
    const [visible, setVisible] = useState(false);

    /* 모달창에 표시될 데이터 */
    const [sprintName, setSprintName] = useState(sprint.sprintName);
    const [sprintTarget, setSprintTarget] = useState(sprint.sprintTarget);
    const [sprintStartDate, setSprintStartDate] = useState(sprint.sprintStartDate);
    const [sprintEndDate, setSprintEndDate] = useState(sprint.sprintEndDate);
    
    const renderFooter = (displayDialog) => {
        return (
            <div id={ BacklogModalsCSS.modalFooter }>
                <Button 
                    id={ BacklogModalsCSS.saveBtn }
                    label="저장" 
                    onClick={ 
                        () => {
                            if (
                                sprint.sprintName === sprintName &&
                                sprint.sprintTarget === sprintTarget &&
                                sprint.sprintStartDate === sprintStartDate &&
                                sprint.sprintEndDate === sprintEndDate
                                ) {
                                alert('변경된 정보가 없습니다.');
                            } else {
                                confirmEdit();
                            }
                        } 
                    }
                    />
                <Button 
                    id={ BacklogModalsCSS.cancelBtn }
                    label="취소" 
                    onClick={ onHide } 
                    />
                <Button 
                    id={ BacklogModalsCSS.removeBtn }
                    label="스프린트 삭제" 
                    onClick={ removeSprint } 
                />
            </div>
        );
    }

    /* 다이얼로그 표시 */
    const onShow = () => {
        setDisplayDialog(true);
        setPosition('center');
    }

    /* 스프린트 수정 API 호출 */
    const confirmEdit = () => {
        return new Promise(async (resolve, reject) => {
            await dispatch(callPutSprintAPI({
                sprintName: sprintName,
                sprintTarget: sprintTarget,
                sprintStartDate: sprintStartDate,
                sprintEndDate: sprintEndDate,
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
    
    /* 스프린트 삭제 API 호출 */
    const removeSprint = () => {
        setVisible(true);
    };

    const accept = async () => {
        await dispatch(callDeleteSprintAPI({
            sprintCode: sprint.sprintCode,
            currentInfo: {
                sprintCode: sprint.sprintCode,
                projectCode: projectCode,
                memberCode: loginUser.code
            }
        }));
        await onHide();
        await window.location.replace(window.location.href);
    }

    const reject = async () => { setVisible(false) }

    /* 다이얼로그 닫기 */
    const onHide = () => {
        setDisplayDialog(false);

        setSprintName(sprint.sprintName);
        setSprintTarget(sprint.sprintTarget);
        setSprintStartDate(sprint.sprintStartDate);
        setSprintEndDate(sprint.sprintEndDate);
    };

    return (
        <>
            <Button
                id={ BacklogModalsCSS.editSprintBtn }
                label='편집'
                icon='pi pi-fw pi-pencil'
                onClick={ onShow }
            />
            <Dialog
                id={ BacklogModalsCSS.sprintCreationDialog }
                header={ '스프린트 편집: ' + sprint.sprintName }
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
                        showTime hourFormat="24" 
                        showMillisec
                        value={ new Date(sprintStartDate) } 
                        onChange={ (e) => setSprintStartDate(e.value) }
                        />
                </div>
                <div>
                    <label className={ BacklogModalsCSS.inputTags }>스프린트 종료일</label>
                    <Calendar
                        dateFormat="yy-mm-dd"
                        showTime hourFormat="24" 
                        showMillisec
                        value={ new Date(sprintEndDate) } 
                        minDate={ new Date(sprint.sprintStartDate) }
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
                        placeholder={ 
                            sprintTarget === '' || sprintTarget === null? 
                            '스프린트 목표가 없습니다.' : ''
                        }
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
            <ConfirmDialog
                visible={visible} 
                onHide={() => setVisible(false)} 
                header='스프린트를 삭제하시겠습니까?' 
                message='스프린트 삭제 시 포함된 일감들은 백로그로 이동합니다.'
                icon='pi pi-info-circle' 
                acceptClassName='p-button-danger'
                accept={async () => await accept()} 
                reject={async () => await reject()} 
            />
        </>
    );
}

export default SprintEditModal;