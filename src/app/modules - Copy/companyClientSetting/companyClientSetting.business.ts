import {BaseBusiness} from '../BaseBusiness'
import {ICompanyClientSetting} from "./companyClientSetting.types";
import {CompanyClientSettingRepository} from "./companyClientSetting.repository";


class CompanyClientSettingBusiness extends BaseBusiness<ICompanyClientSetting> {
    private _diamondMatchSettingRepositoryRepository: CompanyClientSettingRepository;

    constructor() {
        super(new CompanyClientSettingRepository())
        this._diamondMatchSettingRepositoryRepository = new CompanyClientSettingRepository();
    }
}


Object.seal(CompanyClientSettingBusiness);
export = CompanyClientSettingBusiness;