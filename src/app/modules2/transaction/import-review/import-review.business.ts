import {BaseBusiness} from '../../BaseBusiness'
import {ITransactionImportReview} from './import-review.types';
import {TransactionImportReviewRepository} from './import-review.repository';


class TransactionImportReviewBusiness extends BaseBusiness<ITransactionImportReview> {
    private _transactionImportReviewRepository: TransactionImportReviewRepository;

    constructor() {
        super(new TransactionImportReviewRepository())
        this._transactionImportReviewRepository = new TransactionImportReviewRepository();
    }
}


Object.seal(TransactionImportReviewBusiness);
export = TransactionImportReviewBusiness;