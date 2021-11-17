import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
// import { IMTag } from "./tag.types";
import { IMTag } from "./tag.types";

const TagMd = DB.define<IMTag>(
    TableName.TAG_MASTER,
    {
        tag_id: cloneDeep(modelCommonPrimaryKeyProperty),
        name: { allowNull: false, type: DataTypes.STRING },

        text_color_code: { allowNull: true, type: DataTypes.STRING },

        background_color_code: { allowNull: true, type: DataTypes.STRING },
        ...cloneDeep(modelCommonColumns)
    },

    cloneDeep(modelCommonOptions)
);
async function doStuffWithUserModel() {

    console.log('doStuffWithUserModel')
    // await CityMd.sync({ force: true })
    const id = uuidv4()

    const newUser = await TagMd.create({
        tag_id: id,
        name: "cadbury",
        text_color_code: "string",
        background_color_code: "string",
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created default user..."))
        .catch(e => console.log(e))
    //console.log(newUser);
}


//doStuffWithUserModel()
//TagMd.sync({ force: true })
export { TagMd };

