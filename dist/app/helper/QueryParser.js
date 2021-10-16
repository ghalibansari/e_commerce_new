"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseObject = exports.queryParser = void 0;
const moment_1 = __importDefault(require("moment"));
const parseBoolFromString = async (value) => {
    if (value === 'true') {
        return true;
    }
    else if (value === 'false') {
        return false;
    }
    else if (!isNaN(value)) {
        return Number(value);
    }
    else {
        console.log((0, moment_1.default)(value).isValid(), "moment(value).isValid()");
        if ((0, moment_1.default)(value).isValid()) {
            return new Date(value);
        }
        return value;
    }
};
const parseValue = async (value) => {
    if (typeof value === 'string') {
        return parseBoolFromString(value);
    }
    else if (value.constructor === Object) {
        return parseObject(value);
    }
    else if (Array.isArray(value)) {
        let array = [];
        value.forEach(function (item, itemKey) {
            array[itemKey] = parseValue(item);
        });
        return array;
    }
    else {
        return value;
    }
};
const parseObject = async (obj) => {
    let result = {}, key, value;
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            value = obj[key];
            value = value.split("'").join('"');
            result[key] = JSON.parse(value);
        }
    }
    return result;
};
exports.parseObject = parseObject;
const queryParser = () => {
    return async (req, res, next) => {
        req.query = await parseObject(req.query);
        next();
    };
};
exports.queryParser = queryParser;
//# sourceMappingURL=QueryParser.js.map