"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize("postgres://lcfxmnrq:X6HSV_8HDi3YiIZfpfUIVHXI7L6gojFM@fanny.db.elephantsql.com/lcfxmnrq");
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    preferredName: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
}, {
    tableName: "users",
    sequelize,
});
async function doStuffWithUserModel() {
    await sequelize.sync({ force: true });
    const newUser = await User.create({
        name: "Johnny",
        preferredName: "John",
    });
    console.log(newUser.id, newUser.name, newUser.preferredName);
    const foundUser = await User.findOne({ where: { name: "Johnny" } });
    if (foundUser === null)
        return;
    console.log(foundUser.name);
}
doStuffWithUserModel();
//# sourceMappingURL=ModelInitNoAttributes.js.map