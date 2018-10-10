var express = require("express"),
    router = express.Router();

router.get("/dashboard", function(req, res, next) {
    res.render("dashboard");
});

router.get("/test", function(req, res, next) {
    res.render("test", {
        layout: false,
    });
});

module.exports = router;
