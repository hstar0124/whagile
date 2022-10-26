import React, { useState, useRef } from 'react';
import EmailItems from './EmailItems';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';


function InvitationModal({ displayBasic, setDisplayBasic, emails, setEmails }) {

    let emptyEmails = [];
    const toast = useRef(null);
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
            await toast.current.show({ severity: 'info', summary: 'Confirmed', detail: '초대할 팀원의 이메일을 입력했습니다.', life: 3000 });
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

export default InvitationModal;