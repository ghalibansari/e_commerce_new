"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonResponse = void 0;
const HttpStatus = __importStar(require("http-status-codes"));
class JsonResponse {
    static async jsonSuccess(req, res, method_name) {
        const obj = {
            status: res.locals.status ?? true,
            message: res.locals.message,
            errorCode: res.locals.errorCode,
            page: res.locals.page,
            header: res.locals.header,
            data: res.locals.data ?? null
        };
        res.status(HttpStatus.OK).send(obj);
    }
    static async jsonError(req, res, method_name) {
        const obj = {
            status: false,
            message: res.locals.message || "Something went wrong, please contact to admin.",
            data: res.locals.data ?? null
        };
        if (!res.locals.code)
            res.status(HttpStatus.OK);
        else
            res.status(res.locals.code);
        res.send(obj);
    }
}
exports.JsonResponse = JsonResponse;
//# sourceMappingURL=JsonResponse.js.map