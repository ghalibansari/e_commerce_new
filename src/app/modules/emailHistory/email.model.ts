import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions } from '../BaseModel';
import { IMEmail } from './email.types';


const EmailMd = DB.define<IMEmail>(
    TableName.EMAIL_MASTER,
    {
        email_id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: () => uuidv4()
        },
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
            type: DataTypes.STRING
        },
        html: {
            allowNull: false,
            type: DataTypes.STRING
        },
        cc: {
            type: DataTypes.STRING
        },
        bcc: {
            type: DataTypes.STRING
        },
        attachment: {
            type: DataTypes.STRING
        },

        ...modelCommonColumns
    },
    modelCommonOptions
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
        updated_by: id
    })
        .then(() => console.log("Created default user..."))
        .catch(e => console.log(e))
    // console.log(newUser);
};

// doStuffWithUserModel()

export { EmailMd };

