import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMTemplate, ITemplate, templateTypeEnum } from "./template.types";


const TemplateMd = DB.define<IMTemplate>(
  TableName.TEMPLATE,
  {
    template_id: cloneDeep(modelCommonPrimaryKeyProperty),
    name: { allowNull: false, type: DataTypes.STRING, unique: true },
    to: { type: DataTypes.ARRAY(DataTypes.STRING) },
    cc: { type: DataTypes.ARRAY(DataTypes.STRING) },
    bcc: { type: DataTypes.ARRAY(DataTypes.STRING) },
    subject: { type: DataTypes.STRING },
    title: { type: DataTypes.STRING },
    body: { type: DataTypes.TEXT },
    params: { type: DataTypes.ARRAY(DataTypes.STRING) },
    type: { type: DataTypes.STRING },
    ...cloneDeep(modelCommonColumns)
  },
  cloneDeep(modelCommonOptions)
);

async function doStuffWithUserModel() {
  // await TemplateMd.sync({ force: true });
  const id = uuidv4();

  const newUser = await TemplateMd.create({
    template_id: id,
    name: "demo",
    title: `<h1>Title {{NAME}}</h1>`,
    subject: `Welcome {{NAME}}.`,
    body: `<mjml>
    <mj-head>
      <mj-title>Hello MJML</mj-title>
    </mj-head>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text>
            {{NAME}} welcome to your age is {{AGE}}
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`,
    params: ['NAME', 'AGE'],
    to: ['ak8828979484@gmail.com'],
    cc: ['ghalibansari1994@gmail.com'],
    type: templateTypeEnum.email,
    created_by: id,
    updated_by: id
  })
    .then(() => console.log("Created default template..."))
    .catch(e => console.log("rrrrrrrrrrrrrrrrr",e));
};


// doStuffWithUserModel();

export { TemplateMd };

