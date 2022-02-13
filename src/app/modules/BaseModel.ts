import { DataTypes } from "sequelize";

const modelCommonPrimaryKeyProperty = {
    allowNull: false, autoIncrement: false, primaryKey: true,
    type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4
};

const modelCommonColumns = {
    is_active: { allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true },
    delete_reason: { type: DataTypes.STRING },
    created_by: { allowNull: false, type: DataTypes.UUID },
    updated_by: { allowNull: false, type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID }
};

const modelCommonOptions = {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
};

export { modelCommonOptions, modelCommonColumns, modelCommonPrimaryKeyProperty };

