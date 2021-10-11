import {BaseBusiness} from '../../BaseBusiness'
import { ITransactionDm } from './diamond-match.types';
import { TransactionDmRepository } from './diamond-match.repository';


class TransactionDmBusiness extends BaseBusiness<ITransactionDm> {
    private _transactionDmRepository: TransactionDmRepository;

    constructor() {
        super(new TransactionDmRepository())
        this._transactionDmRepository = new TransactionDmRepository();
    }
}

Object.seal(TransactionDmBusiness);
export = TransactionDmBusiness;