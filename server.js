const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const isAuth = require("./middleware/isAuth");

const graphqlSchema = require("./graphql/schema/qraphqlSchema");
const graphqlResolvers = require("./graphql/resolvers/graphqlResolvers");

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({req}),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(isAuth);


  server.applyMiddleware({
    app,
    path: "/",
  });

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    next();
  });

  await mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mealplan.l86yk.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  );

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(graphqlSchema, graphqlResolvers);

// USER 61503cd1d981d96c09fc57a5

// EXC1
// EXC2
// EXC3

// mutation {
//   createWorkout(workoutInput: {
//     date: "today",
//     length: 60,
//     details: [
//       {
//         exercise: "614f5b904f17b5614741e39e",
//         sets: 3,
//         repsPerSet: [12, 15, 15],
//         weightPerSet: [10, 15, 20]
//       },
//       { 
//         exercise: "614f5bb89db63ca30dfdcf10",
//         sets: 3,
//         repsPerSet: [11, 11, 11],
//         weightPerSet: [10, 15, 20]
//       },
//       {
//         exercise: "614f5bc7de67693c3b54d6f5",
//         sets: 3,
//         repsPerSet: [12, 15, 13],
//         weightPerSet: [12, 12, 22]
//       },
//     ]
//   }) {
//     _id
//     date
//     length
//     details {
//       sets
//       repsPerSet
//       weightPerSet
//     }
//   }
// }

// query {
//   workouts {
//     _id
//     date
//     length
//     details {
//       exercise {
//         _id
//         name
//         targetBodyPart
//         targetMuscle
//       }
//       sets
//       repsPerSet
//       weightPerSet
//     }
//   }
// }
