var express = require("express"),
    router = express.Router();

router.get("/dashboard", function(req, res, next) {
    res.render("dashboard");
});


router.get("/individual", function(req, res, next) {
    res.render("individual");
});

router.get("/test", function(req, res, next) {
    res.render("test", {
        layout: false,
    });
});

module.exports = router;
