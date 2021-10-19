const Workout = require("../../models/workout");
const User = require("../../models/user");

module.exports = {
  Query: {
    workouts: async (parent, args, { req }) => {
      try {
        console.log("Getting workouts");

        if (!req.isAuth) throw new Error("Please log in first");

        const creatorUser = await User.findById(req.userId);
        if (!creatorUser) throw new Error("User does not exist");

        const workouts = await Workout.find({
          _id: { $in: creatorUser.userWorkouts },
        }).populate("details.exercise");

        return workouts.map((wrk) => {
          return { ...wrk._doc };
        });
      } catch (err) {
        throw err;
      }
    },
  },

  Mutation: {
    createWorkout: async (parent, args, { req }) => {
      console.log("Creating Workout");
      try {
        if (!req.isAuth) throw new Error("Please log in first");

        const creatorUser = await User.findById(req.userId);
        if (!creatorUser) throw new Error("User does not exist");

        const workout = new Workout({
          date: args.workoutInput.date,
          length: args.workoutInput.length,
          creatorUser: req.userId,
          details: args.workoutInput.details,
        });
        await workout.save();

        creatorUser.userWorkouts.push(workout);
        await creatorUser.save();

        return { ...workout._doc };
      } catch (err) {
        throw err;
      }
    },

    deleteWorkout: async (parent, args, { req }) => {
      try {
        console.log("Deleting workout");
        if (!req.isAuth) throw new Error("Please log in first");

        const creatorUser = await User.findById(req.userId);
        if (!creatorUser) throw new Error("User does not exist");

        const deletedWorkout = Workout.findByIdAndDelete(args.id);

        if (creatorUser.userWorkouts.includes(args.id)) {
          creatorUser.userWorkouts.splice(
            creatorUser.userWorkouts.indexOf(args.id),
            1
          );
        }

        await creatorUser.save();
        return deletedWorkout;
      } catch (err) {
        throw err;
      }
    },
  },
};
