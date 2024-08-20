const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: Boolean, required: true, default: true },
});

module.exports = mongoose.model("Task", TaskSchema);
