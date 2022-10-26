const express = require('express');
const router = express.Router();
const InquiryController = require('../controllers/inquiry-controller');

/* 1:1 문의 등록 */
router.post('/', InquiryController.registInquiry);

/* 1:1 문의 목록 조회 */
router.get('/', InquiryController.findInquiries);

/* 1:1 문의 상세 조회 */
router.get('/:inquiryCode', InquiryController.findInquiryByInquiryCode);

/* 1:1 문의 수정 */
router.put('/', InquiryController.modifyInquiry);

/* 1:1 문의 삭제 */
router.delete('/', InquiryController.removeInquiry);

module.exports = router;