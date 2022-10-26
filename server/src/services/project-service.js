const getConnection = require('../database/connection');
const ProjectRepository = require('../repositories/project-repo');
const ProjectStatisticsRepository = require('../repositories/project-statistics-repo');
const AccountRepository = require('../repositories/account-repo');
const AccountUtils = require('../util/account-utils');
const EmailUtils = require('../util/email-utils');

exports.selectProjects = (params) => {

    return new Promise((resolve, reject) => {

        const connection = getConnection();

        const results = ProjectRepository.selectProjects(connection, params);

        connection.end();

        resolve(results);
    });
};

exports.selectProject = (projectCode) => {

    return new Promise((resolve, reject) => {

        const connection = getConnection();
        
        const result = ProjectRepository.selectProject(connection, projectCode);

        connection.end();

        resolve(result);
    });
};

exports.registProject = (projectInfo) => {

    return new Promise(async (resolve, reject) => {

        const connection = getConnection();
        connection.beginTransaction();
        console.log(projectInfo);
        
        try {
            /* 프로젝트 등록 */
            const result = await ProjectRepository.registProject(connection, projectInfo);
 
            /* 프로젝트 소유자 등록 */
            await ProjectRepository.registProjectMember(connection, result.insertId, projectInfo);

            const noticeInfo = {
                content: '',
                memberCode: projectInfo.loginMember,
                projectCode: result.insertId
            }
            
            /* 프로젝트 공지사항 등록 */
            await ProjectRepository.insertNoticeToProject(connection, noticeInfo);
            
            /* 프로젝트 히스토리 등록 */
            // await ProjectRepository.insertProjectHistory(connection, projectInfo, result.insertId);


            /* 프로젝트 조회 */
            const registedProject = await ProjectRepository.selectProject(connection, result.insertId);

            /* 초대할 기존 회원 조회 */
            if(projectInfo.emails.length > 0) {
                const registedMember = await ProjectRepository.selectRegistedMember(connection, projectInfo.emails);

                /* 기존회원들에게 초대메일 발송 */
                if(registedMember.length > 0) {
                    for(let i = 0; registedMember.length > i; i++) {
                        
                        await EmailUtils.sendInvitationMail(registedMember[i], registedProject[0]);
                    };
                };

                /* 신규가입을 시키고 프로젝트에 등록시키는 로직 */

                const totalEmails = [];              //받아온 값을 넣어주기 위한 배열(전체이메일)
                const splitEmails = [];              //중첩으로 감싸진 배열을 분리해서 넣어주기 위한 배열(전체이메일)  
                const existedEmails = [];            //기존 이메일

                /* 기존에 가입되어있는 회원 이메일들이 들어 있는 객체배열을 분리해서 이메일 주소만 배열에 넣어줌  */
                for(let i = 0; registedMember.length > i; i++) {
                    existedEmails.push(registedMember[i].memberEmail);
                }

                 /* 클라이언트가 요청한 이메일에 관련된 데이터를 배열에 넣어줌 */
                totalEmails.push(projectInfo.emails.filter(email => email.address));

                /* 클라이언트가 요청한 이메일 객체배열을 분리해서 이메일 주소만 배열에 넣어줌 */
                for(let i = 0; totalEmails[0].length > i; i++) {
                    splitEmails.push(totalEmails[0][i].address);
                }

                /* 클라이언트가 요청한 이메일주소와 기존 가입된 이메일을 비교해서 신규 가입이 필요한 이메일만 분류해서 배열 형태로
                객체에 담아줌 */
                const inviteNewMember = splitEmails.filter(email => !existedEmails.includes(email));

                /* 신규회원들에게 초대메일 발송 */
                if(inviteNewMember.length > 0) {
                    for(let i = 0; inviteNewMember.length > i; i++) {
                        
                        await EmailUtils.sendInvitationMailToNewMember(inviteNewMember[i], registedProject[0]);
                    };
                };
            }
            
            connection.commit();

            resolve(registedProject);
        } catch (err) {
            connection.rollback();

            reject(err);
        } finally {
            connection.end();
        }
    });
}

