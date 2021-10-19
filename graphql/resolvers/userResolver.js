const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  Query: {
    login: async (parent, { loginInput }) => {
      console.log("Loggin In", loginInput.email, loginInput.password);
      try {
        const existingUser = await User.findOne({ email: loginInput.email });
        if (!existingUser) throw new Error("Bad Email!");

        const isEqual = await bcrypt.compare(
          loginInput.password,
          existingUser.password
        );
        if (!isEqual) throw new Error("Bad Password!");

        const token = jwt.sign(
          { userId: existingUser.id },
          "HelloPleaseDontTryToHackMyLittleWebsiteAndTheWorldWillBeABetterPlaceLol123"
        );

        return { token: token, name: existingUser.name };
      } catch (err) {
        throw err;
      }
    },
  },

  Mutation: {
    createUser: async (parent, args) => {
      console.log("Registering", args.userInput);
      try {
        const existingUser = await User.findOne({
          email: args.userInput.email,
        });
        if (existingUser) throw new Error("User already exist");

        const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

        const user = new User({
          name: args.userInput.name,
          email: args.userInput.email,
          password: hashedPassword,
          userExercises: [],
          userWorkouts: [],
        });

        await user.save();

        return user.email;
      } catch (err) {
        throw err;
      }
    },
  },
};
