import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns } from '../BaseModel';
import { IMTemplate } from "./template.types";

//Todo implement interface
const TemplateMd = DB.define<IMTemplate>(
    TableName.TEMPLATE,
    {
        template_id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: () => uuidv4()
        },
        title: { type: DataTypes.STRING, },
        slug: { type: DataTypes.STRING, unique: true },
        subject: { type: DataTypes.STRING, },
        body: { type: DataTypes.STRING, },
        params: { type: DataTypes.STRING },
        type: { type: DataTypes.STRING },//1 email 2 sms
        isActive: { type: DataTypes.BOOLEAN },
        isDeleted: { type: DataTypes.BOOLEAN },
        // created_by: DataTypes.STRING,
        // updated_by: DataTypes.STRING,
        ...modelCommonColumns
    }, {
    timestamps: true,
    paranoid: true
});

async function doStuffWithUserModel() {

    const newUser = await TemplateMd.create({
        // template_id: "id",
        title: "demo",
        slug: "John",
        subject: "8754219635",
        body: "demo@demo.com",
        params: "qwertyuio",
        type: 1,
        isActive: true,
        isDeleted: false,
        created_by: "qwertyuioplkjhgfdsazxcvbnmklpoikjmnbvgfresdx",
        updated_by: "qwertyuioplkjhgfdsazxcvbnmklpoikjmnbvgfresdx"
    })
        .then(() => console.log("Created default template..."))
        .catch(e => console.log(e))
}


// doStuffWithUserModel();

export { TemplateMd };

