import { BaseBusiness } from '../BaseBusiness'
import { SummaryReportRepository } from "./summary.repository"
import { ISummaryReport } from "./summary.types";


class SummaryReportBusiness extends BaseBusiness<ISummaryReport> {
    private _summaryReportRepository: SummaryReportRepository;

    constructor() {
        super(new SummaryReportRepository())
        this._summaryReportRepository = new SummaryReportRepository();
    }
}


Object.seal(SummaryReportBusiness);
export = SummaryReportBusiness;