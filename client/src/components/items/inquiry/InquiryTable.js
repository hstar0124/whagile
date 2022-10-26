import InquiryCSS from '../../../pages/inquiry/Inquiry.module.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callGetInquiriesAPI, callGetInquiryDetailAPI } from '../../../apis/InquiryAPICalls';

import { InputText } from 'primereact/inputtext';
import InquiryDetailModal from '../../../pages/inquiry/InquiryDetailModal';

function InquiryTable() {

    const dispatch = useDispatch();
    const inquiries = useSelector(state => state.inquiriesReducer);

    /* 페이징 및 검색 조건 */
    const [offset, setOffset] = useState(0);
    const [filter, setFilter] = useState('');
    const [searchValue, setSearchValue] = useState('');

    useEffect(
        () => {
            dispatch(callGetInquiriesAPI({
                offset: 0,
                limit: 10,
            }));
        },
        []
    );

    /* 필터 조건 부여하여 목록 조회 */
    const getFilteredList = (filteredValue) => {
        alert('준비 중입니다.');
        // setFilter(filteredValue);

        // dispatch(callGetInquiriesAPI({
        //     offset: 0,
        //     limit: 10,
        //     filter: filter
        // }));
    }
    
    /* 목록 더보기 요청 */
    const readMoreInquiries = () => {
        const params = {
            offset: (offset + 1) * 10,
            limit: 10
            // filter: filter
        }
        setOffset(offset + 1);
        dispatch(callGetInquiriesAPI(params));
    }

    return (
        <>
            <div id={ InquiryCSS.main }>
                <div>
                    문의 목록
                </div>
                <div id={ InquiryCSS.searchBar }>
                    <label>제목 검색</label> 
                    <InputText
                        style={{ marginLeft: '5px', marginRight: '10px' }}
                        id="searchValue"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button
                        id={ InquiryCSS.searchBtn }
                        onClick={ () => alert('준비 중입니다.') }
                    >
                        <i className='pi pi-search'/>
                    </button>
                </div>
                <div id={ InquiryCSS.filter }>
                    필터 
                    <button
                        onClick={ () => {getFilteredList('')} }
                    >
                        전체
                    </button>
                    <button
                        onClick={ () => getFilteredList('N') }
                    >
                        미답변
                    </button>
                    <button
                        onClick={ () => getFilteredList('Y') }
                    >
                        답변완료
                    </button>
                </div>
                <div id={ InquiryCSS.tableHeader }>
                    <div>번호</div>
                    <div>제목</div>
                    <div>작성시간</div>
                    <div>작성자</div>
                    <div>문의유형</div>
                    <div>답변상태</div>
                    <div>자세히</div>
                </div>
                { 
                    inquiries.length > 0
                    ? inquiries.map(inquiry => 
                        <div key={ inquiry.inquiryCode } className={ InquiryCSS.tableRow }>
                            <div>{ inquiry.inquiryCode }</div>
                            <div>{ inquiry.title }</div>
                            <div>{ inquiry.createdDate }</div>
                            <div>{ inquiry.memberName }</div>
                            <div>{ inquiry.categoryName }</div>
                            <div>{ inquiry.answeredYN === 'N'? '미답변' : '답변완료' }</div>
                            <div>
                                <InquiryDetailModal inquiry={ inquiry }/>
                            </div>
                        </div>
                    )
                    : <div id={ InquiryCSS.noInquiry }>등록된 문의 글이 없습니다.</div>
                }
                <button 
                    id={ InquiryCSS.readMoreBtn }
                    onClick={ readMoreInquiries }    
                    style={{ display: (inquiries.length > 0)? 'block' : 'none'}}
                >
                    더보기
                </button>
            </div>
        </>
    );
}

export default InquiryTable;