import { BaseRepository } from "../BaseRepository";
import { IAuth, IMAuth } from "./auth.types";
import { AuthMd } from "./auth.model";

export class AuthRepository extends BaseRepository<IAuth, IMAuth> {
    constructor() {
        super(AuthMd, "auth_id", ['*'], [['created_at', 'DESC']], [])
    }
};
