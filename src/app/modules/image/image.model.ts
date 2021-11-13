import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMImage } from './image.type';


const ImageMd = DB.define<IMImage>(
    TableName.IMAGE,
    {
        image_id: cloneDeep(modelCommonPrimaryKeyProperty),
        product_id: {
            type: DataTypes.UUID,
        },
        image_URL: { allowNull: false, type: DataTypes.STRING },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

// ImageMd.belongsTo(UserMd, { foreignKey: 'user_is', as: 'user' })
// ImageMd.belongsTo(UserMd, { foreignKey: 'created_by', as: 'created_by_user' })
// ImageMd.belongsTo(UserMd, { foreignKey: 'updated_by', as: 'updated_by_user' })

async function doStuffWithUserModel() {
    // await ImageMd.sync({ force: true })
    // await UserMd.sync({ force: true })
    const id = uuidv4()

    await ImageMd.create({
        image_id: id,
        product_id: id,
        image_URL: "https://Image.idgesg.net/Image/article/2021/10/red-dashboard-02-100909234-orig.jpg?auto=webp&quality=85,70",
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created default user..."))
        .catch(e => console.log(e))
    // console.log(newUser);
}

//doStuffWithUserModel()

export { ImageMd };

