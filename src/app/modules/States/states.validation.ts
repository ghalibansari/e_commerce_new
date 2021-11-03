import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { IStates } from "./states.types";


export abstract class StatesValidation extends BaseValidation {
    static readonly addStates = Joi.object<IStates>({
        name: Joi.string().required(),
    });

    static readonly addStateBulk = Joi.array().items(this.addStates)

    static readonly editState = Joi.object<IStates>({
        name: Joi.string(),
        is_active: Joi.boolean(),
    });
};