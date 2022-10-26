import '../AdminStyle.css';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import PageTitle from '../../../components/items/PageTitle';
import InquiryTable from '../../../components/items/inquiry/InquiryTable';

function AdminInquery() {
    
    const inquiryComment = useSelector(state => state.inquiryCommentReducer);

    useEffect(
        () => {
            if(inquiryComment.status === 200 || inquiryComment.status === 201) {
                alert(inquiryComment.message);
            }
        },
        [inquiryComment]
    );

    return (
        <section className="section">
            <PageTitle 
                icon={<i className="pi pi-fw pi-phone"></i>}
                text="고객센터"
            />
            <InquiryTable/>
        </section>
    );
}

export default AdminInquery;