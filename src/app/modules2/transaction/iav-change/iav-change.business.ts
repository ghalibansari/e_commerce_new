import {BaseBusiness} from '../../BaseBusiness'
import {ITransactionIav} from './iav-change.types';
import {TransactionIavChangeRepository} from './iav-change.repository';


class TransactionIavChangeBusiness extends BaseBusiness<ITransactionIav> {
    private _transactionIavChangeRepository: TransactionIavChangeRepository;

    constructor() {
        super(new TransactionIavChangeRepository())
        this._transactionIavChangeRepository = new TransactionIavChangeRepository();
    }
}


Object.seal(TransactionIavChangeBusiness);
export = TransactionIavChangeBusiness;