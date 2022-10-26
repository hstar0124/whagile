import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import EmailItems from './EmailItems';
import { callPostInviteMemberAPI } from '../../../apis/ProjectAPICalls';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';


function InvitationExecutionModal({ displayBasic, setDisplayBasic, emails, setEmails, projectCode }) {

    let emptyEmails = [];
    const toast = useRef(null);
    const dispatch = useDispatch();
    const [displayPosition, setDisplayPosition] = useState(false);
    const [inputEmail, setInputEmail] = useState('');
    const [nextId, setNextId] = useState(1);

    const dialogFuncMap = {
        'displayBasic': setDisplayBasic,
        'displayPosition': setDisplayPosition
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }

    const addEmail = async() => {

        if(inputEmail !== '' && inputEmail !== null && inputEmail !== undefined) {

            const changeEmails = await emails.concat({
                id: nextId,
                address: inputEmail
            });

            await setInputEmail('');
            await setNextId(nextId + 1);
            await setEmails(changeEmails);
        }
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button type="button" label="등록" icon="pi pi-check" onClick={() => {inviteMember(name); onHide(name);}} />
                <Button label="취소" icon="pi pi-times" onClick={() => {onHide(name); setEmails(emptyEmails);}} className="p-button-text" />
            </div>
        );
    }

    const inviteMember = async() => {
        if(emails.length > 0) {
            await dispatch(callPostInviteMemberAPI(emails, projectCode));
            await setEmails([]);
            await toast.current.show({ severity: 'info', summary: '발송완료', detail: '해당 이메일로 초대 메일을 발송 했습니다.', life: 3000 });
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <Dialog 
                header="팀원 초대" 
                visible={displayBasic}
                footer={renderFooter('displayBasic')}
                onHide={() => onHide('displayBasic')}
                style={{ width: '50vw', height: '50%' }}
            >
                <div className="field row-12 md:row-4">
                    <label htmlFor="inputtext">이메일</label>
                    <InputText id="inputtext1" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} className="p-invalid" />
                    <Button type='click' label='추가'  icon='pi pi-plus' onClick={ addEmail }></Button>
                </div>
                <EmailItems 
                    emails={ emails } 
                    setEmails={ setEmails } 
                />   
            </Dialog>
        </>
    );
}

export default InvitationExecutionModal;