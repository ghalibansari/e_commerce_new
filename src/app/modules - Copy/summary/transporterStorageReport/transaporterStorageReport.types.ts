import {Document, ObjectId} from "mongoose";
import { ICompany } from "../../company/company.types";

export interface ITransporterStorageReport extends Document {
    ref: string;
    transitId: ObjectId;
    tagId: string;
    company: string;
    companyId: ICompany['_id'];
    reportLab: string;
    reportNumber: string
    caratWeight: number
    shape: string;
    color: string;
    clarity: string;
    cut: string;
    value: number;
    dismissed: string;
    stages: string;
    nonMatchStages: string;
    returnDate: Date;
    isActive: boolean
    isDeleted: boolean
    createdAt:Date;

}
