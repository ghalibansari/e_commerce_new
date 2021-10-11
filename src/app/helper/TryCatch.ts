import {Request, Response} from "express";
import {JsonResponse} from "./JsonResponse";
import logger from "./Logger";
//@ts-expect-error
import {memoryStorage} from "multer";
import {MongooseTransaction} from "./MongooseTransactions";
//@ts-expect-error
import loggerModel from "../modules/loggers/logger.model";
import {modulesEnum} from "../constants";
//@ts-expect-error
import {loggerLevelEnum} from "../modules/loggers/logger.types";

export class TryCatch{
    /**
     * tryCatchGlobe
     */
    static tryCatchGlobe(handler:Function)  {
        return async (req: Request, res: Response, next:Function) => {
            try {await handler(req,res)}
            catch (err) {
                // const {body, originalUrl, method, query, body:{loggedInUser:{_id:loggedInUserId}}} = req
                // const createdBy = loggedInUserId, updatedBy = loggedInUserId
                // delete body.loggedInUser
                // const [,,,module,] = originalUrl.split('/')
                console.log(err)
                // if(err instanceof Object) loggerModel.create({body: JSON.stringify(body||''), url: originalUrl, method, query: JSON.stringify(query), message: err.stack, createdBy, updatedBy, level: loggerLevelEnum.api, module})
                //     .catch((err:any) => console.log('Logging Failed', err))
                // logger.error({loggedInUserId, originalUrl, method, query, error: err, body})
                //@ts-expect-error
                res.locals.message = err?.message ?? err;
                // if(body.event_id) res.locals.data = {event_id : body.event_id}
                await JsonResponse.jsonError(req, res);
            }
        }
    }
}
