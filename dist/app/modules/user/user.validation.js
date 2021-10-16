"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const BaseValidation_1 = require("../BaseValidation");
class UserValidation extends BaseValidation_1.BaseValidation {
}
exports.UserValidation = UserValidation;
_a = UserValidation;
UserValidation.addUser = joi_1.default.object({
    first_name: joi_1.default.string().min(3).max(100).required(),
    last_name: joi_1.default.string().min(3).max(100).required(),
    email: joi_1.default.string().email().required(),
    mobile: joi_1.default.number().required(),
    password: joi_1.default.string().min(8).max(100).required(),
    created_by: joi_1.default.any(),
    updated_by: joi_1.default.any()
});
UserValidation.addUserBulk = joi_1.default.array().items(_a.addUser);
UserValidation.editUser = joi_1.default.object({
    first_name: joi_1.default.string().min(3).max(100),
    last_name: joi_1.default.string().min(3).max(100),
    email: joi_1.default.string().email(),
    mobile: joi_1.default.number(),
    password: joi_1.default.string().min(8).max(100)
});
;
//# sourceMappingURL=user.validation.js.map