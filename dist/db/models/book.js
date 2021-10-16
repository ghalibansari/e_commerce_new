"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const DB_1 = require("../../configs/DB");
const author_1 = __importDefault(require("./author"));
const Book = DB_1.DB.define('Book', {
    id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: sequelize_1.DataTypes.UUID,
        unique: true,
    },
    title: {
        allowNull: true,
        type: sequelize_1.DataTypes.TEXT,
    },
    numberOfPages: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
    authorId: {
        allowNull: true,
        type: sequelize_1.DataTypes.UUID,
    },
});
Book.belongsTo(author_1.default, {
    foreignKey: 'authorId',
    as: 'author'
});
exports.default = Book;
//# sourceMappingURL=book.js.map