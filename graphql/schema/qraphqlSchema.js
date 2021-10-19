const { gql } = require("apollo-server-express");

module.exports = gql`
  type Exercise {
    _id: ID!
    name: String!
    targetBodyPart: String!
    targetMuscle: String!
    creatorUser: User!
  }

  input ExerciseInput {
    name: String!
    targetBodyPart: String!
    targetMuscle: String
  }

  type WorkoutDetails {
    exercise: Exercise!
    sets: Int!
    reps: Int!
    maxWeight: Int!
    _id: ID!
  }

  input WorkoutDetailsInput {
    exercise: String!
    sets: Int!
    reps: Int!
    maxWeight: Int!
  }

  type Workout {
    _id: ID!
    date: String!
    length: Int!
    details: [WorkoutDetails!]!
    creatorUser: User!
  }

  input WorkoutInput {
    date: String!
    length: Int!
    details: [WorkoutDetailsInput!]!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
    userExercises: [Exercise]!
    userWorkouts: [Workout]!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type LoginData {
    token: String!
    name: String!
  }

  type Query {
    login(loginInput: LoginInput): LoginData
    exercises: [Exercise!]!
    workouts: [Workout!]!
  }

  type Mutation {
    createUser(userInput: UserInput): String
    createExercise(exerciseInput: ExerciseInput): Exercise
    updateExercise(id: String!, exerciseInput: ExerciseInput): Exercise
    deleteExercise(id: String!): Exercise
    createWorkout(workoutInput: WorkoutInput): Workout
    deleteWorkout(id: String!): Workout
  }
`;
