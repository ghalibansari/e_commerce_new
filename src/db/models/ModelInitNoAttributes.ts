import { Sequelize, Model, DataTypes, Optional } from "sequelize";

const sequelize = new Sequelize("postgres://lcfxmnrq:X6HSV_8HDi3YiIZfpfUIVHXI7L6gojFM@fanny.db.elephantsql.com/lcfxmnrq");

interface IUser {
    id: number;
    name: string;
    preferredName: string | null;
}

interface IUserCreationAttributes extends Optional<IUser, 'id'> { }

class User extends Model<IUser, IUserCreationAttributes> {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public name!: string;
    public preferredName!: string | null; // for nullable fields
    public createdAt?: Date
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        preferredName: {
            type: new DataTypes.STRING(128),
            allowNull: true,
        },
    },
    {
        tableName: "users",
        sequelize, // passing the `sequelize` instance is required
    }
);

async function doStuffWithUserModel() {
    await sequelize.sync({ force: true })
    const newUser: IUser = await User.create({
        name: "Johnny",
        preferredName: "John",
    });
    console.log(newUser.id, newUser.name, newUser.preferredName);

    const foundUser = await User.findOne({ where: { name: "Johnny" } });
    if (foundUser === null) return;
    console.log(foundUser.name);
}

doStuffWithUserModel();