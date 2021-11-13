import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMBrand } from './brand.types';

const BrandMd = DB.define<IMBrand>(
    TableName.BRAND,
    {
        brand_id: cloneDeep(modelCommonPrimaryKeyProperty),
        brand_name: { allowNull: false, type: DataTypes.STRING },
        order_sequence: { allowNull: false, type: DataTypes.INTEGER },
        show_on_homescreen: { type: DataTypes.BOOLEAN },
        banner_image: { type: DataTypes.STRING, allowNull: true },
        show_on_header: { type: DataTypes.BOOLEAN },
        tag_id: { type: DataTypes.UUID },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

async function doStuffWithUserModel() {

    await BrandMd.sync({ force: true })

    const newUser = await BrandMd.create({
        brand_id: uuidv4(),
        brand_name: "myBrand",
        order_sequence: 12,
        show_on_homescreen: true,
        banner_image: "qwertyuiopdfghjkllkjhgfdsazxcvbnm",
        created_by: uuidv4(),
        updated_by: uuidv4(),
    })
        .then(() => console.log("Created default Brand..."))
        .catch(e => console.log(e))
}

// BrandsMd.belongsTo(BannerMd, {
//     foreignKey: 'banner_id',
//     as: 'banner'
// })

// doStuffWithUserModel();

export { BrandMd };

