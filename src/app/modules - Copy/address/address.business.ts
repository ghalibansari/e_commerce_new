import {BaseBusiness} from '../BaseBusiness'
import {AddressRepository} from "./address.repository";
import {IAddress} from "./address.types";


class AddressBusiness extends BaseBusiness<IAddress>{
    private _addressRepository: AddressRepository;

    constructor() {
        super(new AddressRepository())
        this._addressRepository = new AddressRepository();
    }
}


Object.seal(AddressBusiness);
export = AddressBusiness;