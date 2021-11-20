import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMContactUs } from './contact-us.type';


const ContactUsMd = DB.define<IMContactUs>(
    TableName.CONTACT_US,
    {
        contact_us_id: cloneDeep(modelCommonPrimaryKeyProperty),
        name: { allowNull: false, type: DataTypes.STRING },
        email: { type: DataTypes.STRING, defaultValue: null },
        contact_no: { allowNull: false, type: DataTypes.STRING },
        message: { allowNull: false, type: DataTypes.TEXT, defaultValue: false },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

async function doStuffWithUserModel() {
    // await ContactUsMd.sync({ force: true })
    // a
    const id = uuidv4()

    const newUser = await ContactUsMd.create({
        contact_us_id: id,
        name: "Cjot",
        email: "demo2@demo.com",
        contact_no: "78992338",
        message: "chor",
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created default user..."))
        .catch(e => console.log(e))
    // console.log(newUser);
}

// doStuffWithUserModel()
// ContactUsMd.sync({ force: true })

export { ContactUsMd };

