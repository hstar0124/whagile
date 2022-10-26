import BacklogCommentCSS from './BacklogComment.module.css';
import BacklogAndSprintCSS from './BacklogAndSprint.module.css';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { callGetBacklogCommentsAPI, callPostBacklogCommentAPI } from '../../../apis/BacklogCommentAPICalls';

import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import CommentItem from './CommentItem';

function BacklogComment({backlogCode, projectCode}) {

    /* redux modules */
    const dispatch = useDispatch();
    const backlogComments = useSelector(state => state.backlogCommentReducer);
    const backlogCommentDetail = useSelector(state => state.backlogCommentDetailReducer);
  
    const toast = useRef(null);

    /* 페이징 */
    const [pageNo, setPageNo] = useState(0);
    const [limit, setLimit] = useState(5);

    /* 새 댓글 생성 임시데이터 state */
    const [content, setContent] = useState(null);
        
    useEffect(
        () => {
            if (backlogCommentDetail.status === 200 || backlogCommentDetail.status === 201) {
                toast.current.show({ 
                    severity: 'info', 
                    summary: 'Confirmed', 
                    detail: backlogCommentDetail.message, 
                    life: 3000 
                });
            }
        },
        [backlogCommentDetail]
    );

    /* 댓글 갯수에 따른 style 주솟값 캐슁 */
    const noComments = useMemo(
        () => {
            return {
                show: {display: backlogComments.length > 0? 'none' : 'block'},
                hide: {display: backlogComments.length > 0? 'block' : 'none'}
            }
        },
        [backlogComments]
    );
    
    /* 백로그 댓글 더보기 */
    const readMoreComments = useCallback(
        () => {
            dispatch(callGetBacklogCommentsAPI(
                {
                    backlogCode: backlogCode,
                    offset: (pageNo + 1) * limit,
                    limit: limit
                }
            ));
            setPageNo(pageNo + 1);
        },
        [backlogComments]
    );
    
    /* 백로그 댓글 등록 */
    const registNewComment = () => {
        /* 새 댓글 등록용 파라미터 선언 및 초기화 */        
        const newComment = {
            content: content,
            backlogCode: backlogCode,
            projectCode: projectCode,
        };

        return new Promise(async (resolve, reject) => {
            await dispatch(callPostBacklogCommentAPI(newComment));
            await window.location.replace(window.location.href);
        });
    };
    
    return (
        <>
            <Toast ref={ toast }/>
            <div 
                id={ BacklogCommentCSS.noComments }
                style={ noComments.show }
            >
                댓글이 없습니다.
            </div> 
            {backlogComments.map(comment => 
                <CommentItem 
                    key={ comment.backlogCommentCode } 
                    comment={ comment }
                />
            )}
            <div
                style={ noComments.hide }
            >
                <button 
                    id={ BacklogCommentCSS.moreCommentsBtn }
                    onClick={ readMoreComments }
            >
                    <i className="pi pi-fw pi-ellipsis-h" style={{ fontSize: '10px' }}/> 더보기
                </button>
            </div>
            <div id={ BacklogAndSprintCSS.newComment }>
                <h6 className={ BacklogAndSprintCSS.fontColoring }>댓글 작성</h6>
                <InputTextarea 
                    id={ BacklogAndSprintCSS.inputComment }
                    value={ content } 
                    onChange={ (e) => setContent(e.target.value) } 
                    rows={ 2 }
                /><br/>
                <Button 
                    id={ BacklogAndSprintCSS.registCommentBtn } 
                    label="등록"
                    onClick={ registNewComment }
                    disabled={ content === null || content === ''? true : false}
                />
            </div>
        </>
    );
};
export default BacklogComment;