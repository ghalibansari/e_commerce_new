import {BaseBusiness} from '../BaseBusiness'
import { ClientPriceRepository } from './client-price.repository';
import { IClientPrice } from './client-price.types';


class ClientPriceBusiness extends BaseBusiness<IClientPrice> {
    private _clientPriceRepository: ClientPriceRepository;

    constructor() {
        super(new ClientPriceRepository())
        this._clientPriceRepository = new ClientPriceRepository();
    }
}


Object.seal(ClientPriceBusiness);
export = ClientPriceBusiness;