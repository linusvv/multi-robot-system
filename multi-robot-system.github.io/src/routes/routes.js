//routes for rendering pages

var express = require("express");

var router = express.Router();

router.get("/", function (req, res) {
  // console.log("hello I'm on the start page");
  res.render("../views/home/index.ejs");
});
router.get("/exchange", function (req, res) {
  // console.log("hello I'm on the start page");
  res.render("../views/home/exchange.ejs");
});
router.get("/start", function (req, res) {
  // console.log("hello I'm on the start page");
  res.render("../views/home/start.ejs");
});
router.get("/end", function (req, res) {
  // console.log("hello I'm on the start page");
  res.render("../views/home/end.ejs");
});
router.get("/summary", function (req, res) {
  // console.log("hello I'm on the start page");
  res.render("../views/home/summary.ejs");
});
router.get("/run", function (req, res) {
  // console.log("hello I'm on the start page");
  res.render("../views/home/run.ejs");
});
router.get("/calculating", function (req, res) {
  // console.log("hello I'm on the start page");
  res.render("../views/home/calculating.ejs");
});

module.exports = router;
