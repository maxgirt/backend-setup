"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const path_1 = __importDefault(require("path"));
const postgresql_1 = require("@mikro-orm/postgresql");
const migrations_1 = require("@mikro-orm/migrations");
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, './migrations'),
        pathTs: 'src/migrations',
        glob: '!(*.d).{js,ts}',
    },
    entities: [Post_1.Post, User_1.User],
    dbName: 'reddit',
    extensions: [migrations_1.Migrator],
    user: 'postgres',
    password: '@Dolata2517',
    driver: postgresql_1.PostgreSqlDriver,
    debug: !constants_1.__prod__,
};
//# sourceMappingURL=mikro-orm.config.js.map