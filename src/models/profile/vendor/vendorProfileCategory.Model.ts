import VendorCategory from "@models/config/VendorCategory.model";
import { DataTypes, Model, Optional } from "sequelize";
import VendorProfile from "./VendorProfile.model";
import sequelize from "@config/database";

interface VendorProfileCategoryAttributes {
    id: number;
    vendor_profile_id: number;
    vendor_category_id: number;
    created_at?: Date;
    updated_at?: Date;
}


interface VendorProfileCategoryCreationAttributes extends Optional<VendorProfileCategoryAttributes, "id" | "created_at" | "updated_at"> {}


class VendorProfileCategory extends Model<VendorProfileCategoryAttributes, VendorProfileCategoryCreationAttributes> implements VendorProfileCategoryAttributes {
    public id!: number;
    public vendor_profile_id!: number;
    public vendor_category_id!: number;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

VendorProfileCategory.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    vendor_profile_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: VendorProfile,
            key: "id",
        },
    },
    vendor_category_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: VendorCategory,
            key: "id",
        },
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: "vendor_profile_categories",
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ["vendor_profile_id", "vendor_category_id"],
        },
    ],  
});



export default VendorProfileCategory;