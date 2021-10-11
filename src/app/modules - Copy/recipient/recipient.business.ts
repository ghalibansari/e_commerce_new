import {BaseBusiness} from '../BaseBusiness'
import {RecipientRepository} from "./recipient.repository";
import {IRecipient} from "./recipient.types";


class RecipientBusiness extends BaseBusiness<IRecipient> {
    private _recipientRepository: RecipientRepository;

    constructor() {
        super(new RecipientRepository())
        this._recipientRepository = new RecipientRepository();
    }
}


Object.seal(RecipientBusiness);
export = RecipientBusiness;