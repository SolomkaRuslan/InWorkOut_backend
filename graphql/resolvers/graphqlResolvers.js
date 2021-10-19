const userResolver = require("./userResolver");
const exerciseResolver = require("./exerciseResolver");
const workoutResolver = require("./workoutResolver");

module.exports = {
  Query: {
    ...userResolver.Query,
    ...exerciseResolver.Query,
    ...workoutResolver.Query,
  },

  Mutation: {
    ...userResolver.Mutation,
    ...exerciseResolver.Mutation,
    ...workoutResolver.Mutation,
  },
};
