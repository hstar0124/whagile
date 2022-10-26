const projectQuery = require('../database/project-query');
const ProjectDTO = require('../dto/project/project-response-dto');
const ProjectMemberDTO = require('../dto/project/project-member-response-dto');
const ProjectNoticeDTO = require('../dto/project/project-notice-response-dto');

exports.selectProjects = (connection, params) => {
    return new Promise((resolve, reject) => {
        // console.log('repo',params);
        connection.query(projectQuery.selectProjects(params), 
        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }

            const project = [];
            for(let i = 0; i < results.length; i++) {
                project.push(new ProjectDTO(results[i]));
            }

            // console.log('project', project);

            resolve(project);
        });
    });
};

exports.selectProject = (connection, projectCode) => {
    console.log('selectProject', projectCode);
    return new Promise((resolve, reject) => {
        connection.query(projectQuery.selectProjectWithProjectCode(projectCode), 
        
        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }

            const project = [];
            project.push(new ProjectDTO(results[0]));
            resolve(project);
        });
    });
};

exports.registProject= (connection, projectInfo) => {
    return new Promise((resolve, reject) => {
        connection.query(projectQuery.insertProject(),
        [ projectInfo.projectName
        , projectInfo.projectDescription
        ],
        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }
            
            resolve(results);
        });
    });
};

exports.registProjectMember = (connection, projectCode, projectInfo ) => {
 
    return new Promise((resolve, reject) => {
        console.log("프로젝트번호는?", projectCode);
        connection.query(projectQuery.insertProjectMember(),
        [ projectInfo.loginMember, 
          1, 
          projectCode ],
        
        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }

            resolve(results);
        });
    });
}

exports.updateProject = (connection, projectInfo ) => {
 
    return new Promise((resolve, reject) => {
        connection.query(projectQuery.updateProject(),
        [ projectInfo.projectName
        , projectInfo.projectDescription
        , projectInfo.projectCode ],
        
        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }

            resolve(results);
        });
    });
}

exports.updateManager1 = (connection, projectCode ) => {
 
    return new Promise((resolve, reject) => {
        connection.query(projectQuery.updateProjectOwner1(),
        [ projectCode ],
        
        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }

            resolve(results);
        });
    });
}

exports.updateManager2 = (connection, projectCode, projectOwner ) => {
 
    return new Promise((resolve, reject) => {
        connection.query(projectQuery.updateProjectOwner2(),
        [ projectCode, projectOwner ],

        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }

            resolve(results);
        });
    });
}

exports.updateProjectOwner = (connection, projectInfo) => {

    return new Promise((resolve, reject) => {
        connection.query(projectQuery.updateProjectOwner(projectInfo),

        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }

            resolve(results);
        });
    });
}

exports.deleteProject = (connection, projectCode) => {

    return new Promise((resolve, reject) => {
        connection.query(projectQuery.deleteProject(),
        [ projectCode ],
        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }

            resolve(results);
        });
    });
}

exports.selectProjectMembers = (connection, projectCode) => {
    return new Promise((resolve, reject) => {
        connection.query(projectQuery.selectProjectMembers(projectCode),
        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }
            
            const projectMembers = [];
            for(let i = 0; i < results.length; i++) {
                projectMembers.push(new ProjectMemberDTO(results[i]));
            }

            resolve(projectMembers);
        });
    });
}

exports.restoreProjectMember = (connection, data) => {
    return new Promise((resolve, reject) => {
        console.log(data);
        connection.query(projectQuery.restoreProjectMember(data),

        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }

            resolve(results);
        });
    });
};

exports.insertProjectMember = (connection, data) => {
    console.log('insertProjectMember', data);
    return new Promise((resolve, reject) => {
        connection.query(projectQuery.insertProjectMember(),
        [ data.memberCode
        , 3
        , data.projectCode
        ],
        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }
            
            resolve(results);
        });
    });
};

exports.deleteProjectMember = (connection, data) => {
    console.log(data);
    return new Promise((resolve, reject) => {
        connection.query(projectQuery.deleteProjectMember(data),
        
        (err,results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }

            resolve(results);
        });
    });
}

exports.selectRegistedMember = (connection, data) => {

    return new Promise((resolve, reject) => {

        connection.query(projectQuery.isRegistedMember(data),
        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }

            const memberInfo = [];
            for(let i = 0; i < results.length; i++) {
                memberInfo.push(new ProjectMemberDTO(results[i]));
            }

            resolve(memberInfo);
        });
    });
}

exports.modifyMemberEmailAuthApporovedStatus = (connection, memberCode) => {

    return new Promise((resolve, reject) => {
        connection.query(projectQuery.updateMemberEmailAuthApporovedStatus(memberCode),
        
        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }

            resolve(results);
        });
    });
}

exports.updateAuthorityOfMember = (connection, projectMemberInfo) => {

    return new Promise((resolve, reject) => {
        connection.query(projectQuery.updateAuthorityOfMember(projectMemberInfo),
        
        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }

            resolve(results);
        }
        )
    });
}

exports.selectProjectMember = (connection, projectMemberInfo) => {
    return new Promise((resolve, reject) => {
        connection.query(projectQuery.selectProjectMember(projectMemberInfo),
        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }

            const projectMember = [];

            if(results.length > 0) {
                projectMember.push(new ProjectMemberDTO(results[0]));
                console.log('projectMember', projectMember);
            }
            
            resolve(projectMember[0]);
        });
    });
}

exports.selectNotice = (connection, projectCode) => {

    return new Promise((resolve, reject) => {
        connection.query(projectQuery.selectNotice(projectCode),

        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }

            const notice = [];
            for(let i = 0; i < results.length; i++) {
                notice.push(new ProjectNoticeDTO(results[i]));
            }

            resolve(notice[0]);
        });
    });
}

exports.insertNoticeToProject = (connection, noticeInfo) => {

    const dt = new Date();

    const today = dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate();

    return new Promise((resolve, reject) => {
        connection.query(projectQuery.insertNoticeToProject(),
        [noticeInfo.content, String(today), noticeInfo.memberCode, noticeInfo.projectCode],
        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }

            resolve(results);
        });
    });
}

exports.modifyNoticeToProject = (connection, noticeInfo) => {

    return new Promise((resolve, reject) => {
        connection.query(projectQuery.modifyNoticeToProject(noticeInfo),
        (err, results, fields) => {

            if(err) {
                console.log(err);
                reject(err);
            }

            resolve(results);
        });
    });
}

exports.insertProjectHistory = (connection, projectInfo, projectCode) => {

    return new Promise((resolve, reject) => {
        
        connection.query(projectQuery.insertProjectHistory(),
            [
                '신규 프로젝트',
                '생성',
                projectCode,
                projectInfo.loginMember
            ],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }

                resolve(results);
            }
        );
    })
}