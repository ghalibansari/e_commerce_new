import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { ProductMd } from '../products/product.model';
import { IMBrand } from './brand.types';

const BrandMd = DB.define<IMBrand>(
    TableName.BRAND,
    {
        brand_id: cloneDeep(modelCommonPrimaryKeyProperty),
        brand_name: { allowNull: false, type: DataTypes.STRING },
        order_sequence: { allowNull: false, type: DataTypes.INTEGER },
        show_on_home_screen: { type: DataTypes.BOOLEAN, defaultValue: false },
        brand_image: { type: DataTypes.STRING, allowNull: true },
        show_on_header: { type: DataTypes.BOOLEAN, defaultValue: false },
        tag_id: { type: DataTypes.UUID },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

BrandMd.hasMany(ProductMd, { foreignKey: 'brand_id', as: 'products' });
ProductMd.belongsTo(BrandMd, { foreignKey: 'brand_id', as: 'brand', targetKey: "brand_id" });

// async function doStuffWithUserModel() {

//     // await BrandMd.sync({ force: true })
//     // await ProductMd.sync({force: true})

//     const newUser = await BrandMd.create({
//         brand_id: v4(),
//         brand_name: "myBrand",
//         order_sequence: 11,
//         show_on_home_screen: true,
//         brand_image: "yahoo.com/la.img",
//         show_on_header: true,
//         created_by: v4(),
//         updated_by: v4(),
//     })
//         .then(() => console.log("Created default Brand..."))
//         .catch(e => console.log(e))
// }



// doStuffWithUserModel();

export { BrandMd };

