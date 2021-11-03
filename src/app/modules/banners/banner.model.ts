import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions } from '../BaseModel';
import { IMBanner } from "./banner.types";


const bannerMd = DB.define<IMBanner>(
    TableName.BANNER,
    {
        banner_id: {
            allowNull: false, autoIncrement: false, primaryKey: true,
            type: DataTypes.UUID, defaultValue: () => uuidv4()
        },
        banner_text: { allowNull: false, type: DataTypes.STRING },
        order_sequence: { allowNull: false, type: DataTypes.INTEGER },
        show_on_homescreen: { allowNull: false, type: DataTypes.BOOLEAN },
        banner_image: { type: DataTypes.STRING, allowNull: true },
        ...modelCommonColumns
    },
    modelCommonOptions
);

async function doStuffWithUserModel() {
    //await bannerMd.sync()

    const newUser = await bannerMd.create({
        banner_id: uuidv4(),
        banner_text: "myBanner",
        order_sequence: 1334,
        show_on_homescreen: true,
        banner_image: "qwertyuiopvbnm,mnbvcvbnm,lkjhgfdsazxcvbnm",
        created_by: uuidv4(),
        updated_by: uuidv4()
    })
        .then(() => console.log("Created default banner..."))
        .catch(e => console.log(e))
}

//doStuffWithUserModel();

export { bannerMd };

