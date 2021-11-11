import { BaseRepository } from "../BaseRepository";
import { EmailMd } from "./email.model";
import { IEmail, IMEmail } from "./email.types";

export class EmailRepository extends BaseRepository<IEmail, IMEmail> {
    constructor() {
        super(EmailMd, 'email_id', ['*'], ['created_at'], []);
    }
};