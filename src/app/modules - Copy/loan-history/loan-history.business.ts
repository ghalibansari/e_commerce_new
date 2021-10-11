import {BaseBusiness} from '../BaseBusiness'
import {ILoanHistory} from "./loan-history.types";
import {LoanHistoryRepository} from "./loan-history.repository";


class LoanHistoryBusiness extends BaseBusiness<ILoanHistory> {
    private _loanHistoryRepository: LoanHistoryRepository;

    constructor() {
        super(new LoanHistoryRepository())
        this._loanHistoryRepository = new LoanHistoryRepository();
    }
}


Object.seal(LoanHistoryBusiness);
export = LoanHistoryBusiness;