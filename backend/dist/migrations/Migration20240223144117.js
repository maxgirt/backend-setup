"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20240223144117 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20240223144117 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "post" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
        this.addSql('alter table "post" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    }
    async down() {
        this.addSql('alter table "post" alter column "created_at" type date using ("created_at"::date);');
        this.addSql('alter table "post" alter column "updated_at" type date using ("updated_at"::date);');
    }
}
exports.Migration20240223144117 = Migration20240223144117;
//# sourceMappingURL=Migration20240223144117.js.map