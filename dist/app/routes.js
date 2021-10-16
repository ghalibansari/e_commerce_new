"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = void 0;
const user_controller_1 = require("./modules/user/user.controller");
function registerRoutes(app) {
    new user_controller_1.UserController().register(app);
}
exports.registerRoutes = registerRoutes;
//# sourceMappingURL=routes.js.map