import {BaseBusiness} from "../BaseBusiness";
import {CompanySubTypeRepository} from "./company-sub-type.repository";
import { object } from "joi";
import {ICompanySubType} from "./company-sub-type.types";

class CompanySubTypeBusiness extends BaseBusiness<ICompanySubType> {
    private _companySubTypeRepository: CompanySubTypeRepository;

    constructor() {
        super(new CompanySubTypeRepository())
        this._companySubTypeRepository = new CompanySubTypeRepository()
    }
}

Object.seal(CompanySubTypeBusiness)
export = CompanySubTypeBusiness