var express = require("express");
const Task = require("../models/Task");
var router = express.Router();
const { format } = require("date-fns");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const {onlyToDo, sortBy, sortOrder} = req.query
  const today = new Date()
  const urlParams = req.originalUrl;
  try {

    let tasks = await Task.find()
    
    if (onlyToDo === 'true') {
      tasks = tasks.filter(task => task.status === true);
    }
    // Ordenação
    if (sortBy === 'name') {
        tasks.sort((a, b) => sortOrder === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
    } else if (sortBy === 'date') {
        tasks.sort((a, b) => sortOrder === 'desc' ? b.date - a.date : a.date - b.date);
    }
    res.render("index", {
      tasks,
      format,
      today,
      urlParams
    }); 
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/taskInsert", (req, res) => {
  const today = format(new Date(), 'yyyy-MM-dd')
  const mode = 'insert'
  res.render("task", {
    title: "Insert New Task!",
    btnName: "Insert",
    task: null,
    action: "/addTask",
    today,
    mode
  });
});

router.get("/taskEdit/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const today = format(new Date(), 'yyyy-MM-dd')
    const mode = 'edit'
    res.render("task", {
      title: "Change Task Informations!",
      btnName: "Edit",
      task,
      format,
      action: `/update/${req.params.id}`,
      today,
      mode
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

router.get("/taskView/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const today = format(new Date(), 'yyyy-MM-dd')
    const mode = 'view'
    res.render("task", {
      title: "View Task Informations!",
      btnName: "Confirm",
      task,
      format,
      action: "/",
      mode,
      today
    });
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
