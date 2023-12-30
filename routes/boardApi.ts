var express = require("express");
var router = express.Router();
const db = require('./db/db'); // db 모듈 추가

router.get("/boards", function (req, res, next) {
    db.getAllBoard((rows) => {
        res.status('200').json(rows)
    })
});

router.post("/addBoard", function (req, res, next) {
    res.status(500)
    db.getAllBoard((rows) => {
        res.status('200').json(rows)
    })
});


module.exports = router;