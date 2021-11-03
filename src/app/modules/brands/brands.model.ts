import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { BannerMd } from '../banners/banner.model';
import { modelCommonColumns, modelCommonOptions } from '../BaseModel';
import { IMBrands } from "./brands.types";

const BrandsMd = DB.define<IMBrands>(
    TableName.BRAND,
    {
        brand_id: {
            allowNull: false, autoIncrement: false, primaryKey: true,
            type: DataTypes.UUID, defaultValue: () => uuidv4()
        },
        brand_name: { allowNull: false, type: DataTypes.STRING },
        order_sequence: { allowNull: false, type: DataTypes.INTEGER },
        show_on_homescreen: { allowNull: false, type: DataTypes.BOOLEAN },
        banner_image: { type: DataTypes.STRING, allowNull: true },
        ...modelCommonColumns
    },
    modelCommonOptions
);

async function doStuffWithUserModel() {

    // await brandsMd.sync()

    const newUser = await BrandsMd.create({
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

BrandsMd.belongsTo(BannerMd, {
    foreignKey: 'banner_id',
    as: 'banner'
})

//doStuffWithUserModel();

export { BrandsMd };
