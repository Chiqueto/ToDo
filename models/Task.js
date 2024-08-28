const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, maxlength: 200 },
  date: { type: Date, required: true },
  status: { type: Boolean, required: true, default: true },
});

module.exports = mongoose.model("Task", TaskSchema);
