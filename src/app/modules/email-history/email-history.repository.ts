import { BaseRepository } from "../BaseRepository";
import { EmailHistoryMd } from "./email-history.model";
import { IEmailHistory, IMEmailHistory } from "./email-history.types";

export class EmailHistoryRepository extends BaseRepository<IEmailHistory, IMEmailHistory> {
    constructor() {
        super(EmailHistoryMd, 'email_id', ['*'], ['created_at'], []);
    }
};