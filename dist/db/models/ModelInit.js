"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize("postgres://lcfxmnrq:X6HSV_8HDi3YiIZfpfUIVHXI7L6gojFM@fanny.db.elephantsql.com/lcfxmnrq");
class User extends sequelize_1.Model {
}
class Project extends sequelize_1.Model {
}
class Address extends sequelize_1.Model {
}
;
Project.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ownerId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: "projects",
});
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
Address.init({
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    address: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
}, {
    tableName: "address",
    sequelize,
});
const Note = sequelize.define('Note', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: new sequelize_1.DataTypes.STRING(64),
        defaultValue: 'Unnamed Note',
    },
    content: {
        type: new sequelize_1.DataTypes.STRING(4096),
        allowNull: false,
    },
}, {
    tableName: 'notes',
});
User.hasMany(Project, {
    sourceKey: "id",
    foreignKey: "ownerId",
    as: "projects",
});
Address.belongsTo(User, { targetKey: "id" });
User.hasOne(Address, { sourceKey: "id" });
async function doStuffWithUser() {
    await sequelize.sync({ force: true });
    const newUser = await User.create({
        name: "Johnny",
        preferredName: "John",
    });
    console.log(newUser.id, newUser.name, newUser.preferredName);
    const project = await newUser.createProject({
        name: "first!",
    });
    const ourUser = await User.findByPk(1, {
        include: [User.associations.projects],
        rejectOnEmpty: true,
    });
    console.log(ourUser.projects[0].name);
}
doStuffWithUser();
//# sourceMappingURL=ModelInit.js.map