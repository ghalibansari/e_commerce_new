import { Request, Response } from "express";
import { JsonResponse } from "./JsonResponse";
import { v4 } from "uuid";
import { loggerLevelEnum } from "../modules/logger/logger.types";
import { loggerMd } from "../modules/logger/logger.model";

export class TryCatch {
    /**
     * The tryCatchGlobe
     */
    static tryCatchGlobe(handler: Function) {
        return async (req: Request, res: Response, next: Function) => {
            try { await handler(req, res) }
            catch (err: any) {
                const { body, originalUrl, method, query }: any = req
                // const createdBy = loggedInUserId, updatedBy = loggedInUserId
                // delete body.loggedInUser
                const updated_by = v4()
                const created_by = v4()
                const [, , , module,] = originalUrl.split('/')
                console.log("errors......................", err)
                loggerMd.create({ url: originalUrl, method, query: JSON.stringify(query), body: JSON.stringify(body), stack: JSON.stringify(err.stack), module, level: loggerLevelEnum.api, message: JSON.stringify(err.message), updated_by, created_by }).catch((e: any) => console.log(e, " Failed logging"))
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
