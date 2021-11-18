import { cloneDeep } from "lodash";
import { DataTypes } from "sequelize";
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

// UserMd.hasMany(UserAddressMd, { foreignKey: 'user_id', as: 'addresses' });
// UserAddressMd.belongsTo(UserMd, { foreignKey: "user_id", as: "user", targetKey: "user_id" })

// CityMd.hasOne(StatesMd, { foreignKey: 'state_id', as: 'cities' })
// StatesMd.belongsTo(CityMd, { foreignKey: 'state_id', as: 'state', targetKey: 'state_id' })

async function doStuffWithUserModel() {

    console.log('doStuffWithUserModel')
    // await CityMd.sync({ force: true })
    // await StatesMd.sync({ force: true })
    const id = uuidv4()

    const newUser = await CityMd.create({
        city_id: id,
        name: "Palghar",
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created default user..."))
        .catch(e => console.log(e))
    // console.log(newUser);
}

// doStuffWithUserModel()

export { CityMd };


