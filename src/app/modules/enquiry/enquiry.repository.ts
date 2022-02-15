import { BaseRepository } from "../BaseRepository";
import { EnquiryMd } from "./enquiry.model";
import { IEnquiry, IMEnquiry } from "./enquiry.type";

export class EnquiryRepository extends BaseRepository<IEnquiry, IMEnquiry> {
    constructor() {
        super(EnquiryMd, 'enquiry_id', [''], ['created_at'], []);
    }
}