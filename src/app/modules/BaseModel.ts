import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from 'uuid';

const modelDefaultPrimaryKeyProperty = {
    allowNull: false,
    autoIncrement: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4()
};

const modelDefaultColumns = {
    delete_reason: {
        type: DataTypes.TEXT
    },
    created_by: {
        allowNull: false,
        type: DataTypes.UUID,
    },
    updated_by: {
        allowNull: false,
        type: DataTypes.UUID,
    },
    deleted_by: {
        type: DataTypes.UUID,
    }
};

const modelDefaultOptions = {
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
};

export { modelDefaultOptions, modelDefaultColumns, modelDefaultPrimaryKeyProperty };