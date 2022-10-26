const inquiryQuery = require('../database/inquiry-query');
const InquiryDTO = require('../dto/inquiry/inquiry-response-dto');
// const InquiryHistoryDTO = require('../dto/inquiry/inquiry-history-response-dto');

/* 1:1 문의 등록 */
exports.insertInquiry = (connection, newInquiry) => {

    return new Promise((resolve, reject) => {
        connection.query(
            inquiryQuery.insertInquiry(),
            [
                newInquiry.title, 
                newInquiry.content,
                newInquiry.memberCode,
                newInquiry.categoryCode
            ],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }
                resolve(results);
            }
        );
    });
};

/* 1:1 문의 목록 조회 */
exports.selectInquiries = (connection, params) => {

    return new Promise((resolve, reject) => {
        const query = 
        connection.query(
            inquiryQuery.selectInquiries(
                params.memberCode, 
                params.filter, 
                params.searchValue,
                params.memberRole
            ),
            [
                params.offset,
                params.limit
            ],
            (err, results, fields) => {
                if (err) {
                    reject(err);
                }
                
                const inquiries = [];
                for(let i = 0; i < results.length; i++) {
                    inquiries.push(new InquiryDTO(results[i]));
                }
                
                resolve(inquiries);
            }
        );

        console.log(query.sql)
    });
};

/* 1:1 문의 상세 조회 */
exports.selectInquiry = (connection, inquiryCode) => {

    return new Promise((resolve, reject) => {
        connection.query(
            inquiryQuery.selectInquiry(),
            [inquiryCode],
            (err, results, fields) => {
                if (err) {
                    reject(err);
                }

                const inquiries = [];
                for(let i = 0; i < results.length; i++) {
                    inquiries.push(new InquiryDTO(results[i]));
                }
                
                resolve(inquiries);
            }
        );
    });
};

/* 1:1 문의 수정 */
exports.updateInquiry = (connection, modifiedInquiry) => {

    return new Promise((resolve, reject) => {
        connection.query(
            inquiryQuery.updateInquiry(modifiedInquiry),
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }
                resolve(results);
            }
        );
    });
};

/* 1:1 문의 삭제 */
exports.deleteInquiry = (connection, inquiryCode) => {

    return new Promise((resolve, reject) => {
        connection.query(
            inquiryQuery.deleteInquiry(),
            [inquiryCode],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }
                resolve(results);
            }
        );
    });
};

/* 1:1 문의 답변 등록 여부 변경 */
exports.updateAnsweredStatus = (connection, answeredYN, inquiryCode) => {

    return new Promise((resolve, reject) => {
        connection.query(
            inquiryQuery.updateAnsweredStatus(),
            [answeredYN, inquiryCode],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }
                resolve(results);
            }
        );
    });
};

/* 1:1 문의 히스토리 생성 */
exports.insertInquiryHistory = (connection, newHistory) => {

    return new Promise((resolve, reject) => {
        connection.query(
            inquiryQuery.insertInquiryHistory(),
            [
                newHistory.historyContent.toString(),   
                newHistory.contentSnapshot.toString(),
                newHistory.inquiryCode,
                newHistory.memberCode
            ],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }
                resolve(results);
            }
        );
    });
};