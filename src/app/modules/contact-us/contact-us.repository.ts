import { BaseRepository } from "../BaseRepository";
import { ContactUsMd } from "./contact-us.model";
import { IContactUs,IMContactUs } from "./contact-us.type";

export class ContactUsRepository extends BaseRepository<IContactUs, IMContactUs> {
    constructor() {
        super(ContactUsMd, 'contact_us_id', ['*'], ['created_at'], []);
    }
}