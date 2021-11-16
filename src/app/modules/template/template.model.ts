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
    name: "forgot_password",
    title: `OTP`,
    subject: `Hey{{NAME}}your OTP is {{OTP}}.`,
    body: `<mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-image width="400px" src="https://img.freepik.com/free-vector/security-otp-one-time-password-smartphone-shield_9904-104.jpg?size=626&ext=jpg"></mj-image>
          <mj-divider  border-color="purple"></mj-divider>
          <mj-text font-size="20px" align="center"  color="black" font-family="Montserrat"><h1>{{OTP}}</h1><br><h4>This is your otp for forgot password<br><br>valid for 10 min </br></br></h4> </br></mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`,
    params: ['NAME', 'OTP'],
    to: ['ak8828979484@gmail.com'],
    cc: ['ghalibansari1994@gmail.com'],
    type: templateTypeEnum.email,
    created_by: id,
    updated_by: id
  })
    .then(() => console.log("Created template..."))
    .catch(e => console.log('Error: ', e));
};


// doStuffWithUserModel();

export { TemplateMd };

