import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { ITag } from "./tag.types";


export abstract class TagValidation extends BaseValidation {

    static readonly addTag = Joi.object<ITag>({
        name: Joi.string().required(),
    });

    static readonly addTagBulk = Joi.array().items(this.addTag)

    static readonly editTag = Joi.object<ITag>({
        name: Joi.string(),
    });
};