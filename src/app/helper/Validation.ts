import { NextFunction, Request, Response } from "express";
import { JsonResponse } from "./JsonResponse";


const validate = (key: 'body' | 'params' | 'query') => {
    //FIXME: remove any type.
    return (schema: any) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            await schema
                .validateAsync(req[key])
                .then(() => { next() })
                .catch(async (err: Error) => {
                    res.locals = { status: false, message: err.message };
                    await JsonResponse.jsonSuccess(req, res);
                });
        };
    };
};

const validateBody = validate('body')
const validateParams = validate('params')
const validateQuery = validate("query")

export { validateBody, validateParams, validateQuery };

