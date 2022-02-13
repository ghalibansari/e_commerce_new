import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { ProductMd } from '../products/product.model';
import { IMUnitMaster } from './unit-master.type';


const UnitMasterMd = DB.define<IMUnitMaster>(
    TableName.unit_master,
    {
        unit_id: cloneDeep(modelCommonPrimaryKeyProperty),
        name: { type: DataTypes.TEXT, allowNull: false },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);


UnitMasterMd.hasMany(ProductMd, { foreignKey: 'unit_id', as: 'products' });
ProductMd.belongsTo(UnitMasterMd, { foreignKey: 'unit_id', as: 'unit', targetKey: "unit_id" });

export { UnitMasterMd };

