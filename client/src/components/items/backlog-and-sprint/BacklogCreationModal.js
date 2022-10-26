import BacklogModalsCSS from './BacklogModals.module.css';

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { callPostBacklogAPI } from '../../../apis/BacklogAPICalls';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

function BacklogCreationModal() {
    
    const { projectCode } = useParams();
    const dispatch = useDispatch();
    const backlogDetails = useSelector(state => state.backlogDetailReducer);

    /* state 정의 */
    const [displayDialog, setDisplayDialog] = useState(false);
    const [position, setPosition] = useState('center');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedProgressStatus, setSelectedProgressStatus] = useState(null);
    const [selectedUrgency, setSelectedUrgency] = useState(null);
    const [selectedIssue, setSelectedIssue] = useState(null);

    const [successfullyRegistered, setsuccessfullyRegistered] = useState(false);

    /* dropdown 옵션 정의 */
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

    const newBacklog = {
        title: title,
        description: description,
        progressStatus: selectedProgressStatus,
        urgency: selectedUrgency,
        issue: selectedIssue,
        projectCode: projectCode
    };

    /* 다이얼로그 표시 */
    const onClick = (displayDialog, position) => {
        setDisplayDialog(true);

        if (position) {
            setPosition(position);
        }
    }

    /* 다이얼로그 닫기 */
    const onHide = (displayDialog) => {
       setDisplayDialog(false);
       setsuccessfullyRegistered(false);
       /* 다이얼로그 창이 닫힐 때 저장된 input state를 초기화한다. */
       setTitle('');
       setDescription('');
       setSelectedProgressStatus(null);
       setSelectedUrgency(null);
       setSelectedIssue(null);
    }

    /* 백로그 생성 API 요청 */
    const registNewBacklog = () => {
        /* 필수입력사항 기입 여부 확인 */
        if(title == '' || selectedUrgency == null || selectedIssue == null) {
            alert('필수 입력사항을 모두 입력해주세요.');

        } else {
            return new Promise(async (resolve, reject) => {
                await dispatch(callPostBacklogAPI(newBacklog));
                await window.location.replace(window.location.href);
            });
        }
    };

    const renderFooter = (displayDialog) => {
        return (
            <div>
                <Button 
                    id={ BacklogModalsCSS.createBtn }
                    label="만들기" 
                    onClick={ () => registNewBacklog(newBacklog) }
                />
                <Button 
                    id={ BacklogModalsCSS.cancelBtn }
                    label="취소" 
                    onClick={ () => onHide(displayDialog) } 
                />
            </div>
        );
    }
       
    return (
        <>
            <Button 
                id={ BacklogModalsCSS.backlogCreationBtn } 
                label="백로그 추가하기" 
                icon="pi pi-plus" 
                onClick={ () => onClick(displayDialog) } 
            />
            <Dialog 
                id={ BacklogModalsCSS.backlogCreationDialog }
                header="백로그 생성" 
                visible={ displayDialog } 
                style={{ width: '30vw' }} 
                footer={ renderFooter(displayDialog) } 
                onHide={ () => onHide(displayDialog) }
            >
                <div className="field">
                    <label className="block">제목*</label><br/>
                    <InputText 
                        id={ BacklogModalsCSS.inputTitle } 
                        className="block"
                        value={ title }
                        onChange={ (e) => setTitle(e.target.value) }
                    />
                    <br/><br/>
                </div>
                <div id={ BacklogModalsCSS.dropdownArea }>
                    <Dropdown 
                        value={ selectedUrgency } 
                        options={ urgencyOptions } 
                        onChange={ (e) => setSelectedUrgency(e.target.value) }  
                        optionLabel="name" 
                        optionValue="value" 
                        placeholder="긴급도*" 
                    />
                    <Dropdown 
                        value={ selectedIssue } 
                        options={ issueCheck } 
                        optionLabel="name" 
                        optionValue="value" 
                        onChange={ (e) => setSelectedIssue(e.target.value) } 
                        placeholder="분류*" 
                    />
                    <br/><br/>
                </div>
                <br/>
                <label>설명</label><br/>
                <InputTextarea 
                    id={ BacklogModalsCSS.inputDescription }
                    value={ description }
                    onChange={ (e) => setDescription(e.target.value) } 
                    rows={ 5 } 
                />
                <br/><br/>
                <div
                    style={ 
                        {
                            display: title == '' || selectedIssue == null || selectedUrgency == null? 'block' : 'none'
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

export default BacklogCreationModal;