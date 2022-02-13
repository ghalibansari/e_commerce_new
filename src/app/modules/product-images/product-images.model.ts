import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMImage } from './product-images.type';


const ProductImagesMd = DB.define<IMImage>(
    TableName.PRODUCT_IMAGES,
    {
        image_id: cloneDeep(modelCommonPrimaryKeyProperty),
        product_id: { type: DataTypes.UUID, },
        image_URL: { allowNull: false, type: DataTypes.STRING },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

export { ProductImagesMd };