exports.modifyProject = (projectInfo) => {
    return new Promise( async(resolve, reject) => {
        
        const connection = getConnection();
        connection.beginTransaction();
        
        try {
            await ProjectRepository.updateProject(connection, projectInfo);
            await ProjectRepository.updateManager1(connection, projectInfo.projectCode);
            await ProjectRepository.updateManager2(connection, projectInfo.projectCode, projectInfo.projectOwner);
            // await ProjectRepository.updateProjectOwner(connection, projectInfo);
            const updatedProject = await ProjectRepository.selectProject(connection, projectInfo.projectCode);

            connection.commit();

            resolve(updatedProject);
        } catch (err) {
            connection.rollback();

            reject(err);
        } finally {
            connection.end();
        }
    });
}

exports.removeProject = (data) => {

    console.log('service', data);

    return new Promise(async (resolve, reject) => {

        const connection = getConnection();
        connection.beginTransaction();
        
        try {
            await ProjectRepository.deleteProject(connection, data.projectCode);
            const removedProject = await ProjectRepository.selectProjects(connection, data);
            connection.commit();

            resolve(removedProject);
        } catch (err) {
            connection.rollback();

            reject(err);
        } finally {
            connection.end();
        }
    });
}

exports.findProjectMember = (projectCode) => {

    return new Promise(async (resolve, reject) => {

        const connection = getConnection();

        const results = ProjectRepository.selectProjectMembers(connection, projectCode);

        connection.end();

        resolve(results);

    });
}

exports.findProjectMemberInfo = (projectMemberInfo) => {

    return new Promise(async (resolve, reject) => {

        const connection = getConnection();

        const results = ProjectRepository.selectProjectMember(connection, projectMemberInfo);

        connection.end();

        resolve(results);

    });
}

exports.registProjectMember = (data) => {
    
    return new Promise(async (resolve, reject) => {

        const connection = getConnection();
        connection.beginTransaction();

        try {

            const registedMember = await ProjectRepository.selectProjectMember(connection, data);

            console.log('등록된 회원 : ', registedMember);

            let result;
            
            /* 기존에 프로젝트에 가입한 적 있는 회원일 경우 상태값만 변경해서 해당 프로젝트에 재가입 시킴 */
            if(registedMember !== undefined) {
                result = await ProjectRepository.restoreProjectMember(connection, data);
            }

            /* 프로젝트에 가입한 적 없는 회원은 프로젝트에 신규 가입 */
            if(registedMember === undefined) {
                result = await ProjectRepository.insertProjectMember(connection, data);
            }

            connection.commit();

            resolve(result);
        } catch (err) {
            connection.rollback();

            reject(err);
        } finally {
            connection.end();
        }
    });
}

exports.removeProjectMember = (data) => {

    return new Promise(async (resolve, reject) => {

        const connection = getConnection();
        connection.beginTransaction();

        try {
            const result = await ProjectRepository.deleteProjectMember(connection, data);

            const projectMember = await ProjectRepository.selectProjectMembers(connection, data.projectCode);

            connection.commit();

            resolve(projectMember)

        } catch (err) {
            connection.rollback();

            reject(err);
        } finally {
            connection.end();
        }
    });
}

