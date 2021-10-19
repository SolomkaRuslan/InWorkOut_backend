const Workout = require("../../models/workout");
const Exercise = require("../../models/exercise");
const User = require("../../models/user");

module.exports = {
  Query: {
    exercises: async (parent, args, { req }) => {
      try {
        console.log("Getting exercises");

        if (!req.isAuth) throw new Error("Please log in first");

        const creatorUser = await User.findById(req.userId);
        if (!creatorUser) throw new Error("User does not exist");

        const exercises = await Exercise.find({
          _id: { $in: creatorUser.userExercises },
        });

        return exercises.map((exc) => {
          return { ...exc._doc };
        });
      } catch (err) {
        throw err;
      }
    },
  },

  Mutation: {
    createExercise: async (parent, args, { req }) => {
      try {
        console.log("Creating exercise");

        if (!req.isAuth) throw new Error("Please log in first");

        const creatorUser = await User.findById(req.userId);
        if (!creatorUser) throw new Error("User does not exist");

        const exercise = new Exercise({
          name: args.exerciseInput.name,
          targetBodyPart: args.exerciseInput.targetBodyPart,
          targetMuscle: args.exerciseInput.targetMuscle,
          creatorUser: req.userId,
        });
        await exercise.save();

        creatorUser.userExercises.push(exercise);
        await creatorUser.save();

        return { ...exercise._doc };
      } catch (err) {
        throw err;
      }
    },

    updateExercise: async (parent, args, { req }) => {
      try {
        console.log("Updating exercise");

        if (!req.isAuth) throw new Error("Please log in first");

        const updatedExercise = await Exercise.findById(args.id);
        if (!updatedExercise) throw new Error("Cant Fint Exercise by Id");

        updatedExercise.name = args.exerciseInput.name;
        updatedExercise.targetBodyPart = args.exerciseInput.targetBodyPart;
        updatedExercise.targetMuscle = args.exerciseInput.targetMuscle;

        await updatedExercise.save();
        return { ...updatedExercise._doc };
      } catch (err) {
        throw err;
      }
    },

    deleteExercise: async (parent, args, { req }) => {
      try {
        console.log("Deleting exercise");

        if (!req.isAuth) throw new Error("Please log in first");

        const creatorUser = await User.findById(req.userId).populate(
          "userWorkouts"
        );
        if (!creatorUser) throw new Error("User does not exist");

        const deletedExercise = await Exercise.findByIdAndDelete(args.id);

        if (creatorUser.userExercises.includes(args.id)) {
          creatorUser.userExercises.splice(
            creatorUser.userExercises.indexOf(args.id),
            1
          );
        }

        creatorUser.userWorkouts.forEach(async (workout) => {
          workout.details = workout.details.filter((d) => {
            return args.id !== d.exercise.toString();
          });
          if (workout.details.length < 1) {
            creatorUser.userWorkouts.splice(
              creatorUser.userWorkouts.indexOf(workout),
              1
            );
            await Workout.findByIdAndDelete(workout._id);
          } else {
            await workout.save();
          }
        });

        await creatorUser.save();
        return deletedExercise;
      } catch (err) {
        throw err;
      }
    },
  },
};
