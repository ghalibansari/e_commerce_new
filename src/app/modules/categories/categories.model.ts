import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions } from '../BaseModel';
import { IMCategories } from './categories.type';


const CategoriesMd = DB.define<IMCategories>(
    TableName.CATEGORIES,
    {
        category_id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: () => uuidv4()
        },
        category_name: { allowNull: false, type: DataTypes.STRING },
        parent_id: { type: DataTypes.UUID, defaultValue: null },
        order_sequence: { allowNull: false, type: DataTypes.INTEGER },
        show_on_homeScreen: { allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false },
        category_image: { allowNull: false, type: DataTypes.STRING, },
        ...modelCommonColumns
    },
    modelCommonOptions
);

async function doStuffWithUserModel() {
    await CategoriesMd.sync()
    // await UserMd.sync({ force: true })
    const id = uuidv4()

    const newUser = await CategoriesMd.create({
        category_id: id,
        category_name: "demo",
        parent_id: id,
        order_sequence: 78992338,
        show_on_homeScreen: true,
        category_image: "demo",
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created default user..."))
        .catch(e => console.log(e))
    // console.log(newUser);
}

// doStuffWithUserModel()
//categoriesMd.sync()

export { CategoriesMd };

