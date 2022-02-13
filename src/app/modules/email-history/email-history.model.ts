import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMEmailHistory } from './email-history.types';


const EmailHistoryMd = DB.define<IMEmailHistory>(
    TableName.EMAIL_HISTORY,
    {
        email_id: cloneDeep(modelCommonPrimaryKeyProperty),
        to: { allowNull: false, type: DataTypes.STRING },
        from: { allowNull: false, type: DataTypes.STRING },
        subject: { allowNull: false, type: DataTypes.TEXT },
        html: { allowNull: false, type: DataTypes.TEXT },
        cc: { type: DataTypes.STRING },
        bcc: { type: DataTypes.STRING },
        attachment: { type: DataTypes.TEXT },
        success: { type: DataTypes.BOOLEAN },
        result: { type: DataTypes.TEXT },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

export { EmailHistoryMd };

