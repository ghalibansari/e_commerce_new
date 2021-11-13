import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMEmail } from './email.types';


const EmailMd = DB.define<IMEmail>(
    TableName.EMAIL_MASTER,
    {
        email_id: cloneDeep(modelCommonPrimaryKeyProperty),
        to: {
            allowNull: false,
            type: DataTypes.STRING
        },
        from: {
            allowNull: false,
            type: DataTypes.STRING
        },
        subject: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        html: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        cc: {
            type: DataTypes.STRING
        },
        bcc: {
            type: DataTypes.STRING
        },
        attachment: {
            type: DataTypes.TEXT
        },
        success: {
            type: DataTypes.BOOLEAN
        },
        result: {
            type: DataTypes.TEXT
        },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

async function doStuffWithUserModel() {
    await EmailMd.sync()
    // await UserMd.sync({ force: true })
    const id = uuidv4()

    const newUser = await EmailMd.create({
        email_id: id,
        to: "ak11@gmail.com",
        from: "19tcs033.aman.a52@gmail.com",
        html: "html",
        subject: "Hello",
        created_by: id,
        updated_by: id,
        success: true,
        result: "success"
    })
        .then(() => console.log("Created default user..."))
        .catch(e => console.log(e))
    // console.log(newUser);
};

// doStuffWithUserModel()
// EmailMd.sync({ force: true })

export { EmailMd };