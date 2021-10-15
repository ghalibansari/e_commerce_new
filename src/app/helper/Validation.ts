import { NextFunction, Request, Response } from "express";
import { JsonResponse } from "./JsonResponse";
import Joi from "joi";


async function check(type: string): Promise<any> {
    if (type === 'body') return async function (req: Request, res: Response, next: NextFunction, schema: any) {
        schema.validateAsync(req.body, { abortEarly: false }).then(() => next())
            .catch(async (err: any) => { res.locals = { status: false, message: err.message }; await JsonResponse.jsonSuccess(req, res); })
    }

    if (type === 'query') return async function (req: Request, res: Response, next: NextFunction, schema: any) {
        schema.validateAsync(req.query, { abortEarly: false }).then(() => next())
            .catch(async (err: any) => { res.locals = { status: false, message: err.message }; await JsonResponse.jsonSuccess(req, res); })
    }

    if (type === 'bodyQuery') return async function (req: Request, res: Response, next: NextFunction, schema: any) {
        schema.validateAsync({ ...req.body, ...req.query }, { abortEarly: false }).then(() => next())
            .catch(async (err: any) => { res.locals = { status: false, message: err.message }; await JsonResponse.jsonSuccess(req, res); })
    }
}

//FIXME: remove any type.
const validateBody = (schema: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await schema.validateAsync(req.body)
            .then(() => { next() })
            .catch(async (err: Error) => {
                res.locals = { status: false, message: err.message };
                await JsonResponse.jsonSuccess(req, res);
            });
    };
};

//FIXME: remove any type.
const validateParams = (schema: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await schema.validateAsync(req.params)
            .then(() => { next() })
            .catch(async (err: Error) => {
                res.locals = { status: false, message: err.message };
                await JsonResponse.jsonSuccess(req, res);
            });
    };
};

export { validateBody, validateParams };