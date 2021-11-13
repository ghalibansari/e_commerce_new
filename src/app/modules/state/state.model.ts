import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMStates } from './state.types';


const StatesMd = DB.define<IMStates>(
    TableName.STATE_MASTER,
    {
        state_id: cloneDeep(modelCommonPrimaryKeyProperty),
        name: { allowNull: false, type: DataTypes.STRING },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

async function doStuffWithUserModel() {
    await StatesMd.sync()
    // await UserMd.sync({ force: true })
    const id = uuidv4()

    const newUser = await StatesMd.create({
        state_id: id,
        name: "Maharshtra",
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created default user..."))
        .catch(e => console.log(e))
    // console.log(newUser);
}

//doStuffWithUserModel()

export { StatesMd };

