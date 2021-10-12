import Joi from "joi";

const attributeJoiScheme = Joi.object({
    key: Joi.string().required(),
    value: Joi.string().required(),
})


export {attributeJoiScheme}