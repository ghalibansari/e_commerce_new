import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { ICity } from "./city.types";


export abstract class CityValidation extends BaseValidation {
    static readonly addCity = Joi.object<ICity>({
        name: Joi.string().required(),
    });

    static readonly addCityBulk = Joi.array().items(this.addCity)

    static readonly editCity = Joi.object<ICity>({
        name: Joi.string(),
    });
};