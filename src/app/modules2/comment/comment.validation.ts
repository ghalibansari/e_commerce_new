import Joi from "joi";
import {Regex} from "../../constants";


export const createCommentSchemaObject = {
    comment: Joi.string().required(),
    loggedInUser: Joi.any(),
};