import {NextFunction, Request, Response} from "express"
//@ts-expect-error
import CryptoJS, {AES, DecryptedMessage} from "crypto-js";
//@ts-expect-error
import jwt from "jsonwebtoken";
import {Constant, Messages, Texts} from "../constants";
import {JsonResponse} from "./JsonResponse";
//@ts-expect-error
import AclBusiness from "../modules/acl/acl.business";


/**
 * guard function stops unAuthorize user from access.
 * @param req   {jwt_encrypted_token,   data}
 * @param res
 * @param next
 */
async function guard(req: Request, res: Response, next: NextFunction) {
    try {
        let jwt_token_header: any = req.headers.authorization;   //get encrypted token_header from front_end.
        let jwt_token_decrypt: DecryptedMessage = AES.decrypt(jwt_token_header, Constant.secret_key);  //decrypt token_header.
        let jwt_token: string = jwt_token_decrypt.toString(CryptoJS.enc.Utf8);  //covert to string.
        req.body.loggedInUser = jwt.verify(jwt_token, Constant.jwt_key);   //verify jwt.

        if(req?.body?.loggedInUser?.roleName !== Texts.SPACECODEADMIN){
            if(req?.query?.filters){
                //@ts-expect-error
                let filters: {}[] = JSON.parse(req.query.filters);
                filters = [...filters, {key: Texts.companyId, value: req?.body?.loggedInUser.companyId}]
                req.query.filters = JSON.stringify(filters);
            }
            else {
                const filters = [{key: Texts.companyId, value: req?.body?.loggedInUser.companyId}]
                req.query.filters = JSON.stringify(filters);
            }
        }

        // let authorized = false; ///Todo uncomment this code before production.
        // const [url] =  req.originalUrl.split("?");
        // @ts-ignore   //Todo remove ts-ignore
        // if(req.session.access) {
        //     // @ts-ignore   //Todo remove ts-ignore
        //     req.session.access.forEach((val: any) => {if (`${url}--${req.method}` == val) {authorized = true}});  //Todo add break in this loop in future.
        // }
        // let {_id, companyId} = req.body.loggedInUser
        // let access = await new AclBusiness().findBB({userId: _id, companyId, isDelete: false}, {}, {}, 100, 0, [])
        // if(access){
        //     let originalUrl = `${url}--${req.method}`
        //     access.forEach(val => {
        //         let checkUrl = val.url
        //         if(val.viewAll){ checkUrl = `${val.url}--GET`; if(originalUrl === checkUrl) { authorized = true}}
        //         if(val.add){ checkUrl = `${val.url}--POST`; if(originalUrl === checkUrl) { authorized = true}}
        //         if(val.edit){ checkUrl = `${val.url}--PUT`; if(originalUrl === checkUrl) { authorized = true}}
        //         if(val.delete){ checkUrl = `${val.url}--DELETE`; if(originalUrl === checkUrl) { authorized = true}}
        //         if(val.viewOne){ checkUrl = `${val.url}/get-by-id--GET`; if(originalUrl === checkUrl) { authorized = true}}
        //         if(val.faker){ checkUrl = `${val.url}/faker--GET`; if(originalUrl === checkUrl) { authorized = true}}
        //     })
        // }
        // if(authorized) {next()}
        // else { //Todo uncomment this in production.
            next()  //Todo remove this in production
            // res.locals.data = {isValid: false, authorizationFailed: true};   //Todo uncomment this in production.
            // res.locals.message = Messages.UNAUTHORIZED_ACCESS;
            // JsonResponse.jsonError(req, res, 'guard');
        // }
    } catch (err) {
        // next()
        //res.locals.code = 401
        res.locals.status = false;
        res.locals.data = {isValid: false, authorizationFailed: true};
        res.locals.message = 'Login please.' //|| auth.message;
        await JsonResponse.jsonError(req, res, 'guard');
    }
}

export {guard};