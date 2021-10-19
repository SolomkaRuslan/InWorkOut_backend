const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userExercises: [
    {
      type: Schema.Types.ObjectId,
      ref: "Exercise",
    },
  ],
  userWorkouts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Workout",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
