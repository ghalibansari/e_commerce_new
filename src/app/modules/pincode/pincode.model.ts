import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions } from '../BaseModel';
import { IMPinCode } from './pincode.types';


const PinCodeMd = DB.define<IMPinCode>(
    TableName.PIN_CODE_MASTER,
    {
        pin_code_id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: () => uuidv4()
        },
        area_name: { allowNull: false, type: DataTypes.STRING },
        ...modelCommonColumns
    },
    modelCommonOptions
);

async function doStuffWithUserModel() {
    await PinCodeMd.sync()
    // await UserMd.sync({ force: true })
    const id = uuidv4()

    const newUser = await PinCodeMd.create({
        pin_code_id: id,
        area_name: "Kherwadi",
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created default user..."))
        .catch(e => console.log(e))
    // console.log(newUser);
}

//doStuffWithUserModel()

// PinCodeMd.hasOne(StatesMd)

export { PinCodeMd };

