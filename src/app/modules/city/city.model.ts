import { cloneDeep } from "lodash";
import { DataTypes } from "sequelize";
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from "../BaseModel";
import { PinCodeMd } from "../pincode/pincode.model";
import { IMCity } from "./city.types";


const CityMd = DB.define<IMCity>(
    TableName.CITY,
    {
        city_id: cloneDeep(modelCommonPrimaryKeyProperty),
        name: { allowNull: false, type: DataTypes.STRING },
        state_id: { allowNull: false, type: DataTypes.UUID },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

CityMd.hasMany(PinCodeMd, { foreignKey: 'city_id', as: 'pincodes' });
PinCodeMd.belongsTo(CityMd, { foreignKey: 'city_id', as: 'city', targetKey: "city_id" });

export { CityMd };


