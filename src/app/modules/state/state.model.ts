import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions } from '../BaseModel';
import { IMStates } from './state.types';


const StatesMd = DB.define<IMStates>(
    TableName.STATE_MASTER,
    {
        state_id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: () => uuidv4()
        },
        name: { allowNull: false, type: DataTypes.STRING },
        ...modelCommonColumns
    },
    modelCommonOptions
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

