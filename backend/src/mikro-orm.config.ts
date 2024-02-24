import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";


export default {
    migrations: {
        path: path.join(__dirname, './migrations'), // path to the folder with migrations
        pathTs: 'src/migrations', // path to the folder with migration typescript files
        glob: '!(*.d).{js,ts}', // allow both .js and .ts files
    },
    entities : [Post, User],
    dbName : 'reddit',
    extensions: [Migrator],
    user : 'postgres',
    password : '@Dolata2517',
    driver : PostgreSqlDriver,
    debug : !__prod__,
}as Parameters<typeof MikroORM.init>[0];
// we got the type that init expects from the MikroORM.init function and we are going to use that as the type for our config object.