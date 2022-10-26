import PageTitle from '../../../components/items/PageTitle';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { callGetProjectMemberAPI, callDeleteProjectMemberAPI, callPutModifyAuthorityProjectMemberAPI } from '../../../apis/ProjectAPICalls';
import InvitationExecutionModal from '../../../components/items/projects/InvitationExecutionModal';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';

function TeamMateList() {

    let emptyMember = {
        memberCode: null,
        memberId: null,
        memberName: null,
        memberEmail: null,
        authorityCode: null,
        authorityName: null
    };

    const [emails, setEmails ] = useState([]);
    const [authority, setAuthority] = useState('');
    const [displayBasic, setDisplayBasic] = useState(false);
    const [displayPosition, setDisplayPosition] = useState(false);
    const [position, setPosition] = useState('center');
    const [authorityDialog, setAuthorityDialog] = useState(false);
    const dispatch = useDispatch();
    const { projectCode } = useParams();
    const toast = useRef(null);
    const memberList = useSelector(state => state.projectMemberReducer);
    const [currentPage, setCurrentPage] = useState(1);
    const [members, setMembers] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [deleteMemberDialog, setDeleteMemberDialog] = useState(false);
    const [ member, setMember ] = useState(emptyMember);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [memberDialog, setMemberDialog] = useState(false);
    
    const dialogFuncMap = {
        'displayBasic': setDisplayBasic,
        'displayPosition': setDisplayPosition,
    }

    useEffect(
        () => {
            dispatch(callGetProjectMemberAPI({
                'projectCode': projectCode
            }));
        },
        []
    );

    const hideDialog = () => {
        setSubmitted(false);
        setAuthorityDialog(false);
    }

    function removeMember(rowData) {
        dispatch(callDeleteProjectMemberAPI({
            'projectCode': projectCode,
            'memberCode': rowData.memberCode
        }));
    }

    const openNew = () => {
        setMember(emptyMember);
        setSubmitted(false);
        setMemberDialog(true);
    }

    const hideDeleteMemberDialog = () => {
        setDeleteMemberDialog(false);
    }

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
    const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;

    const deleteMember = () => {

        setDeleteMemberDialog(false);
        removeMember(member);
        toast.current.show({ severity: 'success', summary: '팀원 제외', detail: '해당 팀원을 제외했습니다.', life: 3000 });
    };

    const saveAuthority = () => {
        setSubmitted(true);

        dispatch(callPutModifyAuthorityProjectMemberAPI({
            'projectCode' : projectCode,
            'memberCode' : member.memberCode,
            'authorityCode' : member.authorityCode
        }));

        setAuthorityDialog(false);
        toast.current.show({ severity: 'success', summary: '권한 수정 완료', detail: '해당 회원의 권한을 수정했습니다.', life: 3000 });
    }

    const authorityDialogFooter = (
        <>
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveAuthority} />
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        </>
    );
    
    const deleteMemberDialogFooter = (
        <>
            <Button label="확인" icon="pi pi-check" className="p-button-text" onClick={deleteMember} />
            <Button label="취소" icon="pi pi-times" className="p-button-text" onClick={hideDeleteMemberDialog} />
        </>
    );

    const onCategoryChange = (e) => {
        let _member = {...member};
        _member['authorityCode'] = e.value;
        console.log('_member', _member);
        setMember(_member);
    }

    const editProjectMember = (member) => {

        if(member.authorityName === 'PM') {
            return toast.current.show({ severity: 'error', summary: '수정 불가', detail: 'PM은 수정할 수 없습니다.', life: 3000 });
        }

        setMember({...member});
        setAuthorityDialog(true);
    }


    const confirmDeleteProjectMember = (rowData) => {

        if(rowData.authorityName === 'PM') {
            return toast.current.show({ severity: 'error', summary: '제거 불가', detail: 'PM은 제거할 수 없습니다.', life: 3000 });
        }
        
        setMember(rowData);
        setDeleteMemberDialog(true);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProjectMember(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteProjectMember(rowData)} />
            </>
        );
    }

    const header = (
        <div className="table-header">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const showModal = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }
    

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button label="팀원 초대"  icon="pi pi-user-plus" className="p-button-success mr-2" onClick={ () => showModal('displayBasic')}/>
            </>
        )
    }

    return (
        <>  
            <PageTitle 
                icon={<i className="pi pi-fw pi-users"></i>}
                text="프로젝트 팀원목록"
            />

            <Toast ref={toast} />
            <div className="card" style={{ width: 70 + '%' }}>
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                <DataTable
                    globalFilter={globalFilter}
                    value={memberList} 
                    paginator responsiveLayout="scroll"
                    selection={selectedMember} 
                    dataKey="memberCode"
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" 
                    rows={10}
                    rowsPerPageOptions={[10,20,50]}
                    paginatorLeft={paginatorLeft}
                    paginatorRight={paginatorRight}
                    onSelectionChange={e => setSelectedMember(e.value)}
                    header={header}
                >
                    <Column field="memberCode" header="번호" hidden ></Column>
                    <Column field="memberId" header="아이디" style={{ width: '25%' }} align="center" sortable></Column>
                    <Column field="memberName" header="이름" style={{ width: '15%' }} align="center" sortable></Column>
                    <Column field="memberEmail" header="이메일" align="center" sortable></Column>
                    <Column field="authorityName" header="권한" align="center" sortable filter></Column>
                    <Column columnKey="memberCode" body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={deleteMemberDialog} style={{ width: '450px' }} header="팀원 제외" modal footer={deleteMemberDialogFooter} onHide={hideDeleteMemberDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {member && <span><b>      {member.memberName}</b> 팀원을 제외하시겠습니까?</span>}
                </div>
            </Dialog>

            <InvitationExecutionModal 
                displayBasic = { displayBasic }
                setDisplayBasic = { setDisplayBasic }
                emails = { emails }
                setEmails = { setEmails }
                projectCode = { projectCode }
            />

            <Dialog visible={authorityDialog} style={{ width: '450px' }} header="권한 수정" modal className="p-fluid" footer={authorityDialogFooter} onHide={hideDialog}>
     
                <div className="field">
                    <label className="mb-3">권한</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="2" onChange={onCategoryChange} checked={member.authorityCode === 2} />
                            <label htmlFor="category1">팀원</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="3" onChange={onCategoryChange} checked={member.authorityCode === 3} />
                            <label htmlFor="category2">게스트</label>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default TeamMateList;