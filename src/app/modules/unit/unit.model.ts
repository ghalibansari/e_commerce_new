import { IMUnit } from './unit.types'
import { TableName } from "../../constants";
// import { fingerPrintSchema } from "../fingerPrint/fingerPrint.model";
// //@ts-expect-error
// import bcrypt, {genSaltSync, hashSync} from "bcrypt";
// import { string } from "joi";

import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { v4 as uuidv4 } from 'uuid';


const UnitMd = DB.define<IMUnit>(
    TableName.UNIT,
    {
        unit_id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: () => uuidv4()
        },
        name: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        short_name: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        description: {
            allowNull: true,
            type: DataTypes.TEXT,
        },
        status: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        created_by: {
            allowNull: true,
            type: DataTypes.UUID
        },
        updated_by: {
            allowNull: true,
            type: DataTypes.UUID,
        },
        deleted_by: {
            allowNull: true,
            type: DataTypes.UUID,
        },
    },
    {
        timestamps: true,
        paranoid: true,
        createdAt: 'created_on',
        updatedAt: 'updated_on',
        deletedAt: 'deleted_on'
    }
);


export default UnitMd;