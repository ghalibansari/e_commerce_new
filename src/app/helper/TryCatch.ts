import { Request, Response } from "express";
import { JsonResponse } from "./JsonResponse";
import { v4 } from "uuid";
import { loggerLevelEnum } from "../../app/modules/loggers/logger.types";
import { loggerMd } from "../../app/modules/loggers/logger.model";

export class TryCatch {
    /**
     * tryCatchGlobe
     */
    static tryCatchGlobe(handler: Function) {
        return async (req: Request, res: Response, next: Function) => {
            try { await handler(req, res) }
            catch (err: any) {
                // const {body, originalUrl, method, query, body:{loggedInUser:{_id:loggedInUserId}}} = req
                const { body, originalUrl, method, query }: any = req
                // const createdBy = loggedInUserId, updatedBy = loggedInUserId
                // delete body.loggedInUser
                const updated_by = v4()
                const created_by = v4()
                const [, , , module,] = originalUrl.split('/')
                console.log("errors......................", err)
                loggerMd.create({ url: originalUrl, method, query: JSON.stringify(query), body: JSON.stringify(body), module, level: loggerLevelEnum.api, message: JSON.stringify(err.message), updated_by, created_by }).catch(e => console.log(e, " Failed logging"))
                // if(err instanceof Object) loggerModel.create({body: JSON.stringify(body||''), url: originalUrl, method, query: JSON.stringify(query), message: err.stack, createdBy, updatedBy, level: loggerLevelEnum.api, module})
                //     .catch((err:any) => console.log('Logging Failed', err))
                // logger.error({loggedInUserId, originalUrl, method, query, error: err, body})
                res.locals.message = err?.message ?? err;
                // if(body.event_id) res.locals.data = {event_id : body.event_id}
                await JsonResponse.jsonError(req, res);
            }
        }
    }
}
