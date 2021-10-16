"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = require("express");
class AdminRoutes {
    constructor() {
        this.register = (express) => express.use('/admin', this.router);
        this.router = (0, express_1.Router)();
        this.init();
    }
    init() {
        console.log("AAAAAAAAa");
        this.router.get("/brands", this.brandPage);
    }
    brandPage(req, res) {
        res.render('Masters/Brands/index');
    }
}
exports.AdminRoutes = AdminRoutes;
//# sourceMappingURL=admin.js.map