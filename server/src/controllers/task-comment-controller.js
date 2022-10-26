const HttpStatus = require("http-status");
const { decodedToken } = require("../util/account-utils");
const TaskCommentService = require("../services/task-comment-service");


//일감 댓글 조회
exports.findTaskAllComments = async (req, res, next) => {
    const params = {
      taskCode: Number(req.params.taskCode)
    };
    const results = await TaskCommentService.findTaskAllComments(params);
    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: "일감 댓글 조회에 성공했습니다.",
      results: results,
    });

};

//일감 댓글 생성
exports.createTaskComment = async (req, res, next) => {
    const user = decodedToken(req.get("Access-Token"));
    // console.log("req.body", req.body);
    const taskNewComment = {
      taskCommentContent: req.body.taskCommentContent,
      taskCommentCreatedDate: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      taskCode: Number(req.body.taskCode),
      projectCode: Number(req.body.taskProjectCode),
      //   memberCode: Number(req.body.memberCode)
      memberCode: user.usercode,
    };
    const results = await TaskCommentService.createTaskComment(taskNewComment);

    res.status(HttpStatus.CREATED).json({
      status: HttpStatus.CREATED,
      message: "일감 댓글 생성에 성공했습니다.",
      results: results,
    });
};

// 일감 댓글 수정
exports.updateTaskComment = async (req, res, next) => {
    const user = decodedToken(req.get("Access-Token"));

    const updateTaskCommentContent = {
      taskCommentCode: Number(req.body.taskCommentCode),
      taskCommentContent: req.body.taskCommentContent,
      //   taskCommentContent: req.body.taskCommentContent,
      taskCommentModifiedDate: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      projectCode: Number(req.body.projectCode),
      //   memberCode: Number(req.body.memberCode),
      memberCode: user.usercode,
    };

    const results = await TaskCommentService.updateTaskComment(updateTaskCommentContent);

    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: "일감 댓글 수정에 성공했습니다.",
      results: results,
    });
};

// 일감 댓글 삭제
exports.deleteTaskComment = async (req, res, next) => {
    const user = decodedToken(req.get("Access-Token"));

    const removeTaskCommentRequest = {
      taskCommentCode: Number(req.body.taskCommentCode),
      taskDeletedDate: new Date().toLocaleDateString(),
      projectCode: Number(req.body.projectCode),
      // memberCode: Number(req.body.memberCode),
      memberCode: user.usercode,
    };

    const results = await TaskCommentService.deleteTaskComment(
      removeTaskCommentRequest
    );

    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: "일감 댓글 삭제에 성공했습니다.",
      results: results,
    });
};