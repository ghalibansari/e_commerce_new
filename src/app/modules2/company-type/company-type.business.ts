import {BaseBusiness} from '../BaseBusiness'
import {CompanyTypeRepository} from "./company-type.repository"
import {ICompanyType} from "./company-type.types";


class CompanyTypeBusiness extends BaseBusiness<ICompanyType>{
    private _companyTypeRepository: CompanyTypeRepository;

    constructor() {
        super(new CompanyTypeRepository())
        this._companyTypeRepository = new CompanyTypeRepository();
    }
}


Object.seal(CompanyTypeBusiness);
export = CompanyTypeBusiness;