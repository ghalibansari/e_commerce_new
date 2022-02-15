import { BaseRepository } from "../BaseRepository";
import { AuthMd } from "./auth.model";
import { IAuth, IMAuth } from "./auth.types";

export class AuthRepository extends BaseRepository<IAuth, IMAuth> {
    constructor() {
        super(AuthMd, "auth_id", [''], [['created_at', 'DESC']], [])
    }
};