exports.inviteMember = (data) => {

    return new Promise(async (resolve, reject) => {

        const connection = getConnection();

        /* 기존 회원 조회 */
        const registedMember = await ProjectRepository.selectRegistedMember(connection, data.emails);

        /* 프로젝트 조회 */
        const registedProject = await ProjectRepository.selectProject(connection, data.projectCode);

        /* 프로젝트 팀원 목록 페이지 갱신을 위한 기존 팀원 데이터 조회  */
        const projectMembers = await ProjectRepository.selectProjectMembers(connection,  data.projectCode);

        /* 기존회원들에게 초대메일 발송 */
        if(registedMember.length > 0) {
            for(let i = 0; registedMember.length > i; i++) {
                console.log('registedProject', registedProject);
                await EmailUtils.sendInvitationMail(registedMember[i], registedProject[0]);
            };
        };

        /* 신규가입을 시키고 프로젝트에 등록시키는 로직 */

        const totalEmails = [];              //받아온 값을 넣어주기 위한 배열(전체이메일)             
        const splitEmails = [];              //중첩으로 감싸진 배열을 분리해서 넣어주기 위한 배열(전체이메일)
        const existedEmails = [];            //기존 이메일

        
        /* 기존에 가입되어있는 회원 이메일들이 들어 있는 객체배열을 분리해서 이메일 주소만 배열에 넣어줌  */
        for(let i = 0; registedMember.length > i; i++) {
            existedEmails.push(registedMember[i].memberEmail);
        }

        /* 클라이언트가 요청한 이메일에 관련된 데이터를 배열에 넣어줌 */
        totalEmails.push(data.emails.filter(email => email.address));

        /* 클라이언트가 요청한 이메일 객체배열을 분리해서 이메일 주소만 배열에 넣어줌 */
        for(let i = 0; totalEmails[0].length > i; i++) {
            splitEmails.push(totalEmails[0][i].address);
        }
        
        /* 클라이언트가 요청한 이메일주소와 기존 가입된 이메일을 비교해서 신규 가입이 필요한 이메일만 분류해서 배열 형태로
        객체에 담아줌 */
        const inviteNewMember = splitEmails.filter(email => !existedEmails.includes(email));

        /* 신규회원들에게 초대메일 발송 */
         if(inviteNewMember.length > 0) {
             for(let i = 0; inviteNewMember.length > i; i++) {
                 
                 await EmailUtils.sendInvitationMailToNewMember(inviteNewMember[i], registedProject[0]);
             };
         };

        connection.end();

        resolve(projectMembers);
    });
};

exports.signUpProjectMember = (data) => {
    console.log(data.memberInfo.id);
    return new Promise(async (resolve, reject) => {

        const connection = getConnection();
        connection.beginTransaction();

        try {
            const validationID = await AccountRepository.selectAccountWithMemberId(connection, data.memberInfo.id);
            console.log('validationID', validationID[0]);

            if(validationID[0]){
                console.log('Already registered');
                connection.rollback();
                return reject("Already registered");
            }

            console.log('registerAccountBefore', data.memberInfo);
            console.log('비밀번호', data.memberInfo.password);
            data.memberInfo.password = await AccountUtils.setPassword(data.memberInfo.password);

            console.log('registerAccountAfter', data.memberInfo);
            const result = await AccountRepository.registerAccount(connection, data.memberInfo);

            await ProjectRepository.modifyMemberEmailAuthApporovedStatus(connection, result.insertId);

            const projectMemberInfo = {
                memberCode : result.insertId,
                projectCode : data.projectCode
            }

            const registProjectMember = await ProjectRepository.insertProjectMember(connection, projectMemberInfo);


            connection.commit();

            resolve(registProjectMember);

        } catch (err) {
            console.log(err);
            connection.rollback();
            console.log('rooback succeeded');

            reject(err);
        } finally {
            connection.end();
            console.log('connection closed succeeded');
        }
    });
}

exports.modifyAuthorityOfMember = (projectMemberInfo) => {
    return new Promise( async(resolve, reject) => {
        
        const connection = getConnection();
        connection.beginTransaction();

        try {
            await ProjectRepository.updateAuthorityOfMember(connection, projectMemberInfo);
            const projectMemberList = await ProjectRepository.selectProjectMembers(connection, projectMemberInfo.projectCode);
            
            connection.commit();

            resolve(projectMemberList);
        } catch (err) {
            console.log(err);
            connection.rollback();
            
            reject(err);
        } finally {
            connection.end();
        }
    });
}

exports.findNotice = (projectCode) => {
    return new Promise( async(resolve, reject) => {

        const connection = getConnection();

        const results = ProjectRepository.selectNotice(connection, projectCode);

        connection.end();

        resolve(results);

    })
}

exports.modifyNoticeToProject = (noticeInfo) => {
    return new Promise( async(resolve, reject) => {
        
        const connection = getConnection();
        connection.beginTransaction();

        try {
            const result = await ProjectRepository.modifyNoticeToProject(connection, noticeInfo);
            await ProjectRepository.selectNotice(connection, noticeInfo.projectCode);
            
            connection.commit();

            resolve();
        } catch (err) {
            console.log(err);
            connection.rollback();
            
            reject(err);
        } finally {
            connection.end();
        }
    });
}