const express = require('express');
const router = express.Router();
const InquiryCommentController = require('../controllers/inquiry-comment-controller');

/* 1:1 문의 답변 등록 */
router.post('/', InquiryCommentController.registComment);

/* 1:1 문의 답변 조회 */
router.get('/', InquiryCommentController.findComment);

/* 1:1 문의 답변 수정 */
router.put('/', InquiryCommentController.modifyComment);

/* 1:1 문의 답변 삭제 */
router.delete('/', InquiryCommentController.removeComment);

module.exports = router;