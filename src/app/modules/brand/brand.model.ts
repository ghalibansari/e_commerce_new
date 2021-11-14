import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 } from 'uuid';
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
        show_on_home_screen: { type: DataTypes.BOOLEAN, defaultValue: false },
        banner_image: { type: DataTypes.STRING, allowNull: true },
        show_on_header: { type: DataTypes.BOOLEAN, defaultValue: false },
        tag_id: { type: DataTypes.UUID },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

async function doStuffWithUserModel() {

    // await BrandMd.sync({ force: true })

    const newUser = await BrandMd.create({
        brand_id: v4(),
        brand_name: "myBrand",
        order_sequence: 11,
        show_on_home_screen: true,
        banner_image: "yahoo.com/la.img",
        show_on_header: true,
        created_by: v4(),
        updated_by: v4(),
    })
        .then(() => console.log("Created default Brand..."))
        .catch(e => console.log(e))
}



// doStuffWithUserModel();

export { BrandMd };

