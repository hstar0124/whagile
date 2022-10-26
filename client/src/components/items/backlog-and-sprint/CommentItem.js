import BacklogCommentCSS from './BacklogComment.module.css';

import { useParams } from 'react-router';
import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { decodeJwt } from '../../../utils/tokenUtils';
import { callPutBacklogCommentAPI, callDeleteBacklogCommentAPI } from '../../../apis/BacklogCommentAPICalls';

import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { InputTextarea } from 'primereact/inputtextarea';

function CommentItem({ comment }) {

    const loginUser = decodeJwt(window.localStorage.getItem('access_token'));

    const { projectCode } = useParams();

    const dispatch = useDispatch();
      
    /* confirm 창 표시 상태 */
    const [removalVisible, setRemovalVisible] = useState(false);

    /* 댓글 수정, 댓글 삭제 임시데이터 상태 */
    const [editable, setEditable] = useState(false);
    const [modifiedComment, setModifiedComment] = useState(comment.content);
    const modifyRequest = {
        backlogCommentCode: 0,
        projectCode: comment.projectCode,
        modifiedComment: modifiedComment
    }
    const [removeRequest, setRemoveRequest] = useState({});
    
    /* 댓글 편집 가능 여부에 따른 style 주솟값 캐슁 */
    const toggle = useMemo(
        () => {
            return {
                on: {display: editable? 'block' : 'none'},
                off: {display: !editable? 'block' : 'none'}
            }
        },
        [editable]
    );
    
    /* 백로그 댓글 수정 */
    /* 댓글 수정 활성화 */
    const editComment = (backlogCommentCode) => {
        setEditable(true);
    };
    
    /* 수정한 데이터 전송 */
    const confirmModification = (backlogCommentCode) => {
        modifyRequest.backlogCommentCode = backlogCommentCode;
    
        dispatch(callPutBacklogCommentAPI(modifyRequest));
        setEditable(false);
        window.location.replace(window.location.href);
    };
    
    /* 백로그 댓글 삭제 */
    const removeComment = (backlogCommentCode) => {
        setRemoveRequest({
            'backlogCommentCode': backlogCommentCode,
            'projectCode': projectCode
        });
        
        setRemovalVisible(true);
    };
    
    const accept = (backlogCommentCode) => {
        return new Promise(async (resolve, reject) => {
            await dispatch(callDeleteBacklogCommentAPI(removeRequest));
            await setRemovalVisible(false);
            await window.location.replace(window.location.href);
        });
    }
    
    const reject = () => {}

    return (
        <>
            <ConfirmDialog 
                id={ BacklogCommentCSS.deleteConfirm }
                visible={ removalVisible } 
                onHide={ () => setRemovalVisible(false) } 
                message="삭제 시 복구할 수 없습니다."
                header="댓글을 삭제하시겠습니까?" 
                icon="pi pi-exclamation-triangle" 
                acceptClassName={ BacklogCommentCSS.deleteAcceptBtn }
                rejectClassName={ BacklogCommentCSS.deleteRejectBtn }
                acceptLabel="예"
                rejectLabel="아니오"
                accept={ () => accept() }
                reject={ () => reject() } 
            />  
            <div>
                <label id={ BacklogCommentCSS.memberName }>{ comment.memberName }</label>
                <label id={ BacklogCommentCSS.latestEdited }>
                    { comment.modifiedYN === 'Y'? comment.modifiedDate : comment.createdDate }
                </label>
                <label id={ BacklogCommentCSS.modifiedYN }>
                    { comment.modifiedYN == 'Y'? '수정됨' : '' }
                </label>
                <div>
                    <InputTextarea
                        id={ BacklogCommentCSS.content }
                        value={ modifiedComment }
                        onChange={ (e) => setModifiedComment(e.target.value) }
                        readOnly={ !editable? true : false }
                        rows={ 3 }
                        autoResize
                    />
                    <div
                        style={ toggle.on }
                    >
                        <Button 
                            id={ BacklogCommentCSS.modifyCancelBtn } 
                            label="취소"
                            onClick={ () => setEditable(false) }
                        />
                        <Button 
                            id={ BacklogCommentCSS.modifySaveBtn } 
                            label="저장"
                            onClick={ () => confirmModification(comment.backlogCommentCode) }    
                        />
                    </div>
                    <div
                        id={ BacklogCommentCSS.editableBtns }
                        style={{ visibility: comment.memberCode == loginUser.code && !editable? 'visible' : 'hidden' }}
                    >
                        <button 
                            id={ BacklogCommentCSS.editComment }
                            name="editComment"
                            onClick={ () => editComment(comment.backlogCommentCode) }
                        >
                            수정
                        </button>|    
                        <button 
                            id={ BacklogCommentCSS.removeComment }
                            onClick={ () => removeComment(comment.backlogCommentCode) }
                        >
                            삭제
                        </button>   
                    </div>
                </div>
            </div>
        </>
    );
}

export default CommentItem;