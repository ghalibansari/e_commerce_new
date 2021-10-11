// import {NextFunction, Request, Response} from "express";
// import {JsonResponse} from "./JsonResponse";
//
//
// async function check(type: string): any {
//     if(type === 'body') return async function (req: Request, res: Response, next: NextFunction, schema: any) {
//         schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
//             .catch(async (err: any) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonSuccess(req, res);})
//     }
//
//     if(type === 'query') return async function (req: Request, res: Response, next: NextFunction, schema: any) {
//         schema.validateAsync(req.query, {abortEarly: false}).then(() => next())
//             .catch(async (err: any) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonSuccess(req, res);})
//     }
//
//     if(type === 'bodyQuery') return async function (req: Request, res: Response, next: NextFunction, schema: any) {
//         schema.validateAsync({...req.body, ...req.query}, {abortEarly: false}).then(() => next())
//             .catch(async (err: any) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonSuccess(req, res);})
//     }
// }
//
//
// // async function valid(req: Request, res: Response, next: NextFunction, schema: any): Promise<void> {
// //     schema.validateAsync(req.body, {abortEarly: false}).then(() => next())
// //     .catch(async (err: any) => {res.locals = {status: false, message: err.message}; await JsonResponse.jsonSuccess(req, res);})
// // }
//
//
// const checkQuery = check('query')
// const checkBody = check('body')
// const checkBodyQuery = check('bodyQuery')
//
// export {checkBody, checkQuery, checkBodyQuery}