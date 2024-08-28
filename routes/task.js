var express = require("express");
const Task = require("../models/Task");
var router = express.Router();
const { format } = require("date-fns");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const onlyToDo = req.query.isOnlyToDo === 'true';
  try {
    let tasks
    onlyToDo ?  tasks = await Task.find({ status: true }) : tasks = await Task.find()
    
    console.log(tasks);
    res.render("index", {
      tasks,
      format
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/taskInsert", (req, res) => {
  const today = format(new Date(), 'yyyy-MM-dd')
  res.render("task", {
    title: "Insert New Task!",
    btnName: "Insert",
    task: null,
    action: "/addTask",
    today
  });
});

router.get("/taskEdit/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const today = format(new Date(), 'yyyy-MM-dd')
    res.render("task", {
      title: "Change Task Informations!",
      btnName: "Edit",
      task,
      format,
      action: `/update/${req.params.id}`,
      today
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/update/:id", async (req, res) => {
  const { name, description, date } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(req.params.id);
    task.name = name
    task.description = description.trim();
    task.date = date;
    task.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err.message);
  }
});


router.get("/delete/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send("Task não encontrada");
    }
    res.redirect("/"); // redirecione para a lista de clientes após deletar
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/addTask", async (req, res) => {
  const { name, description, date } = req.body;
  try {
    const descriptionFormated = description.trim()
    const adjustedDate = new Date(date);
    adjustedDate.setUTCHours(12, 0, 0, 0);
    const newTask = new Task({ name, description:descriptionFormated, date:adjustedDate });
    await newTask.save();
    console.log(`Nova tarefa ${newTask.description} cadastrado com sucesso!`);
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/taskComplete/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id);
    task.status = false;
    task.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
