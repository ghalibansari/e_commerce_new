"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constants_1 = require("./constants");
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = require("./routes");
const viewRoutes_1 = require("./viewRoutes");
const express_session_1 = __importDefault(require("express-session"));
const QueryParser_1 = require("./helper/QueryParser");
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.middleware();
        this.setupApiRoutes();
        this.setupWebRoute();
        setTimeout(() => this.setupCron(), 30000);
    }
    middleware() {
        this.app.use(express_1.default.json({ limit: '100mb' }));
        this.app.use(body_parser_1.default.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
        this.app.use((0, QueryParser_1.queryParser)());
        this.app.use((0, express_session_1.default)({ secret: constants_1.Constant.secret_key, saveUninitialized: true, resave: true }));
        this.app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, credentials, withCredentials");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
            next();
        });
    }
    setupApiRoutes() {
        (0, routes_1.registerRoutes)(this.app);
    }
    setupWebRoute() {
        this.app.set("views", path_1.default.join(__dirname, "../views"));
        this.app.set("view engine", "ejs");
        this.app.use(express_ejs_layouts_1.default);
        (0, viewRoutes_1.registerViewRoutes)(this.app);
    }
    setupCron() {
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map