import { NextFunction, Request, Response } from 'express';
import { DB } from '../../configs/DB';

export abstract class DBTransaction{

    static startTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // console.log('start.transaction....................')
        //@ts-expect-error
        req.transaction = await DB.transaction();
        next();
    };

    static commitTransaction = async (req: Request, _res: Response, _next?: NextFunction): Promise<void> => {
        //@ts-expect-error
        if (req?.transaction) {
            console.log('commit.............................');
            // @ts-expect-error
            await req.transaction.commit();
            //@ts-expect-error
            delete req.transaction;
        }
        // next();
    };

    static abortTransaction = async (req: Request, _res: Response, _next?: NextFunction): Promise<void> => {
        //@ts-expect-error
        if (req?.transaction) {
            console.log('abort.............................')
            //@ts-expect-error
            await req.transaction.rollback();
            //@ts-expect-error
            delete req.transaction;
        }
        // next();
    };
};