import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
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
        link_to: { type: DataTypes.STRING, allowNull: false },
        link_id: { type: DataTypes.UUID, allowNull: false },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

export { BannerMd };

