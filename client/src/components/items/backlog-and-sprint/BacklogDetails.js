import BacklogAndSprintCSS from '../backlog-and-sprint/BacklogAndSprint.module.css';

import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router';

import { callPutBacklogAPI, callDeleteBacklogAPI } from '../../../apis/BacklogAPICalls';
import { callCleanBacklogComments } from '../../../apis/BacklogCommentAPICalls';
import { callGetSprintsAPI } from '../../../apis/SprintsForBacklogAPICalls';

import BacklogComment from './BacklogComment';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Sidebar} from 'primereact/sidebar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

function BacklogDetails({visibleRight, setVisibleRight}) {

    const dispatch = useDispatch();
    const backlogDetails = useSelector(state => state.backlogDetailReducer);
    const sprints = useSelector(state => state.sprintsForBacklogReducer);

    const { projectCode } = useParams();

    /* 백로그 편집 상태값 저장 */
    const [editable, setEditable] = useState(false);

    /* 수정된 backlog states */
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [sprint, setSprint] = useState(null);
    const [issue, setIssue] = useState(null);
    const [urgency, setUrgency] = useState(null);

    const modifiedBacklog = {
        backlogCode: 0,
        projectCode: 0,
        changedItem: {
            title: title,
            description: description,
            sprint: sprint,
            issue: issue,
            urgency: urgency
        }
    };

    /* dropdown options */
    const urgencyOptions = [
        { name: '낮음', value: '낮음' },
        { name: '보통', value: '보통' },
        { name: '긴급', value: '긴급' }
    ];

    const issueCheck = [
        { name: '기본', value: 0 },
        { name: '이슈', value: 1 }
    ];

    const sprintOptions = [];
    for(let i = 0; i < sprints.length; i++) {
        sprintOptions.push({ name: sprints[i].sprintName, value: sprints[i].sprintCode });
    }

    useEffect(
        () => {
            if(backlogDetails.length > 0 && typeof(backlogDetails) === 'string') {
                alert(backlogDetails);
            }
            setEditable(false)
        },
        [backlogDetails]
    );

    useEffect(
        () => {
            dispatch(callGetSprintsAPI({
                projectCode: projectCode
            }));
        },
        []
    );

    /* 백로그 수정 요청 */
    const modifyBacklog = (backlogCode, projectCode) => {
        
        modifiedBacklog.backlogCode = backlogCode;
        modifiedBacklog.projectCode = projectCode;
        console.log('얌 !!!! ', modifiedBacklog);

        const origin = [];
        return new Promise(async (resolve, reject) => {
            await dispatch(callPutBacklogAPI(modifiedBacklog));
            await closeSidebar();
            await window.location.replace(window.location.href);
        });
    };

    const toast = useRef(null);

    const accept = async (backlogCode, projectCode) => {
        await dispatch(callDeleteBacklogAPI(backlogCode, projectCode));
        await closeSidebar();
        await window.location.replace(window.location.href);
    }

    const reject = async () => {
        await toast.current.show({ severity: 'warn', summary: 'Rejected', detail: '백로그가 삭제되지 않았습니다.', life: 3000 });
    }
    
    /* 백로그 삭제 요청 */
    const removeBacklog = async (backlogCode, projectCode) => {
        confirmDialog({
            message: '삭제 시 복구할 수 없습니다.',
            header: '백로그를 삭제하시겠습니까?',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: async () => await accept(backlogCode, projectCode),
            reject: async () => await reject()
        });
    };

    /* 편집 영역 토글 */
    /* style 캐슁 */
    const toggleOn = useMemo(
        () => {
            return {
                display: editable? 'block' : 'none'
            }
        },
        [editable]
    );
        
    const toggleOff = useMemo(
        () => {
            return {
                display: editable === false? 'block' : 'none'
            }
        }, 
        [editable]
    );
    
    /* 편집가능여부 상태값이 바뀔 때마다 컴포넌트를 업데이트한다 */
    const changeEditableState = useCallback(
        () => {
            setEditable(!editable);
            reset();
        },
        [editable]
    );

    /* 상세조회 모달창 닫기 */
    const closeSidebar = () => {
        setVisibleRight(false);
        setEditable(false);
        reset();
    };
 
    /* 수정을 위한 임시 상태값 초기화 */
    const reset = () => {
        setTitle(null);
        setDescription(null);
        setSprint(null);
        setIssue(null);
        setUrgency(null);
        dispatch(callCleanBacklogComments());
        };

    return (
        <Sidebar 
            id={ BacklogAndSprintCSS.backlogDetail }
            visible={ visibleRight } 
            position="right" 
            onHide={ () => closeSidebar() }
        >
            <div>
                { backlogDetails.length === 0 || backlogDetails[0].deletedYN === 'Y'?
                    '상세 내용이 없습니다.' :
                    <>
                    <Toast ref={ toast }/>
                    <ConfirmDialog/>
                    <Button 
                        id={ BacklogAndSprintCSS.moreBtn }
                        icon="pi pi-trash"
                        className="mr-2"
                        onClick={ () => removeBacklog(backlogDetails[0].backlogCode, backlogDetails[0].projectCode) }
                    />
                    <Button 
                        id={ BacklogAndSprintCSS.moreBtn }
                        icon="pi pi-pencil"
                        className="mr-2"
                        onClick={ changeEditableState }
                        style={ toggleOff }
                    /><br/>
                    <h3
                        id={ BacklogAndSprintCSS.backlogTitle }
                        style={ toggleOff }
                    >
                        { backlogDetails[0].title }
                    </h3>
                    <h6
                        className={ BacklogAndSprintCSS.fontColoring }
                        style={ toggleOn }
                    >
                        백로그 제목
                    </h6>
                    <InputText 
                        id={ BacklogAndSprintCSS.inputTitle }
                        value={ title }
                        onChange={ (e) => setTitle(e.target.value) }
                        style={ toggleOn }
                        placeholder={ backlogDetails[0].title }
                    />
                    <h6 className={ BacklogAndSprintCSS.fontColoring }>설명</h6>
                    <span
                        style={ toggleOff }
                    >
                        { 
                            backlogDetails[0].description !== '' && backlogDetails[0].description !== null? 
                            backlogDetails[0].description : '백로그 설명이 없습니다.' 
                        }
                    </span>
                    <InputTextarea 
                        id={ BacklogAndSprintCSS.inputComment }
                        value={ description } 
                        placeholder={ backlogDetails[0].description } 
                        onChange={ (e) => setDescription(e.target.value) } 
                        style={ toggleOn }
                        rows={ 3 }
                    />
                    <h6 className={ BacklogAndSprintCSS.fontColoring }>세부정보</h6>
                    <div id={ BacklogAndSprintCSS.detailDiv }>
                        <h6>구분</h6>
                        <div>
                            <span 
                                id={ BacklogAndSprintCSS.editableArea }
                                style={ toggleOff }
                            >
                                { backlogDetails[0].issue === 1? '이슈' : '기본' }
                            </span>
                            <div
                                style={ toggleOn } 
                            >
                                <Dropdown 
                                    id={ BacklogAndSprintCSS.issueOption }
                                    value={ issue } 
                                    options={ issueCheck } 
                                    optionLabel="name" 
                                    optionValue="value" 
                                    onChange={ (e) => {setIssue(e.target.value); console.log(e.target.value)} } 
                                    placeholder={ backlogDetails[0].issue === 1? '이슈' : '기본' }
                                />
                            </div>
                        </div>
                        <h6 className={ BacklogAndSprintCSS.fontColoring }>상위 스프린트</h6>
                        <div>
                            <label 
                                id={ BacklogAndSprintCSS.editableArea }
                                style={ toggleOff }
                            >
                                { backlogDetails[0].sprintCode !== 0? backlogDetails[0].sprintName : '미지정' }
                            </label>
                            <div
                                style={ toggleOn }
                                >
                                <Dropdown 
                                    id={ BacklogAndSprintCSS.sprintOption }
                                    value={ sprint } 
                                    options={ sprintOptions } 
                                    optionLabel="name" 
                                    optionValue="value" 
                                    onChange={ (e) => setSprint(e.target.value) } 
                                    placeholder={ backlogDetails[0].sprintCode !== 0? backlogDetails[0].sprintName : '미지정' } 
                                />
                            </div>
                        </div>
                        <h6>진행 상태</h6>
                        <div>
                            <label
                                style={ toggleOff }
                                id={ BacklogAndSprintCSS.editableArea }
                                >
                                { backlogDetails[0].progressStatus }
                            </label>
                            <label 
                                style={ toggleOn }
                                className={ BacklogAndSprintCSS.smallText }
                            >
                                백로그는 진행 상태를 변경할 수 없습니다.
                            </label>
                        </div>
                        <h6>긴급도</h6>
                        <div
                            style={ toggleOff }
                        >
                            <label
                                id={ BacklogAndSprintCSS.editableArea }
                            >
                                { backlogDetails[0].urgency }
                            </label>
                        </div>
                        <div 
                            id={ BacklogAndSprintCSS.editableArea }
                            style={ toggleOn }
                        >
                            <Dropdown 
                                id={ BacklogAndSprintCSS.urgencyOption }
                                value={ urgency } 
                                options={ urgencyOptions } 
                                onChange={ (e) => setUrgency(e.target.value) }  
                                optionLabel="name" 
                                optionValue="value" 
                                placeholder={ backlogDetails[0].urgency } 
                            /> 
                        </div>
                        <h6>담당자</h6>
                        <div>
                            <label
                                id={ BacklogAndSprintCSS.editableArea } 
                                style={ toggleOff }
                            >
                                { backlogDetails[0].chargerCode !== 0? backlogDetails[0].chargerName : '담당자 없음'}
                            </label>
                            <label
                                className={ BacklogAndSprintCSS.smallText }
                                style={ toggleOn }
                            >
                                백로그는 담당자를 지정할 수 없습니다.
                            </label>
                        </div>
                    </div>
                    <button
                        id={ BacklogAndSprintCSS.editCancelBtn }
                        style={ toggleOn }
                        onClick={ changeEditableState }
                    >
                        취소
                    </button> 
                    <button 
                        id={ BacklogAndSprintCSS.editConfirmBtn }
                        style={ toggleOn }
                        onClick={ () => modifyBacklog(backlogDetails[0].backlogCode, backlogDetails[0].projectCode) }
                        disabled={ 
                            (title === null || title === '') && 
                            (description === null || description === '') && 
                            (sprint === null || sprint === 0) &&
                            (urgency === null) && 
                            (issue === null)
                            ? true 
                            : false 
                        }
                        >
                        적용
                    </button>  
                    <div style={ toggleOff }>
                        <br/>
                        <h6 className={ BacklogAndSprintCSS.fontColoring }>댓글</h6>
                        <BacklogComment
                            backlogCode = { backlogDetails[0].backlogCode }
                            projectCode = { backlogDetails[0].projectCode }
                        />
                    </div>
                </>
            }
            </div>
        </Sidebar>
    );
}

export default BacklogDetails;