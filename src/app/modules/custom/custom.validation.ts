import Joi, { string } from "joi";
import { BaseValidation } from "../BaseValidation";

export abstract class UserValidation extends BaseValidation {
  static readonly addUser = Joi.object<any>({
    // first_name: Joi.string().min(3).max(100).required(),
    // last_name: Joi.string().min(3).max(100).required(),
    // email: Joi.string().email().required(),
    // gender: Joi.string().required().valid(...Object.values(UserGenderEnum)),
    // mobile: Joi.number().required(),
    // password: Joi.string().min(8).max(100).required()
  });

  static readonly addUserBulk = Joi.array().items(this.addUser);

  static readonly editUser = Joi.object<any>({
    // first_name: Joi.string().min(3).max(100),
    // last_name: Joi.string().min(3).max(100),
    // gender: Joi.string().required().valid(...Object.values(UserGenderEnum)),
    // email: Joi.string().email(),
    // mobile: Joi.number(),
    // password: Joi.string().min(8).max(100)
  });

  static readonly searchColumn = Joi.object<any>({
    attributes: Joi.array().items(Joi.string().required()),
    pageNumber: Joi.number()
      .min(1)
      .max(999)
      .error(new Error("Invalid pageNumber")),
    pageSize: Joi.number()
      .min(1)
      .max(1000)
      .error(new Error("Invalid pageSize")),
    rangeFilters: Joi.string().error(new Error("Invalid Query rangeFilters")),
    order: Joi.array().items(Joi.string()).error(new Error("Invalid sort")),
    search: Joi.string().max(55).error(new Error("Invalid search")),
    category_id: Joi.string(),
    price:Joi.string().min(1).max(100000),
    brand_id:string(),
  });
}
