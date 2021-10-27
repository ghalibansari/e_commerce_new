import { NextFunction, Request, Response } from "express"
//@ts-expect-error
import CryptoJS, { AES, DecryptedMessage } from "crypto-js";
////@ts-expect-error
import jwt from "jsonwebtoken";
import { Constant, Messages, Texts } from "../constants";
import { JsonResponse } from "./JsonResponse";
//@ts-expect-error
import AclBusiness from "../modules/acl/acl.business";



/**
 * guard function stops unAuthorize user from access.
 * @param req   {jwt_encrypted_token,   data}
 * @param res
 * @param next
 */
async function AuthGuard(req: Request, res: Response, next: NextFunction) {
    try {
        const jwt_token_header: any = req.headers.authorization;
        //@ts-expect-error
        req.user = jwt.verify(jwt_token_header, Constant.jwt_key);
        next();
    } catch (err) {
        res.locals.code = 401
        res.locals.status = false;
        res.locals.data = { isValid: false, authorizationFailed: true };
        res.locals.message = 'Login please.' //|| auth.message;
        await JsonResponse.jsonError(req, res, 'guard');
    }
}

export { AuthGuard };