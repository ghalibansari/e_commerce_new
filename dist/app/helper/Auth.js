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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guard = void 0;
const crypto_js_1 = __importStar(require("crypto-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const JsonResponse_1 = require("./JsonResponse");
async function guard(req, res, next) {
    try {
        let jwt_token_header = req.headers.authorization;
        let jwt_token_decrypt = crypto_js_1.AES.decrypt(jwt_token_header, constants_1.Constant.secret_key);
        let jwt_token = jwt_token_decrypt.toString(crypto_js_1.default.enc.Utf8);
        req.body.loggedInUser = jsonwebtoken_1.default.verify(jwt_token, constants_1.Constant.jwt_key);
        if (req?.body?.loggedInUser?.roleName !== constants_1.Texts.SPACECODEADMIN) {
            if (req?.query?.filters) {
                let filters = JSON.parse(req.query.filters);
                filters = [...filters, { key: constants_1.Texts.companyId, value: req?.body?.loggedInUser.companyId }];
                req.query.filters = JSON.stringify(filters);
            }
            else {
                const filters = [{ key: constants_1.Texts.companyId, value: req?.body?.loggedInUser.companyId }];
                req.query.filters = JSON.stringify(filters);
            }
        }
        next();
    }
    catch (err) {
        res.locals.status = false;
        res.locals.data = { isValid: false, authorizationFailed: true };
        res.locals.message = 'Login please.';
        await JsonResponse_1.JsonResponse.jsonError(req, res, 'guard');
    }
}
exports.guard = guard;
//# sourceMappingURL=Auth.js.map