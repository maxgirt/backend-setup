"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20240223140500 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20240223140500 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "post" ("id" serial primary key, "created_at" date not null, "updated_at" date not null, "title" text not null);');
    }
    async down() {
        this.addSql('drop table if exists "post" cascade;');
    }
}
exports.Migration20240223140500 = Migration20240223140500;
//# sourceMappingURL=Migration20240223140500.js.map