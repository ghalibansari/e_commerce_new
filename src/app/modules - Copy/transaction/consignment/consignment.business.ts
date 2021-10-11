import {BaseBusiness} from '../../BaseBusiness'
import {ITransactionConsignment} from './consignment.types';
import {TransactionConsignmentRepository} from './consignment.repository';


class TransactionConsignmentBusiness extends BaseBusiness<ITransactionConsignment> {
    private _transactionConsignmentRepository: TransactionConsignmentRepository;

    constructor() {
        super(new TransactionConsignmentRepository())
        this._transactionConsignmentRepository = new TransactionConsignmentRepository();
    }
}


Object.seal(TransactionConsignmentBusiness);
export = TransactionConsignmentBusiness;