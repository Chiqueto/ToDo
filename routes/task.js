var express = require("express");
const Task = require("../models/Task");
var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const tasks = await Task.find();
    console.log(tasks);
    res.render("index", { tasks });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/task", (req, res) => {
  res.render("task");
});

router.post("/addTask", async (req, res) => {
  const { description, date } = req.body;
  try {
    const newTask = new Task({ description, date });
    await newTask.save();
    console.log(`Novo cliente ${newTask.description} cadastrado com sucesso!`);
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
