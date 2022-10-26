import InquiryCSS from './Inquiry.module.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callGetInquiriesAPI } from '../../apis/InquiryAPICalls';

import MainHeader from '../../components/commons/MainHeader';
import PageTitle from '../../components/items/PageTitle';
import InquiryTable from '../../components/items/inquiry/InquiryTable';
import InquiryCreationModal from './InquiryCreationModal';
import { Navigate } from 'react-router';

function Inquiry() {

    const dispatch = useDispatch();
    const inquiries = useSelector(state => state.inquiriesReducer);
    const inquiry = useSelector(state => state.inquiryReducer);

    const [visibleCreation, setVisibleCreation] = useState(false);

    /* 1:1문의 등록, 수정, 삭제 확인 메시지 표시 */
    useEffect(
        () => {
            if(inquiry.status === 200 || inquiry.status === 201) {
                alert(inquiry.message);
            }
        },
        [inquiry]
    );

    useEffect(
        () => {
            dispatch(callGetInquiriesAPI({
                offset: 0,
                limit: 10
            }));
        },
        []
    );

    return (
        <>
            <MainHeader/>
            <div id={ InquiryCSS.pageLayout }>
                <PageTitle
                    icon={ <i className="pi pi-fw pi-envelope"></i> }
                    text="1:1 문의"
                />
                <InquiryTable/>
                <InquiryCreationModal 
                    visibleCreation={ visibleCreation }
                    setVisibleCreation={ setVisibleCreation }
                />
            </div>
        </>
    );
}

export default Inquiry;