"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const sequelize_1 = require("sequelize");
const DB_1 = require("../../../configs/DB");
const uuid_1 = require("uuid");
const UserMd = DB_1.DB.define(constants_1.TableName.USER, {
    user_id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: sequelize_1.DataTypes.UUID,
        defaultValue: () => (0, uuid_1.v4)()
    },
    first_name: {
        allowNull: false,
        type: sequelize_1.DataTypes.TEXT,
    },
    last_name: {
        allowNull: false,
        type: sequelize_1.DataTypes.TEXT,
    },
    mobile: {
        allowNull: false,
        unique: true,
        type: sequelize_1.DataTypes.TEXT,
    },
    email: {
        allowNull: false,
        unique: true,
        type: sequelize_1.DataTypes.TEXT,
    },
    password: {
        allowNull: false,
        type: sequelize_1.DataTypes.TEXT,
    },
    created_by: {
        allowNull: false,
        type: sequelize_1.DataTypes.UUID,
    },
    updated_by: {
        allowNull: false,
        type: sequelize_1.DataTypes.UUID,
    },
    deleted_by: {
        allowNull: true,
        type: sequelize_1.DataTypes.UUID,
    },
}, {
    timestamps: true,
    paranoid: true,
    createdAt: 'created_on',
    updatedAt: 'updated_on',
    deletedAt: 'deleted_on'
});
async function doStuffWithUserModel() {
    const newUser = await UserMd.create({
        "first_name": "Yo",
        "last_name": "John",
        "mobile": 8754219635,
        "email": "email",
        "password": "ddd",
        "created_by": "c1cc539a-caaa-4738-a4af-a1a39c9edc2d",
        "updated_by": "c1cc539a-caaa-4738-a4af-a1a39c9edc2c"
    });
}
exports.default = UserMd;
//# sourceMappingURL=user.model.js.map