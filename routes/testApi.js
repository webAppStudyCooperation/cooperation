var express = require("express");
var router = express.Router();
const db = require('./../db'); // db 모듈 추가

router.get("/boards", function (req, res, next) {
    db.getAllBoard((rows) => {
        res.status('200').json(rows)
    })
});

module.exports = router;
