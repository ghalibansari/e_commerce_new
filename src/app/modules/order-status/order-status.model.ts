import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMOrderStatus } from './order-status.types';


const OrderStatusMd = DB.define<IMOrderStatus>(
    TableName.ORDER_STATUS,
    {
        status_id: cloneDeep(modelCommonPrimaryKeyProperty),
        title: { allowNull: false, type: DataTypes.STRING },
        description: { allowNull: false, type: DataTypes.STRING },
        sequence: { allowNull: false, type: DataTypes.NUMBER, },
        slug: { allowNull: false, type: DataTypes.STRING },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

export { OrderStatusMd };

