import PageTitle from '../../components/items/PageTitle';
import MainHeader from '../../components/commons/MainHeader';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { callGetProjectsAPI } from '../../apis/ProjectAPICalls';
import { callDeleteProjectAPI} from  '../../apis/ProjectAPICalls';
import { decodeJwt } from '../../utils/tokenUtils';
import { useNavigate } from "react-router-dom"; 

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

function List() {

    let emptyProject = {
        projectCode: null,
        projectCompletedTask: 0,
        projectDeletedStatus: '',
        projectDescription: '',
        projectName: '',
        projectOwner: '',
        projectTotalTask: 0,
        remainedTask: ''
    };
    
    const decoded = decodeJwt(window.localStorage.getItem("access_token"));
    const [ searchValue, setSearchValue ] = useState('');
    const [rowProject, setRowProject] = useState(emptyProject);
    const [deleteProjectDialog, setDeleteProjectDialog] = useState(false);
    const projects = useSelector(state => state.projectsReducer);
    const dispatch = useDispatch();
    const toast = useRef(null);
    const navigate = useNavigate();
    const [selectedProject, setSelectedProject] = useState(null);
    const op = useRef(null);

    useEffect(
        () => {
            dispatch(callGetProjectsAPI({   
                'loginMember': (decoded !== 'undefined')? decoded.code: '',
                'searchValue': searchValue
        }));
        },
        []
    );

    useEffect(
        () => {
            dispatch(callGetProjectsAPI({
                 
                    'loginMember': (decoded !== 'undefined')? decoded.code: '',
                    'searchValue': searchValue

            }));
        },
        [searchValue]
    );

    const onRowSelect = (event) => {
        // toast.current.show({ severity: 'info', summary: 'Product Selected', detail: `Name: ${event.projects.peojectCode}`, life: 3000 });
        navigate(`/project/${event.data.projectCode}/dashboard`);
    }

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
    const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;
    
    const onChangeHandler = (e) => {

        setSearchValue(e.target.value);

    };

    const actionChoiceHandler = (rowData) => {
        setRowProject(rowData);
    }

    const actionNavigate = () => {
        console.log(rowProject);
        navigate(`/project/${ rowProject.projectCode }/management/information`);
    }

    const confirmDeleteProject = () => {        
        setDeleteProjectDialog(true);
    }

    const statusBodyTemplate = (rowData) => {
        // return <span className={`pi pi-ellipsis-h`}></span>;
        return (
            <>
                <Button
                    type="button" 
                    icon="pi pi-ellipsis-h"
                    // onClick={(e) => op.current.toggle(e)}
                    // onClick={ () => { actionChoiceHandler(rowData)}}
                    onClick={ (e) => { actionChoiceHandler(rowData); op.current.toggle(e);}}       
                />
                <OverlayPanel ref={op} id="overlay_panel" style={{width: '200px'}} className="overlaypanel">              
                    <Button label="프로젝트 수정" className="p-button-text p-button-plain" icon="pi pi-pencil" onClick={ () => { actionNavigate()}} />               
                    <Button label="프로젝트 삭제" className="p-button-text p-button-plain" icon="pi pi-trash" onClick={() => confirmDeleteProject()}/>             
                </OverlayPanel>
            </>
        );
    }

    const hideDeleteProjectDialog = () => {
        setDeleteProjectDialog(false);
    }

    function removeProject() {
        dispatch(callDeleteProjectAPI({
            'projectCode': rowProject.projectCode,
            'loginMember': (decoded !== 'undefined')? decoded.code: '',
            'searchValue': searchValue
        }));
    }

    const deleteMember = () => {
        // let _members = members.filter(val => val.memberCode !== member.memberCode);
        // setMembers(_members);
        setDeleteProjectDialog(false);
        // setMember(emptyMember);
        removeProject(rowProject);
        toast.current.show({ severity: 'success', summary: '프로젝트 제거', detail: '해당 프로젝트를 제거했습니다.', life: 3000 });
    }

    const deleteProjectDialogFooter = (
        <>
            <Button label="확인" icon="pi pi-check" className="p-button-text" onClick={deleteMember} />
            <Button label="취소" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProjectDialog} />
        </>
    );

    const footer = `총  ${projects ? projects.length : 0}개의 프로젝트가 있습니다.`;

    return (
        <>
            <Toast ref={toast}/>
            <MainHeader />
            <main style={{ padding: '20px'}}>
                <PageTitle icon={ <i className="pi pi-fw pi-list"></i>} text="프로젝트 목록"/>
                <div>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" className="p-inputtext-lg block" value={ searchValue } onChange={ onChangeHandler } placeholder="Search" />
                    </span>
                    <span>
                        <Button label="프로젝트 생성" icon="pi pi-plus" onClick={ () => { navigate(`/projects/regist`) }} />
                    </span>
                </div>
                <div>
                    <div className="card">
                        <DataTable
                            value={projects} 
                            paginator responsiveLayout="scroll"
                            selectionMode="single"
                            selection={selectedProject} 
                            dataKey="projectCode"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" 
                            rows={10}
                            rowsPerPageOptions={[10,20,50]}
                            paginatorLeft={paginatorLeft} 
                            paginatorRight={paginatorRight}
                            onSelectionChange={e => setSelectedProject(e.value)}
                            onRowSelect={onRowSelect}
                            footer={footer}
                        >
                            <Column field="projectCode" header="번호" hidden ></Column>
                            <Column field="projectName" header="이름" style={{ width: '25%' }} sortable></Column>
                            <Column field="projectDescription" header="설명" style={{ width: '35%' }}></Column>
                            <Column field="remainedTask" header="내 일감"></Column>
                            <Column field="projectOwner" header="프로젝트 소유자" sortable></Column>
                            <Column columnKey="projectCode" body={statusBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                        </DataTable>
                    </div>
                </div>
            </main>
            <Dialog visible={deleteProjectDialog} style={{ width: '450px' }} header="프로젝트 제거" modal footer={deleteProjectDialogFooter} onHide={hideDeleteProjectDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {rowProject && <span><b>      {rowProject.projectName}</b> 프로젝트를 제거하시겠습니까?</span>}
                </div>
            </Dialog>
        </>
    );
}

export default List;