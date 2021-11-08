import { DataTypes } from "sequelize";
import { createModuleResolutionCache } from "typescript";
import { v4 as uuidv4 } from "uuid";
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonOptions, modelCommonColumns } from "../BaseModel";
import { IMCity } from "./city.types";


const CityMd = DB.define<IMCity>(
    TableName.CITY,
    {
        city_id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: () => uuidv4()
        },
        name: { allowNull: false, type: DataTypes.STRING },
        ...modelCommonColumns
    },
    modelCommonOptions
);

async function doStuffWithUserModel() {

console.log('doStuffWithUserModel')
    // await CityMd.sync({ force: true })
    const id = uuidv4()

    const newUser = await CityMd.create({
        city_id: id,
        name: "Mumbai",
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created default user..."))
        .catch(e => console.log(e))
    // console.log(newUser);
}

// doStuffWithUserModel()

export { CityMd };


