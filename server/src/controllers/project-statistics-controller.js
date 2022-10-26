const HttpStatus = require('http-status');
const ProjectStatisticsService = require('../services/project-statistics-service');


exports.findCountingTaskByProgressStatus = async (req, res, next) => {

    console.log('=========controller=============', req.params.projectCode);
    await ProjectStatisticsService.findCountingTaskByProgressStatus(req.params.projectCode)
        .then((results) => {

            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: '프로젝트 상태 별 일감 수를 조회했습니다.',
                results: results
            });
        }).catch((err) => {

            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: err
            });
        });
};