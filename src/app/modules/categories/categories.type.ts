import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

interface IBCategories extends IBCommon {
    category_id: string
    category_name: string
    parent_id: string
    is_active?: boolean
    order_sequence: number
    show_on_homeScreen: boolean
    category_image: string
}

interface ICategories extends Optional<IBCategories, 'category_id'> { }

interface IMCategories extends Model<IBCategories, ICategories>, IBCategories, IMCommon { }

export { ICategories, IMCategories };
