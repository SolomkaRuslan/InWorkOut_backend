const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workoutSchema = Schema({
  date: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  details: [
    {
      exercise: {
        type: Schema.Types.ObjectId,
        ref: "Exercise",
      },
      sets: {
        type: Number,
        required: true,
      },
      reps: {
        type: Number,
        required: true,
      },
      maxWeight: {
        type: Number,
        required: true,
      },
    },
  ],

  creatorUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Workout", workoutSchema);
