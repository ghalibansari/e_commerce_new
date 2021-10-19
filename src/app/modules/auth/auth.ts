import Joi from "joi";
import { Errors, Messages, Regex } from "../../constants";
import { NextFunction, Request, Response, Router } from "express";
// import { Error } from "sequelize/types";

// import { IUser } from "../user/user.types";

const Ilogin = Joi.object({
    email: Joi.string().email().max(250).required().error(new Error(Errors.EMAIL_ID)),
    password: Joi.string().max(250).required().error(new Error(Errors.PASSWORD)),
});
const IauthValidate = async (req: Request, res: Response, next: NextFunction) => {
    await Ilogin.validateAsync(req.query)
        .then(() => next())
        .catch((e) => res.send(e.message))
}
export { Ilogin, IauthValidate }