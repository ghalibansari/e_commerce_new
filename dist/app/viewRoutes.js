"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerViewRoutes = void 0;
const admin_1 = require("./view-routes/admin");
function registerViewRoutes(app) {
    new admin_1.AdminRoutes().register(app);
}
exports.registerViewRoutes = registerViewRoutes;
//# sourceMappingURL=viewRoutes.js.map