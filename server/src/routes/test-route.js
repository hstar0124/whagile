const express = require('express');
const router = express.Router();
const TestController = require('../controllers/test-controller');
const { authJwt } = require("../middleware");

router.get(
    '/', 
    [authJwt.verifyToken],
    TestController.test
);


module.exports = router;