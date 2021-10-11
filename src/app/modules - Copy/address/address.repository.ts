import {BaseRepository} from "../BaseRepository";
import {IAddress} from "./address.types";
import addressModel from "./address.model";


export class AddressRepository extends BaseRepository<IAddress> {
    constructor () {
        super(addressModel);
    }
}