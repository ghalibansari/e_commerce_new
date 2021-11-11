import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions } from '../BaseModel';
import { IMTemplate, ITemplate, templateTypeEnum } from "./template.types";


const TemplateMd = DB.define<IMTemplate>(
  TableName.TEMPLATE,
  {
    template_id: {
      allowNull: false, autoIncrement: false, primaryKey: true,
      type: DataTypes.UUID, defaultValue: () => uuidv4()
    },
    to: { type: DataTypes.STRING },
    cc: { type: DataTypes.STRING },
    bcc: { type: DataTypes.STRING },
    template_name: { type: DataTypes.STRING, unique: true },
    subject: { type: DataTypes.STRING },
    title: { type: DataTypes.STRING },
    body: { type: DataTypes.TEXT },
    params: { type: DataTypes.ARRAY(DataTypes.STRING) },
    type: { type: DataTypes.STRING },
    ...modelCommonColumns
  },
  modelCommonOptions
);

async function doStuffWithUserModel() {
  // await TemplateMd.sync({ force: true });
  const id = uuidv4();

  const newUser = await TemplateMd.create({
    template_id: id,
    template_name: "demo",
    title: `<h1>Title {{NAME}}</h1>`,
    subject: `Welcome {{NAME}}.`,
    body: `<mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-image width="100px" src="/assets/img/logo-small.png"></mj-image>
              <mj-divider border-color="#F45E43"></mj-divider>
              <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello {{NAME}}</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>`,
    params: [''],
    type: templateTypeEnum.email,
    created_by: id,
    updated_by: id
  })
    .then(() => console.log("Created default template..."))
    .catch(e => console.log(e));
};


// doStuffWithUserModel();

export { TemplateMd };

