import PageTitle from '../../../components/items/PageTitle';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { callGetProjectMemberAPI, callPutProjectAPI } from '../../../apis/ProjectAPICalls';
import { callGetProjectAPI } from '../../../apis/ProjectAPICalls';
import { useForm, Controller, FieldError } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';

function Information() {
    const toast = useRef(null);
    const dispatch = useDispatch();
    const { projectCode } = useParams();
    const project = useSelector(state => state.projectsReducer);
    const memberList = useSelector(state => state.projectMemberReducer);
    const [teamMates, setTeamMates] = useState([]);
    const [projectName, setProjectName ] = useState('');
    const [projectDescription, setProjectDescription ] = useState('');
    const [selectedProjectOwner, setSelectedProjectOwner] = useState('');
    console.log(selectedProjectOwner);
    
    useEffect(
        () =>
        {
            dispatch(callGetProjectAPI({
                'projectCode': projectCode
            }));
            dispatch(callGetProjectMemberAPI({
                'projectCode': projectCode
            }));
        },
        []
      );

      useEffect(
        () =>
        {   
            if(memberList.length !== 0) {

                setTeamMates(memberList);
            }
        },
        [memberList]
      );

      useEffect(
        () =>
        {   
            if(project.length !== 0) {

                setProjectName(project[0].projectName);
                setProjectDescription(project[0].projectDescription);
                setSelectedProjectOwner(project[0].projectOwnerCode);
            }
        },
        [project]
      );

    const defaultValues = {
        projectCode: (project.length !== 0)? project[0].projectCode: '',
        projectName : (project.length !== 0)? project[0].projectName: '',
        projectDescription : (project.length !== 0)? project[0].projectDescription: '',
        projectOwner: selectedProjectOwner
    };

    const { control, formState: { errors }, handleSubmit } = useForm({ defaultValues });

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const acceptFunc = async () => {
        await dispatch(callPutProjectAPI(projectCode, projectName, projectDescription, selectedProjectOwner));
        await toast.current.show({ severity: 'info', summary: 'Confirmed', detail: '???????????? ????????? ??????????????????.', life: 3000 })
    };

    const submitHandler = async () => {
        await setProjectName((project.length !== 0)? project[0].projectName: '');
        await setProjectDescription((project.length !== 0)? project[0].projectDescription: '');
        await confirmDialog({
            message: '?????? ???????????? ????????? ???????????????????',
            header: '???????????? ??????',
            icon: 'pi pi-exclamation-triangle',
            accept: () => acceptFunc(),
            reject: () => toast.current.show({ severity: 'warn', summary: '??????', detail: '??????????????????.', life: 3000 })
        });
    }

    const onProjectMemberChange = (e) => {
        setSelectedProjectOwner(e.value);
    }

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            <PageTitle 
                icon={<i className="pi pi-fw pi-pencil"></i>}
                text="???????????? ????????????"
            />
            <form 
                style={{display: 'flex', flexDirection: 'column' }}
                onSubmit={handleSubmit(submitHandler)}
                className="p-fluid"
            >
                <div className="p-fluid grid">
                    <div className="field col-12 md:col-4">
                        <label htmlFor="projectName">???????????? ??????</label>
                        <Controller 
                                name="projectName" 
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputText 
                                        id={field.name} 
                                        {...field}
                                        onChange={ (e) => setProjectName(e.target.value)}
                                        value={ projectName }
                                        // ref={handleSubmit}
                                        autoComplete="off" 
                                        className={classNames({ 'p-invalid': fieldState.invalid })} 
                                        required
                                    />
                            )} />
                    </div>

                    <div className="field col-12 md:col-4">
                        <label htmlFor="projectDescription">???????????? ??????</label>
                        <Controller 
                                name="projectDescription" 
                                control={control} 
                                render={({ field, fieldState }) => (
                                    <InputText 
                                        id={field.name} 
                                        {...field}
                                        onChange={async (e) => await setProjectDescription(e.target.value)}
                                        value={ projectDescription }
                                        autoComplete="off" 
                                        className={classNames({ 'p-invalid': fieldState.invalid })}
                                        required
                                    />
                            )} />
                    </div>

                    <div className="field col-12 md:col-4">
                         <label htmlFor="projectDescription">???????????? ?????????</label>
                        <Dropdown 
                            value={selectedProjectOwner} 
                            options={teamMates} 
                            onChange={onProjectMemberChange} 
                            optionValue="memberCode" 
                            optionLabel="memberName"
                        />
                    </div>
                    
                </div>

                <Button 
                    type="submit" 
                    label="??????" 
                    className="p-button-sm"
                />
            </form>
        </>
        
    );
}

export default Information;