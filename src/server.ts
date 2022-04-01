import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import Express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { connect } from 'mongoose';

import { UserResolver } from './resolvers/User';
import { ProductResolver } from './resolvers/Product';
import { CategoriesResolver } from './resolvers/Categories';
import { CartResolver } from './resolvers/Cart';
import { OrderResolver } from './resolvers/Order';

const main = async () => {
  const schema = await buildSchema({
    resolvers: [
      CategoriesResolver,
      ProductResolver,
      UserResolver,
      CartResolver,
      OrderResolver,
    ],
    emitSchemaFile: true,
    validate: false,
  });

  // create mongoose connection
  connect(
    'mongodb://192.168.0.160:27018/graphql_typegoose?authSource=admin',
    {
      auth: {
        authSource: 'admin'
      } as any,
      user: 'admin',
      pass: 'dev102030'
    }, (data) => {
      console.log('conectado ao banco', data);

    });
  // await mongoose.connection;

  const server: any = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  });

  const app = Express();

  await server.start();

  server.applyMiddleware({ app });

  app.listen({ port: 3333 }, () =>
    console.log(
      `🚀 Server ready and listening at ==> http://localhost:3333${server.graphqlPath}`
    )
  );
};

main().catch((error) => {
  console.log(error, 'error');
});
