import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMBanner } from "./banner.types";


const BannerMd = DB.define<IMBanner>(
    TableName.BANNER,
    {
        banner_id: cloneDeep(modelCommonPrimaryKeyProperty),
        banner_text: { allowNull: false, type: DataTypes.STRING },
        order_sequence: { allowNull: false, type: DataTypes.INTEGER },
        show_on_home_screen: { type: DataTypes.BOOLEAN, defaultValue: true },
        banner_image: { type: DataTypes.STRING, allowNull: true },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

async function doStuffWithUserModel() {
    // await BannerMd.sync({ force: true });

    const newUser = await BannerMd.create({
        banner_id: uuidv4(),
        banner_text: "myBanner",
        order_sequence: 1334,
        show_on_home_screen: true,
        banner_image: "qwertyuiopvbnm,mnbvcvbnm,lkjhgfdsazxcvbnm",
        created_by: uuidv4(),
        updated_by: uuidv4()
    })
        .then(() => console.log("Created default banner..."))
        .catch(e => console.log(e))
}

// doStuffWithUserModel();

export { BannerMd };

