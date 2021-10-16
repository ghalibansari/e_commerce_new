"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const BaseRepository_1 = require("../BaseRepository");
const user_model_1 = __importDefault(require("./user.model"));
class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(user_model_1.default, "user_id", ['*'], [['last_name', 'DESC']], []);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map