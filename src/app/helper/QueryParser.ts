import { NextFunction, Request, Response } from 'express';
import { JsonResponse } from './JsonResponse';



const parseBoolFromString = async (value: any): Promise<any> => {
    if (value === 'true') {
        return true;
    }
    else if (value === 'false') {
        return false;
    }
    else if (!isNaN(value)) {
        return Number(value);
    } else {
        // console.log(moment(value).isValid(), "moment(value).isValid()")
        // if (moment(value).isValid()) {
        //     return new Date(value);
        // }
        return value;
    }
}



const parseValue = async (value: any) => {
    if (typeof value === 'string') {
        return parseBoolFromString(value);
    }
    else if (value.constructor === Object) {
        return parseObject(value);
    }
    else if (Array.isArray(value)) {
        let array: any[] = [];
        value.forEach(function (item, itemKey) {
            array[itemKey] = parseValue(item);
        });
        return array;
    }
    else {
        return value;
    }
}


const parseObject = async (obj: { [x: string]: any }): Promise<any> => {
    let result: { [x: string]: any } = {}, key: string, value: any;

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            value = obj[key];
            value = value.split("'").join('"')
            result[key] = await parseValue(value);
            // result[key] = JSON.parse(value)
        }
    }
    return result;
}

const queryParser = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.query = await parseValue(req.query);
            next();
        } catch (err: any) {
            res.locals.message = `QuerParam: ${err?.message ?? err}`
            await JsonResponse.jsonError(req, res)
        }
    }
}

export { queryParser, parseObject };

