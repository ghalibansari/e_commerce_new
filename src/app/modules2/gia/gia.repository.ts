import {BaseRepository} from "../BaseRepository";
import giaModel from "./gia.model";
import {IGia} from "./gia.types";


export class GiaRepository extends BaseRepository<IGia> {
    constructor () {
        super(giaModel);
    }
}