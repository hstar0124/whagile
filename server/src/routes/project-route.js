const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/project-controller');

router.get('/', ProjectController.selectProjects);
router.get('/:projectCode', ProjectController.selectProject);
router.post('/', ProjectController.registProject);
router.put('/:projectCode', ProjectController.modifyProject);
router.delete('/', ProjectController.removeProject);
router.get('/:projectCode/member', ProjectController.findProjectMembers);
router.delete('/:projectCode/removeProjectMember/:memberCode', ProjectController.removeProjectMember);
router.post('/invitation', ProjectController.inviteMember);
router.get('/:projectCode/joinedMember/:memberCode', ProjectController.registProjectMember);
router.post('/:projectCode/joinedNewMember', ProjectController.signUpProjectMember);
router.put('/:projectCode/member/:memberCode/', ProjectController.modifyAuthorityOfMember);
router.get('/:projectCode/notice', ProjectController.findNotice);
router.put('/:projectCode/notice', ProjectController.modifyNoticeToProject);
router.get('/:projectCode/member/:memberCode', ProjectController.findProjectMemberInfo);

module.exports = router;