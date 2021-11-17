import { Model, Optional } from "sequelize";
import { IBCommon, IMCommon } from "../baseTypes";

interface IBTag extends IBCommon {
    tag_id: string;
    name: string;
    text_color_code: string;
    background_color_code: string;
};

interface ITag extends Optional<IBTag, "tag_id"> { }

interface IMTag extends Model<IBTag, ITag>, IBTag, IMCommon { }

export { ITag, IMTag };
