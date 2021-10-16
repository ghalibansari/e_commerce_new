"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("./configs/DB");
const app_1 = __importDefault(require("./app/app"));
app_1.default.listen(3000, async () => {
    console.log('*************                           *************');
    console.log('*************       App started...      *************');
    console.log('*************                           *************');
    process.on('SIGINT', () => {
        console.log("terminating");
        DB_1.DB.close();
        process.exit(0);
    });
    process.on('close', () => {
        console.log('Unexpected server shutdown');
    });
});
//# sourceMappingURL=server.js.map