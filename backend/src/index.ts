import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroOrmConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import RedisStore from "connect-redis"
import session from "express-session"
import { createClient } from 'redis';
import { MyContext } from './types';
import cors from 'cors';




// Ensure that the 'entities' property in mikroOrmConfig is not marked as 'readonly'

const main = async () => {
    // console.log('dirname: ', __dirname);

    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().up(); //run the migration before it does anything else

    // Fork the EntityManager for a specific context
    const em = orm.em.fork();
    // const post = em.create(Post, {title : 'my first post'});
    // await em.persistAndFlush(post);

    //find all posts from the Post table db
    // const posts = await em.find(Post, {}); // find all posts from the Post table db
    // console.log(posts); 


    // Create an instance of ApolloServer
    const app = express();

    // Trust the first proxy
    // setting app.set('trust proxy', true) (highly recommend only setting this for local dev, so perhaps app.set('trust proxy', process.env.NODE_ENV !== 'production') may be better)
    app.set('trust proxy', true); // Add this line



    app.use(
        '/graphql',
        
        cors<cors.CorsRequest>({
          origin: 'https://studio.apollographql.com',
          credentials: true,
        }),
      );



    // Initialize client.
    let redisClient = createClient()
    redisClient.connect().catch(console.error)

    // Initialize store.
    let redisStore = new RedisStore({
    client: redisClient,
    disableTouch: true,
    prefix: "myapp:",
    })

    // Initialize session storage.
    app.use(
    session({
        name: "qid",
        store: redisStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
            httpOnly: true, //canot access the cookie from the frontend
            sameSite: "none", // csrf
            secure: true // __prod__, // cookie only works in https  // uncomment this line in production
        },
        resave: false, // required: force lightweight session keep alive (touch)
        saveUninitialized: false, // recommended: only save session when data exists
        secret: "keyboard cat", // required: secret key used for signing cookies --> should be stored in .env
    }),
    )

    // The order of the middleware is important. It should be before the ApolloServer middleware.
    // Order of middleware is the order in which they will run!
    // Here the session middleware is run before the ApolloServer middleware.
    // This is important because the ApolloServer middleware needs to access the session data.



    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({req, res}): MyContext=> ({ em: em, req, res }) // pass the EntityManager to the context which is available to all resolvers
        }); //request lets us access the session data

    await apolloServer.start();

    apolloServer.applyMiddleware({ app, cors: false});

    app.listen(4000, () => {
        console.log('server started on localhost:4000');
    });
};

main().catch(err => console.error(err));

