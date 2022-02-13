import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";
import { ITag } from "../tags/tags.types";

interface IBCategories extends IBCommon {
    category_id: string
    category_name: string
    parent_id?: IBCategories["category_id"]
    is_active?: boolean
    order_sequence: number
    show_on_home_screen?: boolean
    category_image: string
    tag_id?: ITag["tag_id"]
    show_on_header?: boolean
};

interface ICategories extends Optional<IBCategories, 'category_id'> { }

interface IMCategories extends Model<IBCategories, ICategories>, IBCategories, IMCommon { }

export { ICategories, IMCategories };

