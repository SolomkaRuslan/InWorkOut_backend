const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exerciseSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  targetBodyPart: {
    type: String,
    required: true,
  },
  targetMuscle: {
    type: String,
    required: false,
  },
  creatorUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Exercise", exerciseSchema);
