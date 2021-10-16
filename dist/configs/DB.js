"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = exports.Sequelize = void 0;
const sequelize_1 = require("sequelize");
Object.defineProperty(exports, "Sequelize", { enumerable: true, get: function () { return sequelize_1.Sequelize; } });
const env = process.env.NODE_ENV || 'development';
const config = { url: "postgres://lcfxmnrq:X6HSV_8HDi3YiIZfpfUIVHXI7L6gojFM@fanny.db.elephantsql.com/lcfxmnrq" };
const DB = new sequelize_1.Sequelize(config.url, { pool: { max: 4 } });
exports.DB = DB;
//# sourceMappingURL=DB.js.map