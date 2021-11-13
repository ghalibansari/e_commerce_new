import { cloneDeep } from "lodash";
import { DataTypes } from "sequelize";
import { createModuleResolutionCache } from "typescript";
import { v4 as uuidv4 } from "uuid";
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from "../BaseModel";
import { IMCity } from "./city.types";


const CityMd = DB.define<IMCity>(
    TableName.CITY,
    {
        city_id: cloneDeep(modelCommonPrimaryKeyProperty),
        name: { allowNull: false, type: DataTypes.STRING },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
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


