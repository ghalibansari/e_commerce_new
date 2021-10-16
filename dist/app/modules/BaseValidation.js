"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseValidation = exports.idValidate = void 0;
const joi_1 = __importDefault(require("joi"));
const uuid_1 = require("uuid");
const idValidate = (value, helper) => {
    if (!(0, uuid_1.validate)(value))
        return helper.message("Invalid id.");
    return true;
};
exports.idValidate = idValidate;
class BaseValidation {
}
exports.BaseValidation = BaseValidation;
BaseValidation.index = joi_1.default.object({
    where: joi_1.default.object(),
    attributes: joi_1.default.array().items(joi_1.default.string().required()),
    pageNumber: joi_1.default.number().min(1).max(999).error(new Error("Invalid pageNumber")),
    pageSize: joi_1.default.number().min(1).max(1000).error(new Error("Invalid pageSize")),
    rangeFilters: joi_1.default.string().error(new Error("Invalid Query rangeFilters")),
    order: joi_1.default.array().items(joi_1.default.string()).error(new Error("Invalid sort")),
    search: joi_1.default.string().max(55).error(new Error("Invalid search"))
});
BaseValidation.attributes = joi_1.default.object({
    attributes: joi_1.default.array().items(joi_1.default.string().required())
});
BaseValidation.findById = joi_1.default.object({
    id: joi_1.default.string().custom(exports.idValidate)
});
;
//# sourceMappingURL=BaseValidation.js.map