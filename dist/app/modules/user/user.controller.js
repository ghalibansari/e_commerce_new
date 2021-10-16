"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const BaseController_1 = require("../BaseController");
const helper_1 = require("../../helper");
const user_validation_1 = require("./user.validation");
const user_repository_1 = require("./user.repository");
class UserController extends BaseController_1.BaseController {
    constructor() {
        super("user", new user_repository_1.UserRepository(), ['*'], [['last_name', 'DESC']], [], ['first_name', 'last_name']);
        this.register = (express) => express.use('/api/v1/user', this.router);
        this.init();
    }
    init() {
        this.router.get("/", helper_1.TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", (0, helper_1.validateParams)(user_validation_1.UserValidation.findById), helper_1.TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/", (0, helper_1.validateBody)(user_validation_1.UserValidation.addUser), helper_1.TryCatch.tryCatchGlobe(this.createOneBC));
        this.router.post("/bulk", (0, helper_1.validateBody)(user_validation_1.UserValidation.addUserBulk), helper_1.TryCatch.tryCatchGlobe(this.createBulkBC));
        this.router.put("/:id", (0, helper_1.validateParams)(user_validation_1.UserValidation.findById), (0, helper_1.validateParams)(user_validation_1.UserValidation.editUser), helper_1.TryCatch.tryCatchGlobe(this.updateByIdkBC));
        this.router.delete("/:id", (0, helper_1.validateParams)(user_validation_1.UserValidation.findById), helper_1.TryCatch.tryCatchGlobe(this.deleteByIdBC));
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map