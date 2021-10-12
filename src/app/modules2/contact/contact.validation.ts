import Joi from "joi";
import {attributeJoiScheme} from "../attribute/attribute.validation";
import {Errors, Regex} from "../../constants";

export const createContactSchemaObject = {
    number: Joi.string().required(),
    primaryCode: Joi.string().required().regex(Regex.phoneNumberCode).error(new Error(Errors.INVALID_PRIMARY_CODE)),
    altNumber: Joi.string().required(),
    secondaryCode: Joi.string().required().regex(Regex.phoneNumberCode).error(new Error(Errors.INVALID_SECONDARY_CODE)),
    name: Joi.string().max(250).required(),
    email: Joi.string().email().regex(Regex.emailRegex).required(),
    //countryCode: Joi.string().min(2).max(50).required(),
    jobDescription: Joi.string().required(),
    loggedInUser: Joi.any(),
    _id:Joi.any(),
    createdBy:Joi.any(),
    updatedBy:Joi.any(),
    createdAt:Joi.any(),
    updatedAt:Joi.any(),
};