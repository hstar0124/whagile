import InquiryCSS from './Inquiry.module.css';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { callPostInquiryAPI } from '../../apis/InquiryAPICalls';

import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';

function InquiryCreationModal({ visibleCreation, setVisibleCreation }) {

    const dispatch = useDispatch();

    /* 1:1 문의 등록 데이터 임시 저장용 state */
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryCode, setCategoryCode] = useState(0);

    /* 문의 유형 */
    const categories = [
        { label: '일반', value: 1 },
        { label: '버그 신고', value: 2 },
        { label: '결제 및 환불', value: 3 },
        { label: '건의 사항', value: 4 },
    ];

    /* 문의 등록 */
    const registInquiry = () => {

        if(title && content && categoryCode) {
            const newInquiry = {
                title: title,
                content: content, 
                categoryCode: categoryCode
            }
            
            return new Promise(async (resolve, reject) => {
                await dispatch(callPostInquiryAPI(newInquiry));
                await onHide();
                await window.location.replace(window.location.href);
            });
        } else {
            alert('필수 입력사항을 모두 입력해주세요.');
        }
    }

    /* 다이얼로그 닫기 */
    const onHide = () => {
        setVisibleCreation(false);
        /* 임시저장 데이터 초기화 */
        setTitle('');
        setContent('');
        setCategoryCode(0);
    }

    return(
        <>
            <Button 
                id={ InquiryCSS.newInquiryBtn }
                label='문의하기'
                onClick={ () => setVisibleCreation(true) }
            />
            <Sidebar 
                style={{ width: '40%'}}
                position='right'
                className='p-sidebar-lg'
                visible={ visibleCreation }
                onHide={ onHide }
            >
                <div id={ InquiryCSS.inquiryDataInput }>
                    <h5>문의하기</h5>
                    <span id={ InquiryCSS.smallInfo }>*은 필수 입력 사항입니다.</span>
                    <label>제목*</label>
                    <InputText
                        id={ InquiryCSS.inputTitle }
                        value={ title }
                        onChange={ (e) => setTitle(e.target.value) }
                        />
                    <label>문의 유형*</label>
                    <Dropdown
                        id={ InquiryCSS.inputOption }
                        optionLabel='label'
                        optionValue='value'
                        value={ categoryCode }
                        options={ categories }
                        onChange={ (e) => setCategoryCode(e.target.value) }
                        placeholder='문의 유형'
                    />
                    <label>내용*</label>
                    <InputTextarea
                        id={ InquiryCSS.inputContent }
                        rows={ 15 }
                        autoResize
                        value={ content }
                        onChange={ (e) => setContent(e.target.value) }
                    />
                    <div>
                        <button 
                            id={ InquiryCSS.createBtn }
                            onClick={ registInquiry }
                        >
                            등록
                        </button>
                        <button 
                            id={ InquiryCSS.cancelBtn }
                            onClick={ onHide }
                        >
                            취소
                        </button>
                    </div>
                </div>
            </Sidebar>    
        </>
    );
}

export default InquiryCreationModal;