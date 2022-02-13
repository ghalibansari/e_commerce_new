import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMEnquiry } from './enquiry.type';


const EnquiryMd = DB.define<IMEnquiry>(
    TableName.ENQUIRY,
    {
        enquiry_id: cloneDeep(modelCommonPrimaryKeyProperty),
        name: { allowNull: false, type: DataTypes.STRING },
        email: { type: DataTypes.STRING, defaultValue: null },
        contact_no: { allowNull: false, type: DataTypes.STRING },
        message: { allowNull: false, type: DataTypes.TEXT, defaultValue: false },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

export { EnquiryMd };

