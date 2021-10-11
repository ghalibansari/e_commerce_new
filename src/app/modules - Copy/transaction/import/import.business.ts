import {BaseBusiness} from '../../BaseBusiness'
import {ITransactionImport} from './import.types';
import {TransactionImportRepository} from './import.repository';


class TransactionImportBusiness extends BaseBusiness<ITransactionImport> {
    private _transactionImportRepository: TransactionImportRepository;

    constructor() {
        super(new TransactionImportRepository())
        this._transactionImportRepository = new TransactionImportRepository();
    }
}


Object.seal(TransactionImportBusiness);
export = TransactionImportBusiness;