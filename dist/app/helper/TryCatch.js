"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryCatch = void 0;
const JsonResponse_1 = require("./JsonResponse");
class TryCatch {
    static tryCatchGlobe(handler) {
        return async (req, res, next) => {
            try {
                await handler(req, res);
            }
            catch (err) {
                console.log("errors......................", err);
                res.locals.message = err?.message ?? err;
                await JsonResponse_1.JsonResponse.jsonError(req, res);
            }
        };
    }
}
exports.TryCatch = TryCatch;
//# sourceMappingURL=TryCatch.js.map