import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";


interface IBBrand extends IBCommon {
    brand_id: string;
    brand_name: string;
    order_sequence: number;
    show_on_home_screen?: boolean;
    banner_image: string;
    tag_id?: string;
    show_on_header?: boolean;
}

interface IBrand extends Optional<IBBrand, 'brand_id'> { }

interface IMBrand extends Model<IBBrand, IBrand>, IBBrand, IMCommon { }

export { IBrand, IMBrand };

