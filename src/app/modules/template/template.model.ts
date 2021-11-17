import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMTemplate, templateTypeEnum } from "./template.types";


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
    name: "user_registration",
    title: `Registration Email Verification`,
    subject: `Hey {{NAME}} welcome to our family.`,
    body: `<mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-image width="400px" src=https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkIiaSXe-txgAPqBdut2qFucVjp5D8-gN6tQ&usqp=CAU></mj-image>
          <mj-divider border-color="#000080"></mj-divider>
          <mj-text  align = "center" font-size="20px" color="black" font-family="perpetua"><h2><i>Your OTP for Email Verification is {{OTP}}</i></h2></mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`,
    params: ['NAME', 'OTP'],
    to: ['ak8828979484@gmail.com'],
    cc: [''],
    type: templateTypeEnum.email,
    created_by: id,
    updated_by: id
  })
    .then(() => console.log("Created template..."))
    .catch(e => console.log('Error: ', e));
};


// doStuffWithUserModel();

export { TemplateMd };

