"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateBody = void 0;
const JsonResponse_1 = require("./JsonResponse");
const validate = (key) => {
    return (schema) => {
        return async (req, res, next) => {
            await schema
                .validateAsync(req[key])
                .then(() => { next(); })
                .catch(async (err) => {
                res.locals = { status: false, message: err.message };
                await JsonResponse_1.JsonResponse.jsonSuccess(req, res);
            });
        };
    };
};
const validateBody = validate('body');
exports.validateBody = validateBody;
const validateParams = validate('params');
exports.validateParams = validateParams;
//# sourceMappingURL=Validation.js.map