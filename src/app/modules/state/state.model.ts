import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { CityMd } from '../city/city.model';
import { IMStates } from './state.types';


const StatesMd = DB.define<IMStates>(
    TableName.STATE_MASTER,
    {
        state_id: cloneDeep(modelCommonPrimaryKeyProperty),
        name: { allowNull: false, type: DataTypes.STRING },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

StatesMd.hasMany(CityMd, { foreignKey: 'state_id', as: 'cities' })
CityMd.belongsTo(StatesMd, { foreignKey: 'state_id', as: 'state', targetKey: 'state_id' })

export { StatesMd };

