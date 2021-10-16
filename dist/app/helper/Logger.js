"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
require("winston-mongodb");
const constants_1 = require("../constants");
const { MONGO_URI, MONGO_PORT, DB_NAME } = constants_1.Constant;
exports.default = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.MongoDB({
            level: 'error',
            handleExceptions: true,
            db: `mongodb+srv://infinity2020:infinity2020@infinity.7kj2a.gcp.mongodb.net/infinity_dev_qc?retryWrites=true&w=majority`,
            options: { useUnifiedTopology: true },
            collection: 'loggers',
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json())
        })
    ],
    exitOnError: false
});
//# sourceMappingURL=Logger.js.map