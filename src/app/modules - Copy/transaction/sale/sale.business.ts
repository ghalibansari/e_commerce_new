import {BaseBusiness} from '../../BaseBusiness'
import {ITransactionSale} from './sale.types';
import {TransactionSaleRepository} from './sale.repository';


class TransactionSaleBusiness extends BaseBusiness<ITransactionSale> {
    private _transactionSaleRepository: TransactionSaleRepository;

    constructor() {
        super(new TransactionSaleRepository())
        this._transactionSaleRepository = new TransactionSaleRepository();
    }
}

Object.seal(TransactionSaleBusiness);
export = TransactionSaleBusiness;