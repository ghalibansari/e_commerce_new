"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseTransaction = void 0;
const mongoose_1 = require("mongoose");
class MongooseTransaction {
    constructor() {
        this.endTransactionNew = async (req, _res, _next) => await req?.mongoSessionNew?.endSession();
        this.startTransaction = async (req, res, next) => {
            const mongoSession = await (0, mongoose_1.startSession)();
            await mongoSession.startTransaction();
            req.mongoSession = mongoSession;
            next();
        };
        this.commitTransaction = async (req, _res, _next) => {
            if (req?.mongoSession) {
                await req.mongoSession.commitTransaction();
                await req.mongoSession.endSession();
                req.mongoSession = undefined;
            }
        };
        this.abortTransaction = async (req, _res, _next) => {
            if (req?.mongoSession) {
                await req.mongoSession.abortTransaction();
                await req.mongoSession.endSession();
                req.mongoSession = undefined;
            }
        };
        this.startTransactionManually = async () => {
            const mongoSession = await (0, mongoose_1.startSession)();
            mongoSession.startTransaction();
            return mongoSession;
        };
        this.commitTransactionManually = async (mongoSession) => {
            await mongoSession.commitTransaction();
            await mongoSession.endSession();
        };
        this.abortTransactionManually = async (mongoSession) => {
            await mongoSession.abortTransaction();
            await mongoSession.endSession();
        };
    }
}
exports.MongooseTransaction = MongooseTransaction;
_a = MongooseTransaction;
MongooseTransaction.startTransactionNew = async (req, res, next) => {
    req.mongoSessionNew = await (0, mongoose_1.startSession)();
    next();
};
//# sourceMappingURL=MongooseTransactions.js.map