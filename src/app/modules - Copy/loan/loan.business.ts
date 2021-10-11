import {BaseBusiness} from '../BaseBusiness'
import {ILoan} from "./loan.types";
import {LoanRepository} from "./loan.repository";


class LoanBusiness extends BaseBusiness<ILoan> {
    private _loanRepository: LoanRepository;

    constructor() {
        super(new LoanRepository())
        this._loanRepository = new LoanRepository();
    }
}


Object.seal(LoanBusiness);
export = LoanBusiness;