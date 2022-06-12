import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMPinCode } from './pincode.types';


const PinCodeMd = DB.define<IMPinCode>(
    TableName.PIN_CODE_MASTER,
    {
        pincode_id: cloneDeep(modelCommonPrimaryKeyProperty),
        city_id: { allowNull: false, type: DataTypes.UUID },
        area_name: { allowNull: false, type: DataTypes.TEXT },
        pincode: { allowNull: false, type: DataTypes.INTEGER },
        shipping_charges : { allowNull: false, type: DataTypes.INTEGER },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

export { PinCodeMd };

