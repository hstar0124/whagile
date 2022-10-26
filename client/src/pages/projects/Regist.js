import PageTitle from '../../components/items/PageTitle';
import MainHeader from '../../components/commons/MainHeader';
import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { callPostProjectAPI } from '../../apis/ProjectAPICalls';
import InvitationModal from '../../components/items/projects/InvitationModal';
import { useForm, Controller, FieldError } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

function Regist() {

    let emptyEmails = [];
    const [projectName, setProjectName ] = useState('');
    const [projectDescription, setProjectDescription ] = useState('');
    const [emails, setEmails ] = useState([]);

    const [displayBasic, setDisplayBasic] = useState(false);
    const [displayPosition, setDisplayPosition] = useState(false);
    const [position, setPosition] = useState('center');
    const toast = useRef(null);

    const dialogFuncMap = {
        'displayBasic': setDisplayBasic,
        'displayPosition': setDisplayPosition
    }

    const defaultValues = {
        projectName : projectName,
        projectDescription : projectDescription
    };

    const { control, formState: { errors }, handleSubmit } = useForm({ defaultValues });

    const getFormErrorMessage = (name) => {
        console.log('name',name);
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const showModal = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }

    const submitHandler = async (data) => {
        console.log(data);
        await setProjectDescription(data.projectDescription);
        await setProjectName(data.projectName);
        await confirmDialog({
            message: '정말 프로젝트 생성을 하시겠습니까?',
            header: '프로젝트 생성',
            icon: 'pi pi-exclamation-triangle',
            accept: () => acceptFunc(),
            reject: () => toast.current.show({ severity: 'warn', summary: '취소', detail: '취소했습니다.', life: 3000 })
        });
    }

    const acceptFunc = async () => { 
        await dispatch(callPostProjectAPI(projectName, projectDescription, emails));
        setEmails(emptyEmails);
        setProjectName('');
        setProjectDescription('');
        await toast.current.show({ severity: 'info', summary: 'Confirmed', detail: '프로젝트 생성을 완료했습니다.', life: 3000 });
    };

    return(
        <>
            <Toast ref={toast} />
            <MainHeader />
            <PageTitle icon={ <i className="pi pi-fw pi-plus"></i>} text="프로젝트 생성" style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}/>
            <main style={{ width: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center'  }}>
                <div className="card">
                    <form 
                        style={{display: 'flex', flexDirection: 'column' }}
                        onSubmit={handleSubmit(submitHandler)}
                        className="p-fluid"
                    >
                        <div className="p-fluid grid">
                            <div className="field col-12 md:col-4">
                                <label htmlFor="projectName">프로젝트 이름</label>
                                <Controller 
                                    name="projectName" 
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <InputText 
                                            id={field.name} 
                                            {...field}
                                            ref={handleSubmit}
                                            value={ projectName }
                                            onChange={ (e) => setProjectName(e.target.value)}
                                            autoComplete="off" 
                                            autoFocus 
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                            required 
                                        />
                                    )} 
                                />
                            </div>
                            <div className="field col-12 md:col-4">
                                <label htmlFor="inputtext">프로젝트 설명</label>
                                <Controller 
                                    name="projectDescription" 
                                    control={control} 
                                    render={({ field, fieldState }) => (
                                        <InputText 
                                            id={field.name} 
                                            {...field}
                                            ref={handleSubmit}
                                            onChange={ (e) => setProjectDescription(e.target.value)}
                                            value={ projectDescription }
                                            autoComplete="off" 
                                            autoFocus 
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                            required 
                                        />
                                    )}
                                 />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignContent: 'center', flexDirection: 'row' }}>
                            <Button 
                            type="button"
                            icon="pi pi-user-plus" 
                            label="팀원 초대" 
                            className="p-button-lg m-2 bg-green-100"
                            onClick={ () => showModal('displayBasic')}
                            />
                        </div>
                        <div style={{ display: 'flex', alignContent: 'center', flexDirection: 'row' }}>
                            <Button 
                                type="submit"
                                icon="pi pi-check"
                                label="등록" 
                                className="p-button-lg m-2"
                            />
                            <Button 
                                type="click"
                                icon="pi pi-times"
                                label="취소" 
                                className="p-button-lg m-2 bg-primary-reverse"
                                onClick={ () => { navigate(`/projects`) }}
                            />
                        </div>    
                    </form>
                </div>
            </main>
            
            <InvitationModal 
                displayBasic = { displayBasic }
                setDisplayBasic = { setDisplayBasic }
                emails = { emails }
                setEmails = { setEmails }
            />
            <ConfirmDialog />
        </>
    );
}

export default Regist;